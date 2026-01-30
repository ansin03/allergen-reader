
import React from 'react';
import { Allergen } from '../types';

interface PreferenceSettingsProps {
  allergens: Allergen[];
  onToggle: (id: string) => void;
  onAdd: (name: string) => void;
}

const PreferenceSettings: React.FC<PreferenceSettingsProps> = ({ allergens, onToggle, onAdd }) => {
  const [newAllergen, setNewAllergen] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAllergen.trim()) {
      onAdd(newAllergen.trim());
      setNewAllergen('');
    }
  };

  return (
    <div className="p-6 space-y-8 pb-20">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Your Allergen Profile</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select which ingredients you want us to watch out for.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Alerts</h3>
        <div className="grid grid-cols-1 gap-3">
          {allergens.map((allergen) => (
            <button
              key={allergen.id}
              onClick={() => onToggle(allergen.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${
                allergen.enabled 
                ? 'bg-red-50 border-red-500 ring-2 ring-red-500/10' 
                : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${allergen.enabled ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {allergen.enabled ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  )}
                </div>
                <span className={`font-semibold ${allergen.enabled ? 'text-red-900' : 'text-gray-600'}`}>{allergen.name}</span>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${allergen.enabled ? 'bg-red-500' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${allergen.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Add Custom Ingredient</h3>
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={newAllergen}
            onChange={(e) => setNewAllergen(e.target.value)}
            placeholder="E.g., Mushroom, Cilantro..."
            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-4 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          </button>
        </form>
      </div>

      <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200">
          <h4 className="font-bold flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Pro-Tip</span>
          </h4>
          <p className="mt-2 text-sm text-blue-50 leading-relaxed">
            Our AI scans for common scientific and alternate names of ingredients to ensure you're always protected.
          </p>
      </div>
    </div>
  );
};

export default PreferenceSettings;
