
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Scanner from './components/Scanner';
import PreferenceSettings from './components/PreferenceSettings';
import ResultCard from './components/ResultCard';
import { Allergen, HistoryItem, ScanResult } from './types';
import { DEFAULT_ALLERGENS } from './constants';
import { analyzeLabel } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'preferences' | 'history'>('scan');
  const [allergens, setAllergens] = useState<Allergen[]>(DEFAULT_ALLERGENS);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedAllergens = localStorage.getItem('allergen_prefs');
    const savedHistory = localStorage.getItem('scan_history');
    if (savedAllergens) setAllergens(JSON.parse(savedAllergens));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('allergen_prefs', JSON.stringify(allergens));
  }, [allergens]);

  useEffect(() => {
    localStorage.setItem('scan_history', JSON.stringify(history));
  }, [history]);

  const handleToggleAllergen = (id: string) => {
    setAllergens(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const handleAddAllergen = (name: string) => {
    const newA: Allergen = {
      id: Date.now().toString(),
      name,
      enabled: true
    };
    setAllergens(prev => [...prev, newA]);
  };

  const handleCapture = async (base64: string) => {
    setIsLoading(true);
    setCurrentResult(null);
    try {
      const activeAllergenNames = allergens.filter(a => a.enabled).map(a => a.name);
      const result = await analyzeLabel(base64, activeAllergenNames);
      
      setCurrentResult(result);
      
      const newHistoryItem: HistoryItem = {
        ...result,
        id: Date.now().toString(),
        imageUrl: `data:image/jpeg;base64,${base64}`
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 20)); // Keep last 20
    } catch (err) {
      console.error(err);
      alert("Failed to analyze image. Please try again with a clearer photo.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch(activeTab) {
      case 'scan': return 'Scan Label';
      case 'preferences': return 'Settings';
      case 'history': return 'Activity';
      default: return 'AllergenSafe';
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} title={getTitle()}>
      {activeTab === 'scan' && (
        <div className="flex flex-col space-y-4">
          {!isLoading && !currentResult && <Scanner onCapture={handleCapture} />}
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 px-10 text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-100 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-20 h-20 border-t-4 border-blue-600 rounded-full animate-spin"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-800">Analyzing ingredients...</h3>
                <p className="text-sm text-gray-500">Our AI is reading the label and checking your allergen preferences.</p>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
              </div>
              <style>{`
                @keyframes loading {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(300%); }
                }
              `}</style>
            </div>
          )}

          {currentResult && (
            <div className="px-6 py-4">
              <ResultCard result={currentResult} onClose={() => setCurrentResult(null)} />
            </div>
          )}
        </div>
      )}

      {activeTab === 'preferences' && (
        <PreferenceSettings 
          allergens={allergens} 
          onToggle={handleToggleAllergen} 
          onAdd={handleAddAllergen} 
        />
      )}

      {activeTab === 'history' && (
        <div className="p-6 space-y-4">
          {history.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p className="text-gray-500 font-medium">No scan history yet</p>
              <button 
                onClick={() => setActiveTab('scan')}
                className="text-blue-600 font-bold"
              >
                Start your first scan
              </button>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center space-x-4 shadow-sm active:bg-gray-50 transition-colors" onClick={() => {
                setCurrentResult(item);
                setActiveTab('scan');
              }}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  item.safetyRating === 'safe' ? 'bg-green-100 text-green-600' :
                  item.safetyRating === 'danger' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {item.safetyRating === 'safe' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">
                    {item.detectedAllergens.length > 0 
                      ? `${item.detectedAllergens.length} Allergens Found` 
                      : 'Safe Ingredients Detected'}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500 mt-0.5">
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{item.originalLanguage}</span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            ))
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;
