import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/config/api';
import { Case } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ArrowLeft, AlertCircle } from 'lucide-react';

// Modules
import KYCModule from './components/KYCModule';
import ProductRecommendationModule from './components/ProductRecommendationModule';
import PostSalesModule from './components/PostSalesModule';
import FAQModule from './components/FAQModule';

// New Layout Components
import HeroSection from './components/HeroSection';
import FloatingDock from './components/FloatingDock';
import SectionContainer from './components/SectionContainer';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('kyc');

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const data = await api.getProjectbyId(id);
                setProject(data);
            } catch (error) {
                console.error('Failed to fetch project:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    // Scroll Spy Logic
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['kyc', 'products', 'postsales', 'faq'];
            const scrollPosition = window.scrollY + 300; // Offset for better detection

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100, // Offset for header/padding
                behavior: 'smooth'
            });
            setActiveSection(sectionId);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader label="載入中..." />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
                <AlertCircle className="h-16 w-16 text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-md">The project you are looking for does not exist or has been removed.</p>
                <Button onClick={() => navigate('/projects')} className="bg-indigo-600 hover:bg-indigo-700">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Return to Projects
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-32 relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent" />
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px]" />
                <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
                <HeroSection project={project} />

                <div className="space-y-8">
                    <SectionContainer
                        id="kyc"
                        title="客戶需求分析"
                        subtitle="深入了解客戶背景與風險偏好"
                    >
                        <KYCModule projectId={project.case_id} />
                    </SectionContainer>

                    <SectionContainer
                        id="products"
                        title="專屬方案建議"
                        subtitle="基於分析結果的個性化保險組合"
                    >
                        <ProductRecommendationModule projectId={project.case_id} />
                    </SectionContainer>

                    <SectionContainer
                        id="postsales"
                        title="投保與售後跟進"
                        subtitle="文件簽署、核保進度與保單管理"
                    >
                        <PostSalesModule projectId={project.case_id} />
                    </SectionContainer>

                    <SectionContainer
                        id="faq"
                        title="智能問答助手"
                        subtitle="針對本案的 AI 輔助諮詢"
                    >
                        <FAQModule projectId={project.case_id} project={project} />
                    </SectionContainer>
                </div>
            </div>

            <FloatingDock activeSection={activeSection} onNavigate={scrollToSection} />
        </div>
    );
};

export default ProjectDetail;
