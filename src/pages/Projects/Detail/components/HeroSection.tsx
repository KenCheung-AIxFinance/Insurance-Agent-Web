import React from 'react';
import { motion } from 'framer-motion';
import { Case } from '@/types/project';
import {
    Calendar,
    Clock,
    Tag,
    ArrowLeft,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/pages/Projects/components/StatusBadge';

interface HeroSectionProps {
    project: Case;
}

const HeroSection: React.FC<HeroSectionProps> = ({ project }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full mb-12"
        >
            {/* Glass Card Container */}
            <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 p-8 sm:p-10">

                {/* Abstract Background Gradient Blob */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/projects')}
                        className="group text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all duration-300 rounded-full px-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">返回項目列表</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-900 hover:bg-white/50 rounded-full"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <StatusBadge status={project.status} className="px-3 py-1 text-xs" />
                            <span className="text-gray-400 text-sm font-medium tracking-wider">#{project.case_id.slice(0, 8)}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 tracking-tight mb-4">
                            {project.client_name}
                        </h1>

                        <p className="text-lg text-gray-600 font-medium max-w-2xl leading-relaxed">
                            {project.title || '全方位保險規劃方案'}
                        </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="flex gap-4 md:gap-8">
                        <div className="flex flex-col items-center justify-center p-2 min-w-[80px]">
                            <Calendar className="w-5 h-5 text-indigo-500 mb-2" />
                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">建立日期</div>
                            <div className="text-sm font-bold text-gray-800 mt-1">
                                {new Date(project.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                        </div>

                        <div className="w-px bg-gray-300/50 h-10 self-center" />

                        <div className="flex flex-col items-center justify-center p-2 min-w-[80px]">
                            <Clock className="w-5 h-5 text-purple-500 mb-2" />
                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">更新日期</div>
                            <div className="text-sm font-bold text-gray-800 mt-1">
                                {new Date(project.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                        </div>

                        {project.tags && project.tags.length > 0 && (
                            <>
                                <div className="w-px bg-gray-300/50 h-10 self-center" />
                                <div className="flex flex-col items-center justify-center p-2 min-w-[80px]">
                                    <Tag className="w-5 h-5 text-emerald-500 mb-2" />
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">標籤</div>
                                    <div className="text-sm font-bold text-gray-800 mt-1">{project.tags.length}</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HeroSection;
