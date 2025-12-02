
import React from 'react';
import { OptimizationResponse, OptimizationStrategy } from '../types';
import { CheckCircle2, TrendingDown, AlertCircle, Sparkles, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalysisResultProps {
  result: OptimizationResponse;
}

const StrategyCard: React.FC<{ strategy: OptimizationStrategy; isRecommended?: boolean }> = ({ strategy, isRecommended }) => {
  if (!strategy) return null;

  return (
    <div className={`rounded-xl border ${isRecommended ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-200 bg-white opacity-80 hover:opacity-100'} overflow-hidden transition-all duration-300`}>
      <div className={`p-6 ${isRecommended ? 'bg-white' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            {isRecommended && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white mb-3 uppercase tracking-wide">
                Best Value
              </span>
            )}
            <h3 className="text-xl font-bold text-slate-900">{strategy.strategyName}</h3>
            <p className="text-slate-500 text-sm mt-1">{strategy.reasoning}</p>
          </div>
          <div className="text-right flex-none">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ${(strategy.totalEstimatedCost || 0).toLocaleString()}
            </div>
            {isRecommended && strategy.savingsVsDayPasses > 0 && (
              <div className="text-sm text-emerald-600 font-bold flex items-center justify-end mt-1 bg-emerald-50 px-2 py-0.5 rounded ml-auto w-fit">
                <TrendingDown className="w-3 h-3 mr-1" />
                Save ${(strategy.savingsVsDayPasses || 0).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Breakdown</h4>
          {strategy.items && strategy.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm group">
              <div className="flex items-center text-slate-700">
                <div className={`w-1.5 h-1.5 rounded-full mr-3 ${isRecommended ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                <span className="font-medium">{item.description}</span>
                {item.notes && <span className="ml-2 text-slate-400 text-xs hidden sm:inline">({item.notes})</span>}
              </div>
              <span className="font-mono text-slate-900">${(item.cost || 0).toLocaleString()}</span>
            </div>
          ))}
          <div className="pt-3 mt-1 border-t border-slate-200/50 flex justify-between items-center font-bold text-slate-900">
             <span>Total</span>
             <span>${(strategy.totalEstimatedCost || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  if (!result || !result.recommended) return null;

  const recommendedCost = result.recommended.totalEstimatedCost || 0;
  
  // Prepare chart data
  const chartData = [
    {
      name: 'Best Plan',
      cost: recommendedCost,
      color: '#3b82f6' // blue-500
    },
    ...(result.alternatives || []).map((alt, i) => ({
      name: 'Pay As You Go', 
      cost: alt.totalEstimatedCost || 0,
      color: '#cbd5e1' // slate-300
    }))
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Recommendation Column */}
      <div className="lg:col-span-2 space-y-6">
         <StrategyCard strategy={result.recommended} isRecommended={true} />
         
         {/* Suggestions for Nearby Free Access */}
         {result.suggestions && result.suggestions.length > 0 && (
           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-5">
             <div className="flex items-center gap-2 mb-3">
               <Sparkles className="w-5 h-5 text-indigo-600" />
               <h3 className="font-bold text-indigo-900">Nearby Free Access</h3>
             </div>
             <p className="text-sm text-indigo-700 mb-4">
               Since your optimal plan includes a multi-mountain pass, you have access to these nearby resorts at no extra ticket cost:
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {result.suggestions.slice(0, 6).map(resort => (
                 <div key={resort.id} className="bg-white/60 p-2.5 rounded-lg border border-indigo-100 flex items-center justify-between">
                    <span className="font-medium text-slate-800 text-sm">{resort.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wide">{resort.region}</span>
                      {resort.passAffiliation?.includes('Epic') && <span className="w-2 h-2 rounded-full bg-amber-400" title="Epic"></span>}
                      {resort.passAffiliation?.includes('Ikon') && <span className="w-2 h-2 rounded-full bg-yellow-400" title="Ikon"></span>}
                    </div>
                 </div>
               ))}
             </div>
           </div>
         )}
         
         {/* Disclaimer */}
         <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 text-xs">
           <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
           <p>
             Prices are based on 2024/25 typical rates (e.g. Epic Day Pass tiers, Ikon Session). 
             Actual prices vary by purchase date. Blackout dates for "Base" or "Local" passes are not fully verified in this demo.
           </p>
         </div>
      </div>

      {/* Comparison Column */}
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Savings vs Window Rate</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} 
                  interval={0}
                  dy={10}
                />
                <YAxis 
                  hide={true} 
                  domain={[0, 'auto']}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Cost']}
                />
                <Bar dataKey="cost" radius={[6, 6, 6, 6]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
