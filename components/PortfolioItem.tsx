
import React, { useState } from 'react';
import { X, MapPin, CalendarClock, TrendingUp, ExternalLink, Clock, ChevronDown, Edit2, Check } from 'lucide-react';
import { PortfolioItem as IPortfolioItem, Resort } from '../types';

interface PortfolioItemProps {
  item: IPortfolioItem;
  onRemove: (id: string) => void;
  onUpdateDays: (id: string, days: number) => void;
  onUpdateConsecutive: (id: string, isConsecutive: boolean) => void;
  onUpdateBooking: (id: string, isAdvance: boolean) => void;
  onUpdateDetails: (id: string, updates: Partial<Resort>) => void;
  marginalCost?: number;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ 
  item, onRemove, onUpdateDays, onUpdateConsecutive, onUpdateBooking, onUpdateDetails, marginalCost 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Local state for edit form
  const [editForm, setEditForm] = useState({
    dayTicketPrice: item.dayTicketPrice,
    advanceTicketPrice: item.advanceTicketPrice || item.dayTicketPrice,
    seasonPassPrice: item.seasonPassPrice || '',
    isEpic: item.passAffiliation?.includes('Epic') || false,
    isIkon: item.passAffiliation?.includes('Ikon') || false,
  });

  const handleSaveDetails = () => {
    const newAffiliations = [];
    if (editForm.isEpic) newAffiliations.push('Epic');
    if (editForm.isIkon) newAffiliations.push('Ikon');

    onUpdateDetails(item.id, {
      dayTicketPrice: Number(editForm.dayTicketPrice),
      advanceTicketPrice: Number(editForm.advanceTicketPrice),
      seasonPassPrice: editForm.seasonPassPrice ? Number(editForm.seasonPassPrice) : undefined,
      passAffiliation: newAffiliations
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm group hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-2">
          {/* Header & Title with Dropdown Trigger */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm font-bold text-slate-900 leading-tight hover:text-blue-600 transition-colors flex items-center gap-1 group/title text-left"
            >
              {item.name}
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isEditing ? 'rotate-180' : ''}`} />
            </button>
            
            {item.websiteUrl && (
              <a 
                href={item.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-300 hover:text-blue-500 transition-colors"
                title="Visit Official Website"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="flex items-center text-slate-500 text-xs mt-0.5">
            <MapPin className="w-3 h-3 mr-0.5" />
            {item.region}
          </div>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="text-slate-300 hover:text-red-500 transition-colors -mt-1 -mr-1 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Edit Details Panel */}
      {isEditing && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-900">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-slate-700 flex items-center gap-1">
              <Edit2 className="w-3 h-3" /> Edit Pricing Data
            </h4>
            <button onClick={handleSaveDetails} className="bg-blue-600 text-white px-2 py-0.5 rounded flex items-center gap-1 hover:bg-blue-700">
              <Check className="w-3 h-3" /> Save
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
             <div>
               <label className="block text-slate-600 font-medium mb-0.5">Window Price</label>
               <div className="relative">
                 <span className="absolute left-2 top-1.5 text-slate-400">$</span>
                 <input 
                    type="number" 
                    className="w-full bg-white text-slate-900 pl-5 pr-2 py-1 border border-slate-300 rounded focus:border-blue-500 focus:outline-none placeholder-slate-400"
                    value={editForm.dayTicketPrice}
                    onChange={(e) => setEditForm({...editForm, dayTicketPrice: Number(e.target.value)})}
                 />
               </div>
             </div>
             <div>
               <label className="block text-slate-600 font-medium mb-0.5">Advance Price</label>
               <div className="relative">
                 <span className="absolute left-2 top-1.5 text-slate-400">$</span>
                 <input 
                    type="number" 
                    className="w-full bg-white text-slate-900 pl-5 pr-2 py-1 border border-slate-300 rounded focus:border-blue-500 focus:outline-none placeholder-slate-400"
                    value={editForm.advanceTicketPrice}
                    onChange={(e) => setEditForm({...editForm, advanceTicketPrice: Number(e.target.value)})}
                 />
               </div>
             </div>
             <div className="col-span-2">
               <label className="block text-slate-600 font-medium mb-0.5">Season Pass Price</label>
               <div className="relative">
                 <span className="absolute left-2 top-1.5 text-slate-400">$</span>
                 <input 
                    type="number" 
                    placeholder="N/A"
                    className="w-full bg-white text-slate-900 pl-5 pr-2 py-1 border border-slate-300 rounded focus:border-blue-500 focus:outline-none placeholder-slate-400"
                    value={editForm.seasonPassPrice}
                    onChange={(e) => setEditForm({...editForm, seasonPassPrice: e.target.value})}
                 />
               </div>
             </div>
          </div>
          <div className="pt-2 border-t border-slate-200">
             <label className="block text-slate-600 font-medium mb-1">Pass Affiliation</label>
             <div className="flex gap-3">
               <label className="flex items-center gap-1 cursor-pointer text-slate-700">
                 <input 
                   type="checkbox" 
                   checked={editForm.isEpic} 
                   onChange={(e) => setEditForm({...editForm, isEpic: e.target.checked})}
                   className="rounded text-blue-600 focus:ring-blue-500 bg-white border-slate-300" 
                 />
                 Epic
               </label>
               <label className="flex items-center gap-1 cursor-pointer text-slate-700">
                 <input 
                   type="checkbox" 
                   checked={editForm.isIkon} 
                   onChange={(e) => setEditForm({...editForm, isIkon: e.target.checked})}
                   className="rounded text-blue-600 focus:ring-blue-500 bg-white border-slate-300" 
                 />
                 Ikon
               </label>
             </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {/* Days Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
             <label className="text-xs font-medium text-slate-600">Days Planned</label>
             <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {item.days}
             </span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={item.days}
            onChange={(e) => onUpdateDays(item.id, parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
          />
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          
          {/* Consecutive Toggle */}
          {item.days > 1 ? (
             <div className="col-span-1">
               <div className="text-[10px] text-slate-500 font-medium mb-1 flex items-center gap-1">
                 <CalendarClock className="w-3 h-3" /> Consecutive?
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={!!item.consecutiveDays}
                  onChange={(e) => onUpdateConsecutive(item.id, e.target.checked)}
                />
                <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
             </div>
          ) : (
            <div className="col-span-1"></div>
          )}

          {/* Booking Timing Toggle */}
          <div className="col-span-1 flex flex-col items-end">
             <div className="text-[10px] text-slate-500 font-medium mb-1 flex items-center gap-1">
               <Clock className="w-3 h-3" /> Booking?
             </div>
             <div className="flex bg-slate-100 rounded-lg p-0.5 w-fit">
               <button
                 onClick={() => onUpdateBooking(item.id, false)}
                 className={`text-[10px] px-2 py-0.5 rounded-md transition-all ${!item.isAdvanceBooking ? 'bg-white shadow-sm text-slate-900 font-medium' : 'text-slate-400 hover:text-slate-600'}`}
                 title="Last Minute / Window Rate"
               >
                 Late
               </button>
               <button
                 onClick={() => onUpdateBooking(item.id, true)}
                 className={`text-[10px] px-2 py-0.5 rounded-md transition-all ${item.isAdvanceBooking ? 'bg-white shadow-sm text-blue-700 font-medium' : 'text-slate-400 hover:text-slate-600'}`}
                 title="Over 7 Days in Advance (Online Rate)"
               >
                 Early
               </button>
             </div>
          </div>

        </div>

        {/* Marginal Cost Indicator */}
        {marginalCost !== undefined && (
          <div className={`flex items-center justify-between pt-2 border-t border-slate-100 text-xs ${marginalCost === 0 ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
            <div className="flex items-center gap-1.5">
               <TrendingUp className="w-3.5 h-3.5" />
               <span>Add 1 day:</span>
            </div>
            <span className={`${marginalCost === 0 ? 'bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800' : ''}`}>
               {marginalCost === 0 ? 'Free' : `+$${marginalCost}`}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-3 flex flex-wrap gap-1">
         {item.passAffiliation && item.passAffiliation.length > 0 ? (
            item.passAffiliation.map(pass => (
              <span key={pass} className="inline-flex px-1.5 py-0.5 rounded-[4px] text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                {pass}
              </span>
            ))
         ) : (
           <span className="inline-flex px-1.5 py-0.5 rounded-[4px] text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
             Independent
           </span>
         )}
      </div>
    </div>
  );
};

export default PortfolioItem;
