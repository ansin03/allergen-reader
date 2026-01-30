
import React from 'react';
import { ScanResult } from '../types';

interface ResultCardProps {
  result: ScanResult;
  onClose: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onClose }) => {
  const isSafe = result.safetyRating === 'safe';
  const isDanger = result.safetyRating === 'danger';
  const isWarning = result.safetyRating === 'warning';

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`p-6 ${
        isSafe ? 'bg-green-50' : 
        isDanger ? 'bg-red-50' : 'bg-orange-50'
      }`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl ${
              isSafe ? 'bg-green-500' : 
              isDanger ? 'bg-red-500' : 'bg-orange-500'
            } text-white`}>
              {isSafe && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
              {isDanger && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
              {isWarning && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${
                isSafe ? 'text-green-800' : 
                isDanger ? 'text-red-800' : 'text-orange-800'
              }`}>
                {isSafe ? 'Looks Safe!' : isDanger ? 'Allergen Alert!' : 'Precautionary Alert'}
              </h3>
              <p className={`text-sm ${
                isSafe ? 'text-green-600' : 
                isDanger ? 'text-red-600' : 'text-orange-600'
              }`}>
                Language detected: {result.originalLanguage}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {result.detectedAllergens.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Matched Ingredients</h4>
            <div className="space-y-3">
              {result.detectedAllergens.map((allergen, idx) => (
                <div key={idx} className="flex flex-col p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="font-bold text-gray-800">{allergen.ingredient}</span>
                  </div>
                  <div className="mt-1 ml-4 flex flex-wrap gap-1">
                    {allergen.matchedAllergens.map((m, i) => (
                      <span key={i} className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">
                        {m}
                      }</span>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 ml-4 leading-relaxed italic">
                    "{allergen.explanation}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.translation && (
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-1">English Translation</h4>
                <p className="text-sm text-blue-900 leading-relaxed line-clamp-3">
                    {result.translation}
                </p>
            </div>
        )}

        <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">All Ingredients</h4>
            <div className="flex flex-wrap gap-1.5">
                {result.ingredients.map((ing, idx) => (
                    <span key={idx} className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        result.detectedAllergens.some(da => da.ingredient.toLowerCase() === ing.toLowerCase())
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                        {ing}
                    </span>
                ))}
            </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-200 active:scale-95 transition-transform"
        >
          Scan Again
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
