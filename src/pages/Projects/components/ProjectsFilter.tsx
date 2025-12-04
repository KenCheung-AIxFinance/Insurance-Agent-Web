import { Search } from 'lucide-react';
import { Input } from '@/components/general/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ProjectsFilterProps = {
  activeTab: string;
  searchTerm: string;
  viewType: 'grid' | 'list';
  onTabChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onViewChange: (type: 'grid' | 'list') => void;
};

export const ProjectsFilter = ({
  activeTab,
  searchTerm,
  viewType,
  onTabChange,
  onSearchChange,
  onViewChange,
}: ProjectsFilterProps) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full md:w-auto">
        <TabsTrigger value="all">全部</TabsTrigger>
        <TabsTrigger value="draft">草稿</TabsTrigger>
        <TabsTrigger value="in_progress">進行中</TabsTrigger>
        <TabsTrigger value="completed">已完成</TabsTrigger>
        <TabsTrigger value="archived">已封存</TabsTrigger>
      </TabsList>
    </Tabs>

    <div className="flex items-center gap-2 w-full md:w-auto">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="搜尋項目..."
          className="w-full pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex border rounded-md">
        <button
          onClick={() => onViewChange('grid')}
          className={`p-2 ${
            viewType === 'grid' ? 'bg-secondary' : 'hover:bg-muted'
          } rounded-l-md`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`p-2 ${
            viewType === 'list' ? 'bg-secondary' : 'hover:bg-muted'
          } rounded-r-md border-l`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);
