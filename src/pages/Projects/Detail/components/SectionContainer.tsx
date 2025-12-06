import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionContainerProps {
    id: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ id, title, subtitle, children }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id={id} ref={ref} className="py-8 scroll-mt-24">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="mb-6 px-4">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
                    {subtitle && (
                        <p className="text-gray-500 mt-1 font-medium">{subtitle}</p>
                    )}
                </div>

                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl shadow-gray-200/50">
                    {children}
                </div>
            </motion.div>
        </section>
    );
};

export default SectionContainer;
