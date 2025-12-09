import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    ShoppingBag,
    CheckCircle,
    HelpCircle,
    LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingDockProps {
    activeSection: string;
    onNavigate: (sectionId: string) => void;
}

const navItems = [
    { id: 'kyc', label: '需求分析', icon: FileText, color: 'text-blue-500' },
    { id: 'products', label: '方案建議', icon: ShoppingBag, color: 'text-purple-500' },
    { id: 'postsales', label: '投保跟進', icon: CheckCircle, color: 'text-emerald-500' },
    { id: 'faq', label: '智能問答', icon: HelpCircle, color: 'text-amber-500' },
];

const FloatingDock: React.FC<FloatingDockProps> = ({ activeSection, onNavigate }) => {
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5 ring-1 ring-black/5">

                {/* Navigation Items */}
                {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    const isHovered = hoveredTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            onMouseEnter={() => setHoveredTab(item.id)}
                            onMouseLeave={() => setHoveredTab(null)}
                            className={cn(
                                "relative group flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ease-out",
                                isActive ? "bg-white shadow-sm ring-1 ring-black/5" : "hover:bg-white/50"
                            )}
                        >
                            {/* Active Indicator Dot */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeDot"
                                    className="absolute -top-1 w-1 h-1 bg-gray-800 rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            {/* Icon */}
                            <Icon
                                className={cn(
                                    "w-5 h-5 transition-all duration-300",
                                    isActive ? item.color : "text-gray-500 group-hover:text-gray-900",
                                    isHovered && "scale-110"
                                )}
                            />

                            {/* Tooltip Label */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                        animate={{ opacity: 1, y: -16, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.8 }}
                                        className="absolute -top-2 bg-gray-900 text-white text-[10px] font-medium py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap"
                                    >
                                        {item.label}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FloatingDock;
