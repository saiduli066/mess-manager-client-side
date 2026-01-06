import React from 'react';

const OfflinePage: React.FC = () => {
    return (
        <div
            className="fixed inset-0 z-[10000] bg-[#0F1729] flex flex-col items-center justify-center p-6 text-center font-sans"
            style={{
                minHeight: '100dvh',
                paddingTop: 'max(20px, env(safe-area-inset-top))',
                paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
                paddingLeft: 'max(20px, env(safe-area-inset-left))',
                paddingRight: 'max(20px, env(safe-area-inset-right))',
            }}
        >
            <div className="w-full max-w-sm bg-[#1A2332]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

                <div className="text-8xl mb-6 animate-pulse filter drop-shadow-[0_0_15px_rgba(157,71,222,0.5)]">
                    📡
                </div>

                <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                    You're Offline
                </h1>

                <p className="text-gray-400 mb-8 leading-relaxed text-base font-medium">
                    We couldn't verify your session. Please check your internet connection and try again.
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-[#7e22ce] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#6b1ab5] active:scale-95 transition-all shadow-lg shadow-purple-500/25 ring-offset-2 ring-offset-[#0F1729] focus:ring-2 focus:ring-purple-500"
                >
                    Try Again
                </button>
            </div>

            <div className="absolute bottom-10 text-gray-600 text-xs font-medium uppercase tracking-widest">
                UnMess &bull; Offline Mode
            </div>
        </div>
    );
};

export default OfflinePage;
