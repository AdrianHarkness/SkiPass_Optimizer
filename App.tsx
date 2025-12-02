
import React, { useState, useMemo, useEffect } from 'react';
import { Mountain, Snowflake, Menu, X, Share2, Trash2, CheckCircle2, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { PortfolioItem, Resort } from './types';
import ResortSearch from './components/ResortSearch';
import PortfolioItemComponent from './components/PortfolioItem';
import AnalysisResult from './components/AnalysisResult';
import { calculateBestStrategy } from './services/pricingCalculator';
import SnowBackground from './components/SnowBackground';

const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // --- Persistence & Sharing Logic ---

  // 1. Load from URL or LocalStorage on Mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('plan');

    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        setPortfolio(decoded);
        // Clean URL without refresh
        window.history.replaceState({}, '', window.location.pathname);
      } catch (e) {
        console.error("Failed to parse shared plan", e);
      }
    } else {
      const saved = localStorage.getItem('ski_portfolio');
      if (saved) {
        try {
          setPortfolio(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load saved portfolio", e);
        }
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. Save to LocalStorage on Change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ski_portfolio', JSON.stringify(portfolio));
    }
  }, [portfolio, isLoaded]);

  const handleShare = () => {
    const data = btoa(JSON.stringify(portfolio));
    const url = `${window.location.origin}${window.location.pathname}?plan=${data}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const executeReset = () => {
    setPortfolio([]);
    localStorage.removeItem('ski_portfolio');
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
    setShowResetConfirm(false);
    setIsMobileMenuOpen(false);
  };

  // --- Portfolio Management ---

  const existingIds = useMemo(() => new Set(portfolio.map(p => p.id)), [portfolio]);

  const addResort = (resort: Resort) => {
    setPortfolio(prev => [...prev, { 
      ...resort, 
      days: 3, 
      consecutiveDays: false, 
      isAdvanceBooking: true 
    }]);
  };

  const addCustomResort = (name: string) => {
    const id = `custom-${Date.now()}`;
    const newResort: PortfolioItem = {
      id,
      name: name.trim(),
      region: 'Custom',
      dayTicketPrice: 150, 
      advanceTicketPrice: 125,
      passAffiliation: [],
      days: 3,
      consecutiveDays: false,
      isAdvanceBooking: true
    };
    setPortfolio(prev => [...prev, newResort]);
  };

  const removeResort = (id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id));
  };

  const updateDays = (id: string, days: number) => {
    setPortfolio(prev => prev.map(p => p.id === id ? { ...p, days } : p));
  };

  const updateConsecutive = (id: string, isConsecutive: boolean) => {
    setPortfolio(prev => prev.map(p => p.id === id ? { ...p, consecutiveDays: isConsecutive } : p));
  };

  const updateBooking = (id: string, isAdvance: boolean) => {
    setPortfolio(prev => prev.map(p => p.id === id ? { ...p, isAdvanceBooking: isAdvance } : p));
  };

  const updateDetails = (id: string, updates: Partial<Resort>) => {
    setPortfolio(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // Instant Client-Side Calculation
  const result = useMemo(() => calculateBestStrategy(portfolio), [portfolio]);
  const totalDays = portfolio.reduce((sum, item) => sum + item.days, 0);

  if (!isLoaded) return null; // Prevent flicker

  return (
    <div className="min-h-screen relative font-sans text-slate-900">
      
      {/* Animated Background */}
      <SnowBackground />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4 border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Clear entire plan?</h3>
            </div>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              This will remove all mountains and custom settings from your portfolio. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Container */}
      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="bg-slate-900 text-white flex-none shadow-md">
          <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="bg-blue-500/20 p-1.5 rounded-lg">
                  <Mountain className="w-6 h-6 text-blue-400" />
               </div>
               <h1 className="text-xl font-bold tracking-tight hidden sm:block">SkiPass Optimizer</h1>
               <h1 className="text-xl font-bold tracking-tight sm:hidden">SkiPass</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {portfolio.length > 0 && (
                <>
                  <button 
                    onClick={handleShare}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors border border-slate-700"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Plan
                  </button>
                  <button 
                    onClick={handleResetClick}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800/50 text-sm transition-colors"
                    title="Clear Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}

              <button 
                className="lg:hidden text-slate-300 hover:text-white p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </header>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-20 right-4 z-50 animate-fade-in-down">
            <div className="bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Link copied to clipboard!</span>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-screen-2xl mx-auto w-full">
          
          {/* Left Sidebar: Plan Controls */}
          <aside className={`
              lg:w-[450px] flex-none bg-white/95 backdrop-blur-sm border-r border-slate-200 flex flex-col
              fixed lg:relative inset-0 z-20 transition-transform duration-300 lg:translate-x-0 shadow-xl lg:shadow-none
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="p-6 border-b border-slate-100 flex-none bg-white/50 backdrop-blur-md z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900">Your Ski Plan</h2>
                {/* Mobile Actions */}
                {portfolio.length > 0 && (
                   <div className="flex gap-2 lg:hidden">
                     <button onClick={handleShare} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
                       <Share2 className="w-4 h-4" />
                     </button>
                     <button onClick={handleResetClick} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:text-red-600 hover:bg-red-50">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                )}
              </div>
              <ResortSearch 
                onAddResort={addResort} 
                onAddCustomResort={addCustomResort}
                existingIds={existingIds} 
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
              {portfolio.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 px-8 text-center">
                  <Snowflake className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">Search for resorts above to start building your winter portfolio.</p>
                </div>
              ) : (
                portfolio.map(item => (
                  <PortfolioItemComponent 
                    key={item.id} 
                    item={item} 
                    onRemove={removeResort} 
                    onUpdateDays={updateDays}
                    onUpdateConsecutive={updateConsecutive}
                    onUpdateBooking={updateBooking}
                    onUpdateDetails={updateDetails}
                    marginalCost={result.marginalCosts ? result.marginalCosts[item.id] : undefined}
                  />
                ))
              )}
            </div>
            
            {portfolio.length > 0 && (
               <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200 flex justify-between items-center text-sm font-medium text-slate-600">
                 <span>Total Ski Days</span>
                 <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{totalDays}</span>
               </div>
            )}
          </aside>

          {/* Right Content: Analysis Results */}
          <div className="flex-1 overflow-y-auto bg-transparent p-4 lg:p-8 relative" onClick={() => setIsMobileMenuOpen(false)}>
            
            <div className="max-w-4xl mx-auto">
               {portfolio.length > 0 ? (
                 <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-slate-900 drop-shadow-sm">Live Cost Analysis</h2>
                      <span className="flex items-center text-xs text-green-700 bg-green-50/80 backdrop-blur-sm px-2 py-1 rounded border border-green-200 shadow-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Updating Live
                      </span>
                    </div>
                    
                    <AnalysisResult result={result} />
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                    <div className="w-24 h-24 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-white/20 shadow-sm">
                      <Mountain className="w-12 h-12 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to Optimize</h2>
                    <p className="max-w-md text-center text-slate-500 mb-6">
                      Add mountains to your plan on the left. We'll instantly calculate the cheapest combination of passes and tickets for you.
                    </p>
                    <div className="flex gap-4 text-sm text-slate-500 bg-white/40 px-4 py-2 rounded-full border border-white/40 backdrop-blur-sm">
                       <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-500" /> Real-time Pricing
                       </div>
                       <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-500" /> Pass Comparisons
                       </div>
                    </div>
                 </div>
               )}
            </div>
            
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;
