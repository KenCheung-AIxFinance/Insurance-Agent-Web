import React, { useEffect, useState } from 'react';
import { Plus, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/general/ui/button';
import { api } from '@/config/api';
import { RecordFile, RecordFileType } from '@/types/project';
import RecordFileDrawer from './RecordFileDrawer';
import { Loader } from '@/components/general/ui/loader';

interface KYCModuleProps {
    projectId: string;
}

const KYCModule: React.FC<KYCModuleProps> = ({ projectId }) => {
    const [recordFiles, setRecordFiles] = useState<RecordFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<RecordFile | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);

    const fetchRecordFiles = async () => {
        try {
            // const data = await api.getRecordFiles(projectId);
            const dummyRecordFiles: RecordFile[] = [
                {
                    id: '1',
                    project_id: projectId,
                    type: RecordFileType.INSURANCE_NEEDS,
                    name: 'June 2022',
                    data: {
                        income: 10000,
                        expenses: 5000,
                    },
                    raw_text: 'Dummy bank statement raw text',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: '2',
                    project_id: projectId,
                    type: RecordFileType.RETIREMENT_BUDGET,
                    name: '2022',
                    data: {
                        deduction: 5000,
                        tax: 1000,
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: '3',
                    project_id: projectId,
                    type: RecordFileType.MEDICAL_EXPENSE,
                    name: 'June 2022',
                    data: {
                        medical_bills: 10000,
                        prescription_cost: 3000,
                    },
                    raw_text: 'Dummy medical statement raw text',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),

                }
            ]
            setRecordFiles(dummyRecordFiles);
        } catch (error) {
            console.error('Failed to fetch record files:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecordFiles();
    }, [projectId]);

    const handleCreateFile = async (type: RecordFileType) => {
        // Check if file of this type already exists
        const existing = recordFiles.find(f => f.type === type);
        if (existing) {
            setSelectedFile(existing);
            setIsDrawerOpen(true);
            return;
        }

        try {
            const newFile = await api.createRecordFile(projectId, {
                type,
                name: type === RecordFileType.INSURANCE_NEEDS ? '保險需求評估' :
                    type === RecordFileType.RETIREMENT_BUDGET ? '退休金預算' : '醫療費用預測',
                data: {},
                raw_text: ''
            });
            setRecordFiles([...recordFiles, newFile]);
            setSelectedFile(newFile);
            setIsDrawerOpen(true);
        } catch (error) {
            console.error('Failed to create record file:', error);
            // For demo/mock purposes, if API fails (e.g. backend not ready), create a local mock
            const mockFile: RecordFile = {
                id: Math.random().toString(36).substr(2, 9),
                project_id: projectId,
                type,
                name: type === RecordFileType.INSURANCE_NEEDS ? '保險需求評估' :
                    type === RecordFileType.RETIREMENT_BUDGET ? '退休金預算' : '醫療費用預測',
                data: {},
                raw_text: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            setRecordFiles([...recordFiles, mockFile]);
            setSelectedFile(mockFile);
            setIsDrawerOpen(true);
        }
    };

    const handleGenerateReport = async () => {
        setGeneratingReport(true);
        try {
            await api.generateKYCReport(projectId);
            // In a real app, we might poll for status or show a success message
            alert('KYC 報告生成請求已發送');
        } catch (error) {
            console.error('Failed to generate report:', error);
            alert('生成報告失敗 (後端接口可能尚未就緒)');
        } finally {
            setGeneratingReport(false);
        }
    };

    const handleUpdateFile = (updatedFile: RecordFile) => {
        setRecordFiles(recordFiles.map(f => f.id === updatedFile.id ? updatedFile : f));
    };

    if (loading) {
        return <div className="py-8"><Loader label="載入記錄檔案..." /></div>;
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">客戶畫像 & 偏好需求 (KYC)</h2>
                    <p className="text-sm text-gray-500 mt-1">管理客戶的各類評估記錄與需求分析</p>
                </div>
                <Button
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    {generatingReport ? <Loader className="text-white" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    生成 KYC 報告
                </Button>
            </div>

            {/* Record Files Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Insurance Needs Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        {recordFiles.find(f => f.type === RecordFileType.INSURANCE_NEEDS) && (
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                已建立
                            </span>
                        )}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">保險需求評估</h3>
                    <p className="text-sm text-gray-500 mb-4">評估身故保障缺口、家庭債務與財政資源。</p>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleCreateFile(RecordFileType.INSURANCE_NEEDS)}
                    >
                        {recordFiles.find(f => f.type === RecordFileType.INSURANCE_NEEDS) ? '查看詳情' : '新增評估'}
                    </Button>
                </div>

                {/* Retirement Budget Card (Placeholder) */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow opacity-60">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <FileText className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">退休金預算 (即將推出)</h3>
                    <p className="text-sm text-gray-500 mb-4">規劃退休生活開支與儲蓄目標。</p>
                    <Button variant="outline" className="w-full" disabled>
                        即將推出
                    </Button>
                </div>

                {/* Medical Expense Card (Placeholder) */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow opacity-60">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <FileText className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">醫療費用預測 (即將推出)</h3>
                    <p className="text-sm text-gray-500 mb-4">預估未來醫療開支與保險覆蓋。</p>
                    <Button variant="outline" className="w-full" disabled>
                        即將推出
                    </Button>
                </div>
            </div>

            {/* Drawer */}
            <RecordFileDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                recordFile={selectedFile}
                onUpdate={handleUpdateFile}
            />
        </div>
    );
};

export default KYCModule;
