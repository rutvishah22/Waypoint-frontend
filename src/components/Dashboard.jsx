import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalysisResults } from '../utils/api';

export default function Dashboard() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout;

    const fetchResults = async () => {
      try {
        console.log(`[Dashboard] Attempt ${retryCount + 1} - Fetching results for job ${jobId}...`);
        const result = await getAnalysisResults(jobId);
        
        if (!isMounted) return;

        console.log('[Dashboard] Result received:', result);
        
        // If no success field or false, retry
        if (!result || !result.success) {
          if (retryCount < 10) {
            console.log(`[Dashboard] No success, retrying in 2s... (${retryCount + 1}/10)`);
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(fetchResults, 2000);
            return;
          }
          setError('Analysis not found after multiple attempts');
          setLoading(false);
          return;
        }

        // If still processing, keep retrying (don't redirect back!)
        if (result.data?.status === 'processing') {
          if (retryCount < 10) {
            console.log(`[Dashboard] Still processing, retrying... (${retryCount + 1}/10)`);
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(fetchResults, 2000);
            return;
          }
          setError('Analysis is still processing. Please refresh the page.');
          setLoading(false);
          return;
        }

        // If not complete, retry
        if (result.data?.status !== 'complete') {
          if (retryCount < 10) {
            console.log(`[Dashboard] Status: ${result.data?.status}, retrying... (${retryCount + 1}/10)`);
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(fetchResults, 2000);
            return;
          }
          setError(`Analysis status: ${result.data?.status}. Please try refreshing.`);
          setLoading(false);
          return;
        }

        // Success! We have complete data
        console.log('[Dashboard] ✅ Analysis complete! Loading dashboard...');
        setAnalysisData(result.data);
        setLoading(false);
        
      } catch (err) {
        if (!isMounted) return;
        
        console.error('[Dashboard] Error:', err);
        
        // Retry on error
        if (retryCount < 10) {
          console.log(`[Dashboard] Error occurred, retrying... (${retryCount + 1}/10)`);
          setRetryCount(prev => prev + 1);
          retryTimeout = setTimeout(fetchResults, 2000);
          return;
        }
        
        setError(err.message || 'Failed to load analysis');
        setLoading(false);
      }
    };

    // Start fetching
    fetchResults();

    return () => {
      isMounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [jobId]); // Removed navigate and retryCount from deps to prevent re-trigger

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-nectarine-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg mb-2">Loading your analysis...</p>
          {retryCount > 0 && (
            <p className="text-gray-500 text-sm">Attempt {retryCount + 1}/10</p>
          )}
          <p className="text-gray-600 text-xs mt-4">This may take a moment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Analysis</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-nectarine-500 to-nectarine-600 hover:from-nectarine-600 hover:to-nectarine-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 w-full"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="border border-gray-700 hover:border-nectarine-500 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 w-full"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData || !analysisData.analysis) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No analysis data available</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-nectarine-500 to-nectarine-600 text-white px-6 py-3 rounded-lg"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const analysis = analysisData.analysis || {};
  const productIdea = analysisData.product_idea || '';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'category', label: 'Category' },
    { id: 'market', label: 'Market Reality' },
    { id: 'competitors', label: 'Competitors' },
    { id: 'users', label: 'User Needs' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'mvp', label: 'MVP Blueprint' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'gtm', label: 'Go-to-Market' },
    { id: 'risks', label: 'Risks' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <svg className="w-8 h-8 text-nectarine-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-2xl font-bold text-white">Waypoint</span>
            </div>
            <button 
              onClick={() => navigate('/analyze')}
              className="border border-gray-700 hover:border-nectarine-500 text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
            >
              New Analysis
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Your Market Intelligence</h1>
          <p className="text-lg text-gray-400">
            <span className="font-medium">Product:</span> {productIdea}
          </p>
        </div>

        {/* CATEGORY DIAGNOSIS HERO */}
        {analysis.category_diagnosis && (
          <div className="mb-8 fade-in">
            <div className="bg-gradient-to-br from-nectarine-500/10 to-nectarine-600/5 border-2 border-nectarine-500/30 rounded-xl p-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-nectarine-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">Category Diagnosis</h2>
                  <div className="text-gray-300 prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {analysis.category_diagnosis.split('\n').slice(0, 4).join('\n')}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('category')}
                    className="mt-4 text-nectarine-400 hover:text-nectarine-300 font-medium text-sm flex items-center space-x-2 transition-colors"
                  >
                    <span>View Full Analysis</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-800 px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === tab.id 
                    ? 'text-nectarine-500 border-nectarine-500' 
                    : 'text-gray-400 hover:text-gray-300 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 fade-in">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Analysis Overview</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {analysis.overview || 'No overview available'}
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              {analysisData.raw_market_data && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {analysisData.raw_market_data.competitors && analysisData.raw_market_data.competitors.length > 0 && (
                    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-nectarine-500 mb-2">
                        {analysisData.raw_market_data.competitors.length}
                      </div>
                      <div className="text-sm text-gray-400">Competitors Analyzed</div>
                    </div>
                  )}
                  
                  {analysisData.raw_market_data.market_intelligence?.pain_points && 
                   analysisData.raw_market_data.market_intelligence.pain_points.length > 0 && (
                    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-nectarine-500 mb-2">
                        {analysisData.raw_market_data.market_intelligence.pain_points.length}
                      </div>
                      <div className="text-sm text-gray-400">Pain Points Found</div>
                    </div>
                  )}
                  
                  {analysisData.raw_market_data.market_intelligence?.communities && 
                   analysisData.raw_market_data.market_intelligence.communities.length > 0 && (
                    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-nectarine-500 mb-2">
                        {analysisData.raw_market_data.market_intelligence.communities.length}
                      </div>
                      <div className="text-sm text-gray-400">Communities Identified</div>
                    </div>
                  )}
                  
                  {(!analysisData.raw_market_data.competitors || analysisData.raw_market_data.competitors.length === 0) &&
                   (!analysisData.raw_market_data.market_intelligence?.pain_points || analysisData.raw_market_data.market_intelligence.pain_points.length === 0) && (
                    <div className="col-span-full bg-gray-800/30 border border-gray-700 p-6 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">
                        Analysis powered by AI market intelligence
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Category Tab */}
          {activeTab === 'category' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Category Diagnosis</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {analysis.category_diagnosis || 'Analyzing category positioning...'}
                </p>
              </div>
            </div>
          )}

          {/* Other tabs... */}
          {activeTab === 'market' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Market Reality</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {analysis.market_reality || 'No market reality data available'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'competitors' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Competitive Landscape</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {analysis.competitive_landscape || 'No competitive landscape data available'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">User Pain & Desires</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {analysis.user_pain_and_desires || 'No user needs data available'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Strategy & Positioning</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {analysis.strategy_and_positioning || 'No strategy data available'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'mvp' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">MVP Blueprint</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {analysis.mvp_blueprint || 'No MVP blueprint available'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Pricing & Monetization</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {analysis.pricing_and_monetization || 'No pricing data available'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'gtm' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Go-to-Market Strategy</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {analysis.go_to_market || 'No go-to-market data available'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Risks & Unknowns</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {analysis.risks_and_unknowns || 'No risks data available'}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-800 flex flex-wrap gap-4">
            <button
              onClick={() => {
                const content = Object.entries(analysis || {})
                  .map(([key, value]) => `${key.replace(/_/g, ' ').toUpperCase()}\n${'='.repeat(50)}\n${value}\n\n`)
                  .join('\n');
                
                const blob = new Blob(
                  [`WAYPOINT MARKET ANALYSIS\nProduct: ${productIdea}\n\n${content}`],
                  { type: 'text/plain' }
                );
                
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `waypoint-analysis-${jobId}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="border border-gray-700 hover:border-nectarine-500 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Report</span>
            </button>
            
            <button
              onClick={() => navigate('/analyze')}
              className="bg-gradient-to-r from-nectarine-500 to-nectarine-600 hover:from-nectarine-600 hover:to-nectarine-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Analysis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}