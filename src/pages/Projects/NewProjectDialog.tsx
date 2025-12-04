import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/general/ui/button';
import { Input } from '@/components/general/ui/input';
import { Textarea } from '@/components/general/ui/textarea';
import { Label } from '@/components/ui/label';
import { TagSelector } from '@/components/general/TagSelector';
import { ProjectService } from '@/services/projectService';
import { TagService } from '@/services/tagService';
import { AIService } from '@/services/aiService';
import type { Tag, CreateCaseInput } from '@/types/project';

interface NewProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project?: any | null;
    onProjectCreated?: () => void;
    onProjectUpdated?: (data: CreateCaseInput) => Promise<void>;
}

export const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
    open,
    onOpenChange,
    project,
    onProjectCreated,
    onProjectUpdated,
}) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState(project?.title || '');
    const [clientName, setClientName] = useState(project?.client_name || '');
    const [summary, setSummary] = useState(project?.summary || '');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [isPolishing, setIsPolishing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load available tags and set initial values when dialog opens or project changes
    React.useEffect(() => {
        if (open) {
            loadTags();
            if (project) {
                setTitle(project.title);
                setClientName(project.client_name);
                setSummary(project.summary || '');
                setSelectedTags(project.tags?.map((name: string) => ({ id: name, name })) || []);
            }
        } else {
            // Reset form when dialog is closed
            if (!open) {
                setTitle('');
                setClientName('');
                setSummary('');
                setSelectedTags([]);
            }
        }
    }, [open, project]);

    const loadTags = async () => {
        try {
            const tags = await TagService.getAllTags();
            setAvailableTags(tags);
        } catch (error) {
            console.error('Failed to load tags:', error);
        }
    };

    const handlePolishSummary = async () => {
        if (!summary.trim() || isPolishing) return;

        setIsPolishing(true);
        try {
            const polishedText = (await AIService.polishSummary(summary));
            setSummary(polishedText.polished);
        } catch (error) {
            console.error('Failed to polish summary:', error);
            // TODO: Show error toast
        } finally {
            setIsPolishing(false);
        }
    };

    const handleCreateTag = async (tagName: string): Promise<Tag> => {
        // Create optimistic tag immediately
        const optimisticTag: Tag = {
            id: tagName,
            name: tagName,
        };

        // Add to availableTags immediately for search to work
        setAvailableTags(prev => [...prev, optimisticTag]);

        // Background API call
        try {
            const newTag = await TagService.createTag(tagName);

            // Update availableTags with the real tag from API
            setAvailableTags(prev =>
                prev.map(t => t.id === tagName ? newTag : t)
            );

            return newTag;
        } catch (error) {
            console.error('Failed to create tag:', error);
            // Remove the optimistic tag on error
            setAvailableTags(prev => prev.filter(t => t.id !== tagName));
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !clientName.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const projectData: CreateCaseInput = {
                title: title.trim(),
                client_name: clientName.trim(),
                summary: summary.trim(),
                tags: selectedTags.map((tag) => tag.name), // Send tag names as strings
                status: project?.status || 'draft',
            };

            if (project && onProjectUpdated) {
                // Update existing project
                await onProjectUpdated(projectData);
            } else {
                // Create new project
                const newProject = await ProjectService.createProject(projectData);
                onProjectCreated?.();
                // Navigate to the new project page
                navigate(`/projects/${newProject.case_id}`);
            }

            // Close dialog
            onOpenChange(false);
        } catch (error) {
            console.error(project ? 'Failed to update project:' : 'Failed to create project:', error);
            // TODO: Show error toast
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = title.trim() && clientName.trim();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{project ? '編輯項目' : '創建新項目'}</DialogTitle>
                    <DialogDescription>
                        {project ? '更新項目信息。' : '填寫以下信息以創建一個新的保險項目。'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            項目標題 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="例如：個人保險組合"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="clientName">
                            客戶名稱 <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="clientName"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="例如：張先生"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="summary">摘要</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handlePolishSummary}
                                disabled={!summary.trim() || isPolishing}
                                className="h-7 text-xs"
                            >
                                {isPolishing ? (
                                    <>
                                        <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                                        潤色中...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-1.5 h-3 w-3" />
                                        潤色
                                    </>
                                )}
                            </Button>
                        </div>
                        <Textarea
                            id="summary"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="輸入項目摘要，可以點擊潤色按鈕優化文字..."
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>標籤</Label>
                        <TagSelector
                            selectedTags={selectedTags}
                            availableTags={availableTags}
                            onTagsChange={setSelectedTags}
                            onCreateTag={handleCreateTag}
                            onTagDeleted={loadTags}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            取消
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {project ? '更新中...' : '創建中...'}
                                </>
                            ) : (
                                project ? '更新項目' : '創建項目'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
