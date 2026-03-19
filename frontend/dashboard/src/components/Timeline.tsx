import React from 'react';
import { CheckCircle, Activity, XCircle } from 'lucide-react';

const Step = ({ title, status }: any) => {
    const getStatusColor = () => {
        switch (status) {
            case 'completed': return 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]';
            case 'running': return 'bg-blue-500 text-white animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]';
            case 'failed': return 'bg-red-500 text-white';
            case 'waiting': return 'bg-slate-800 text-slate-600';
            default: return 'bg-slate-800 text-slate-600';
        }
    };

    return (
        <div className="flex flex-col items-center flex-1 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all duration-500 border-2 ${status === 'waiting' ? 'border-slate-800' : 'border-slate-950'} ${getStatusColor()}`}>
                {status === 'completed' ? <CheckCircle size={18} /> :
                    status === 'running' ? <Activity size={18} className="animate-spin" /> :
                        status === 'failed' ? <XCircle size={18} /> :
                            <div className="w-2.5 h-2.5 bg-current rounded-full opacity-50" />}
            </div>
            <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${status === 'running' ? 'text-blue-400' : status === 'completed' ? 'text-green-400' : 'text-slate-700'}`}>
                {title}
            </span>
        </div>
    );
};

const Timeline = ({ currentStep }: any) => {
    const steps = [
        { id: 1, title: 'Analyze' },
        { id: 2, title: 'Retrieve' },
        { id: 3, title: 'Verify' },
        { id: 4, title: 'Explain' },
        { id: 5, title: 'Score' }
    ];

    const progress = (Math.max(0, currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="w-full relative px-6 py-4">
            {/* Background Line */}
            <div className="absolute top-9 left-0 w-full h-0.5 bg-slate-900 rounded-full"></div>

            {/* Active Progress Line */}
            <div
                className="absolute top-9 left-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                style={{ width: `${progress}%` }}
            ></div>

            <div className="flex justify-between relative">
                {steps.map((step) => (
                    <Step
                        key={step.id}
                        title={step.title}
                        status={currentStep > step.id ? 'completed' : currentStep === step.id ? 'running' : 'waiting'}
                    />
                ))}
            </div>
        </div>
    );
};

export default Timeline;
