
import React, { useState, useMemo } from 'react';
import { Search, Plus, MapPin } from 'lucide-react';
import { US_RESORTS } from '../constants';
import { Resort } from '../types';

interface ResortSearchProps {
  onAddResort: (resort: Resort) => void;
  onAddCustomResort: (name: string) => void;
  existingIds: Set<string>;
}

const ResortSearch: React.FC<ResortSearchProps> = ({ onAddResort, onAddCustomResort, existingIds }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredResorts = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return US_RESORTS.filter(
      (r) => 
        !existingIds.has(r.id) && 
        (
          r.name.toLowerCase().includes(lowerQuery) || 
          r.region.toLowerCase().includes(lowerQuery) ||
          r.locationKeywords?.some(k => k.toLowerCase().includes(lowerQuery))
        )
    ).slice(0, 8);
  }, [query, existingIds]);

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-shadow duration-200"
          placeholder="Search for a mountain or city (e.g. Denver, SLC)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>

      {isOpen && query.length > 0 && (
        <div className="absolute mt-1 w-full bg-white shadow-lg max-h-80 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {filteredResorts.map((resort) => (
            <div
              key={resort.id}
              className="cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-slate-50 border-b border-slate-50 last:border-0"
              onClick={() => {
                onAddResort(resort);
                setQuery('');
                setIsOpen(false);
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-900 block">{resort.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">{resort.region}</span>
                    {resort.locationKeywords && (
                      <span className="text-slate-400 text-xs hidden sm:inline-block">
                        Near: {resort.locationKeywords.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {resort.passAffiliation?.map(pass => (
                    <span key={pass} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {pass}
                    </span>
                  ))}
                  <Plus className="h-5 w-5 text-blue-500 ml-2" />
                </div>
              </div>
            </div>
          ))}

          {/* Add Custom Resort Option */}
          <div
            className="cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-blue-50 bg-slate-50 border-t border-slate-100"
            onClick={() => {
               onAddCustomResort(query);
               setQuery('');
               setIsOpen(false);
            }}
          >
            <div className="flex items-center text-blue-600">
               <div className="bg-blue-100 p-1.5 rounded-full mr-3">
                 <Plus className="w-4 h-4" />
               </div>
               <div>
                 <span className="font-semibold block">Create "{query}"</span>
                 <span className="text-xs text-slate-500">Add a resort not in our database</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResortSearch;
