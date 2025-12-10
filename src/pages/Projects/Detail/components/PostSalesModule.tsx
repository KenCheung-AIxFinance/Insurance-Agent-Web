import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, ChevronDown, ChevronRight, FileCheck, CreditCard, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PostSalesModuleProps {
    projectId: string;
}

type StepStatus = 'completed' | 'current' | 'pending';

interface SubTask {
    id: string;
    label: string;
    isCompleted: boolean;
}

interface ProcessStep {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    status: StepStatus;
    subTasks: SubTask[];
}

const PostSalesModule: React.FC<PostSalesModuleProps> = ({ projectId }) => {
    // Mock initial state
    const [steps, setSteps] = useState<ProcessStep[]>([
        {
            id: 'kyc_docs',
            title: '投保資料收集',
            description: '收集並驗證客戶身分證明文件與住址證明',
            icon: FileCheck,
            status: 'completed',
            subTasks: [
                { id: 'id_card', label: '身分證副本 (已核實)', isCompleted: true },
                { id: 'address_proof', label: '住址證明', isCompleted: true },
                { id: 'income_proof', label: '入息證明', isCompleted: true },
            ]
        },
        {
            id: 'app_form',
            title: '表格填寫與簽署',
            description: '填寫投保申請書並進行電子簽署',
            icon: PenTool,
            status: 'current',
            subTasks: [
                { id: 'fill_form', label: '填寫投保申請書', isCompleted: true },
                { id: 'sign_form', label: '客戶電子簽署', isCompleted: false },
                { id: 'advisor_sign', label: '顧問簽署', isCompleted: false },
            ]
        },
        {
            id: 'payment',
            title: '首期保費繳付',
            description: '安排信用卡或是銀行轉帳授權',
            icon: CreditCard,
            status: 'pending',
            subTasks: [
                { id: 'payment_method', label: '確認繳費方式', isCompleted: false },
                { id: 'drs_form', label: 'DDA / 信用卡授權書', isCompleted: false },
                { id: 'payment_confirm', label: '確認過數', isCompleted: false },
            ]
        },
        {
            id: 'policy_issue',
            title: '核保與發單',
            description: '等待保險公司核保結果',
            icon: Clock,
            status: 'pending',
            subTasks: [
                { id: 'underwriting', label: '核保進行中', isCompleted: false },
                { id: 'pending_req', label: '補交文件 (如有)', isCompleted: false },
                { id: 'issue_policy', label: '正式發單', isCompleted: false },
            ]
        }
    ]);

    const [expandedStep, setExpandedStep] = useState<string>('app_form');

    const toggleSubTask = (stepId: string, taskId: string) => {
        setSteps(steps.map(step => {
            if (step.id !== stepId) return step;

            const newSubTasks = step.subTasks.map(task =>
                task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
            );

            // Auto update step status logic could go here
            // e.g., if all subtasks complete -> step status = completed

            return { ...step, subTasks: newSubTasks };
        }));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">投保進度追蹤</h3>
                    <p className="text-sm text-gray-500 mt-1">目前進度：表格填寫與簽署</p>
                </div>
                <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        進行中
                    </span>
                </div>
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-8">
                    {steps.map((step, index) => {
                        const isExpanded = expandedStep === step.id;
                        const StepIcon = step.icon;

                        return (
                            <div key={step.id} className="relative pl-14">
                                {/* Dot/Icon on Line */}
                                <div className={cn(
                                    "absolute left-0 top-0 w-12 h-12 rounded-full border-4 flex items-center justify-center bg-white z-10 transition-colors",
                                    step.status === 'completed' ? "border-green-500 text-green-600" :
                                        step.status === 'current' ? "border-blue-500 text-blue-600" :
                                            "border-gray-200 text-gray-400"
                                )}>
                                    {step.status === 'completed' ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <StepIcon className="w-5 h-5" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className={cn(
                                    "rounded-lg border transition-all duration-200 overflow-hidden",
                                    step.status === 'current' ? "border-blue-200 shadow-sm bg-blue-50/30" : "border-transparent"
                                )}>
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                        onClick={() => setExpandedStep(isExpanded ? '' : step.id)}
                                    >
                                        <div>
                                            <h4 className={cn(
                                                "font-medium text-lg",
                                                step.status === 'completed' ? "text-gray-900" :
                                                    step.status === 'current' ? "text-blue-900" : "text-gray-500"
                                            )}>
                                                {step.title}
                                            </h4>
                                            <p className="text-sm text-gray-500">{step.description}</p>
                                        </div>
                                        {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                                    </div>

                                    {/* Subtasks */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-gray-100 bg-white px-4 py-3"
                                            >
                                                <div className="space-y-3">
                                                    {step.subTasks.map(task => (
                                                        <div
                                                            key={task.id}
                                                            className="flex items-center group cursor-pointer"
                                                            onClick={() => toggleSubTask(step.id, task.id)}
                                                        >
                                                            <div className={cn(
                                                                "w-5 h-5 mr-3 rounded border flex items-center justify-center transition-colors",
                                                                task.isCompleted
                                                                    ? "bg-green-500 border-green-500"
                                                                    : "border-gray-300 group-hover:border-blue-400"
                                                            )}>
                                                                {task.isCompleted && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                                            </div>
                                                            <span className={cn(
                                                                "text-sm transition-colors",
                                                                task.isCompleted ? "text-gray-500 line-through" : "text-gray-700"
                                                            )}>
                                                                {task.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <Button variant="outline" className="mr-3">更新進度</Button>
                <Button className="bg-green-600 hover:bg-green-700">完成本階段</Button>
            </div>
        </div>
    );
};

export default PostSalesModule;
