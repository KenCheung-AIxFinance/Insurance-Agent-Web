import React, { useState } from 'react';
import { Check, X, Plus, Trash2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TagService } from '@/services/tagService';
import type { Tag } from '@/types/project';

interface TagSelectorProps {
    selectedTags: Tag[];
    availableTags: Tag[];
    onTagsChange: (tags: Tag[]) => void;
    onCreateTag: (tagName: string) => Promise<Tag>;
    onTagDeleted?: () => void; // Callback to refresh tags after deletion
    placeholder?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
    selectedTags,
    availableTags,
    onTagsChange,
    onCreateTag,
    onTagDeleted,
    placeholder = '選擇或創建標籤...',
}) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [deletingTags, setDeletingTags] = useState<Set<string>>(new Set());
    const [creatingTags, setCreatingTags] = useState<Set<string>>(new Set());

    const handleSelectTag = (tag: Tag) => {
        // Optimistic update - instant feedback
        const isSelected = selectedTags.some((t) => t.id === tag.id);
        if (isSelected) {
            onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
        } else {
            onTagsChange([...selectedTags, tag]);
        }
    };

    const handleRemoveTag = (tagId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        // Optimistic update - instant feedback
        onTagsChange(selectedTags.filter((t) => t.id !== tagId));
    };

    const handleDeleteTag = async (tag: Tag, e: React.MouseEvent) => {
        e.stopPropagation();

        // Optimistic update - show deleting state but don't block UI
        setDeletingTags(prev => new Set(prev).add(tag.id));

        // Remove from selected tags immediately
        onTagsChange(selectedTags.filter((t) => t.id !== tag.id));

        // Background API call
        try {
            await TagService.deleteTag(tag.name);
            // Success - refresh tags list
            onTagDeleted?.();
        } catch (error) {
            console.error('Failed to delete tag:', error);
            // On error, show message but keep the optimistic update
            // (tag is already removed from UI)
            alert('刪除標籤失敗，但已從當前列表移除');
        } finally {
            setDeletingTags(prev => {
                const next = new Set(prev);
                next.delete(tag.id);
                return next;
            });
        }
    };

    const handleCreateTag = async () => {
        if (!searchValue.trim()) return;

        const tagName = searchValue.trim();

        // Prevent duplicate creation
        if (creatingTags.has(tagName)) return;

        // Check if tag already exists in available tags but not selected
        const existingTag = availableTags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
        if (existingTag) {
            // If tag exists but not selected, select it
            if (!selectedTags.some(t => t.id === existingTag.id)) {
                onTagsChange([...selectedTags, existingTag]);
            }
            setSearchValue('');
            return;
        }

        // Optimistic update - create tag immediately in UI
        const tempTag: Tag = {
            id: `temp-${Date.now()}`, // Use a more unique temporary ID
            name: tagName,
        };

        // Add to selected tags immediately
        onTagsChange([...selectedTags, tempTag]);

        // Mark as creating
        setCreatingTags(prev => new Set(prev).add(tagName));

        // Clear search immediately
        setSearchValue('');

        // Background API call - parent will update availableTags
        try {
            const newTag = await onCreateTag(tagName);
            // Replace the temporary tag with the server-created tag
            onTagsChange([
                ...selectedTags.filter(t => t.id !== tempTag.id),
                newTag
            ]);
        } catch (error) {
            console.error('Failed to create tag:', error);
            // On error, remove the optimistically added tag
            onTagsChange(selectedTags.filter(t => t.id !== tempTag.id));
            alert('創建標籤失敗，請重試');
        } finally {
            setCreatingTags(prev => {
                const next = new Set(prev);
                next.delete(tagName);
                return next;
            });
        }
    };

    const filteredTags = availableTags.filter((tag) =>
        tag.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Only check availableTags (not selectedTags) to avoid matching temporary tags
    const showCreateOption = searchValue.trim() &&
        !availableTags.some((tag) => tag.name.toLowerCase() === searchValue.trim().toLowerCase());

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-start text-left font-normal min-h-[40px] h-auto"
                >
                    <div className="flex items-center flex-wrap gap-1.5 w-full">
                        {selectedTags.length === 0 ? (
                            <>
                                <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span className="text-muted-foreground">{placeholder}</span>
                            </>
                        ) : (
                            <>
                                {selectedTags.map((tag) => {
                                    const isCreating = creatingTags.has(tag.id); // Check if the tag (by its temporary ID/name) is being created
                                    return (
                                        <Badge
                                            key={tag.id}
                                            variant="secondary"
                                            className={cn(
                                                "pl-2.5 pr-1",
                                                isCreating && "opacity-60"
                                            )}
                                        >
                                            {tag.name}
                                            {isCreating && (
                                                <div className="ml-1.5 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            )}
                                            {!isCreating && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleRemoveTag(tag.id, e)}
                                                    className="ml-1.5 rounded-full hover:bg-muted p-0.5 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        </Badge>
                                    );
                                })}
                                <Plus className="h-4 w-4 flex-shrink-0 text-muted-foreground ml-auto" />
                            </>
                        )}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="搜索標籤..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandList>
                        {filteredTags.length === 0 && !showCreateOption && (
                            <CommandEmpty>
                                {searchValue ? '未找到標籤' : '暫無標籤'}
                            </CommandEmpty>
                        )}
                        {filteredTags.length > 0 && (
                            <CommandGroup heading="可用標籤">
                                {filteredTags.map((tag) => {
                                    const isSelected = selectedTags.some((t) => t.id === tag.id);
                                    const isDeleting = deletingTags.has(tag.id);
                                    return (
                                        <CommandItem
                                            key={tag.id}
                                            value={tag.name}
                                            onSelect={() => !isDeleting && handleSelectTag(tag)}
                                            disabled={isDeleting}
                                            className={cn(
                                                "flex items-center justify-between group",
                                                isDeleting && "opacity-50"
                                            )}
                                        >
                                            <div className="flex items-center flex-1">
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        isSelected ? 'opacity-100' : 'opacity-0'
                                                    )}
                                                />
                                                {tag.name}
                                                {isDeleting && (
                                                    <span className="ml-2 text-xs text-muted-foreground">(刪除中...)</span>
                                                )}
                                            </div>
                                            {!isDeleting && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteTag(tag, e)}
                                                    className="ml-2 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                    title="刪除標籤"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        )}
                        {showCreateOption && (
                            <CommandGroup>
                                <CommandItem
                                    onSelect={handleCreateTag}
                                    disabled={creatingTags.has(searchValue.trim())}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    創建新標籤: <span className="font-semibold ml-1">{searchValue}</span>
                                </CommandItem>
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
