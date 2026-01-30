
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'scan' | 'preferences' | 'history';
  onTabChange: (tab: 'scan' | 'preferences' | 'history') => void;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, title }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-white max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {/* iOS Status Bar Area */}
      <div className="h-10 bg-white flex items-center justify-between px-6 pt-4 shrink-0">
        <span className="text-sm font-semibold">9:41</span>
        <div className="flex space-x-1.5 items-center">
          <div className="w-4 h-4 bg-black rounded-full"></div>
          <div className="w-4 h-2 bg-black rounded-sm"></div>
        </div>
      </div>

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white z-10">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-24">
        {children}
      </main>

      {/* Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 safe-area-bottom z-50">
        <div className="flex justify-around py-3">
          <button 
            onClick={() => onTabChange('history')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'history' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-medium">History</span>
          </button>
          
          <button 
            onClick={() => onTabChange('scan')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'scan' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div className={`p-3 -mt-8 rounded-full shadow-lg ${activeTab === 'scan' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium pt-1">Scan</span>
          </button>

          <button 
            onClick={() => onTabChange('preferences')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'preferences' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="text-[10px] font-medium">Alerts</span>
          </button>
        </div>
        {/* iOS Home Indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-32 h-1 bg-black/10 rounded-full"></div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
