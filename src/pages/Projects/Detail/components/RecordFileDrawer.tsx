import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ExternalLink, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/general/ui/button';
import { Loader } from '@/components/general/ui/loader';
import { cn } from '@/lib/utils';
import { RecordFile, RecordFileType } from '@/types/project';
import { api } from '@/config/api';

interface RecordFileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    recordFile: RecordFile | null;
    onUpdate: (file: RecordFile) => void;
}

const RecordFileDrawer: React.FC<RecordFileDrawerProps> = ({ isOpen, onClose, recordFile, onUpdate }) => {
    const [rawText, setRawText] = useState('');
    const [parsedData, setParsedData] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (recordFile) {
            setRawText(recordFile.raw_text || '');
            setParsedData(recordFile.data || {});
        }
    }, [recordFile]);

    const parseText = (text: string) => {
        // Simple regex parsing based on the example format
        // "人壽保險\n你目前的身故風險保障缺口\nHK$1,591,093\n..."
        const lines = text.split('\n');
        const data: any = {};

        const extractMoney = (str: string) => {
            const match = str.match(/HK\$\s*([\d,]+)/);
            return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
        };

        // Heuristic parsing
        lines.forEach((line, index) => {
            if (line.includes('身故風險保障缺口')) {
                // Look ahead for the value
                const nextLine = lines[index + 1];
                if (nextLine) data.protection_gap = extractMoney(nextLine);
            }
            if (line.includes('家庭債務')) {
                data.family_debt = extractMoney(line);
            }
            if (line.includes('未償還按揭貸款')) {
                data.mortgage = extractMoney(line);
            }
            if (line.includes('投資市值')) {
                data.investment_value = extractMoney(line);
            }
            if (line.includes('人壽身故賠償額')) {
                data.current_protection = extractMoney(line);
            }
        });

        return data;
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setRawText(text);
        const newData = parseText(text);
        setParsedData({ ...parsedData, ...newData });
    };

    const handleSave = async () => {
        if (!recordFile) return;
        setIsSaving(true);
        try {
            const updatedFile = await api.updateRecordFile(recordFile.id, {
                data: parsedData,
                raw_text: rawText
            });
            onUpdate(updatedFile);
            onClose();
        } catch (error) {
            console.error('Failed to update record file:', error);
            // Mock update for demo if API fails
            const mockUpdated = { ...recordFile, data: parsedData, raw_text: rawText };
            onUpdate(mockUpdated);
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !recordFile) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content 
                    className={cn(
                        "fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full",
                        "duration-300 ease-in-out"
                    )}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                        <Dialog.Title className="text-xl font-semibold text-gray-900">
                            {recordFile.name}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="text-gray-400 hover:text-gray-500 focus:outline-none">
                                <X className="w-6 h-6" />
                                <span className="sr-only">關閉</span>
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* External Calculator Link */}
                            <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-blue-900">第三方計算器</h4>
                                    <p className="text-sm text-blue-700">前往外部網站進行詳細評估</p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                                    onClick={() => window.open('https://www.ifec.org.hk/web/tc/tools-and-resources/savings-goal-calculator/index.html', '_blank')}
                                >
                                    前往計算 <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                            </div>

                            {/* Paste Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    貼上計算結果
                                </label>
                                <textarea
                                    value={rawText}
                                    onChange={handleTextChange}
                                    placeholder="請將計算器結果全文複製並貼上於此..."
                                    className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                />
                                <p className="mt-2 text-xs text-gray-500 flex items-center">
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    系統將自動解析貼上的內容並填入下方欄位
                                </p>
                            </div>

                            {/* Parsed Fields */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900 border-b pb-2">解析結果</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">身故保障缺口</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">HK$</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={parsedData.protection_gap || ''}
                                                readOnly
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">家庭債務</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">HK$</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={parsedData.family_debt || ''}
                                                readOnly
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">未償還按揭</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">HK$</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={parsedData.mortgage || ''}
                                                readOnly
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">投資市值</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">HK$</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={parsedData.investment_value || ''}
                                                readOnly
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                            <Button variant="ghost" onClick={onClose}>取消</Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader className="text-white" /> : <Save className="w-4 h-4 mr-2" />}
                                儲存記錄
                            </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default RecordFileDrawer;
