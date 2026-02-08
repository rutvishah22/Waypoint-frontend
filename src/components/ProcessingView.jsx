import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pollAnalysisStatus, getAnalysisResults } from '../utils/api';

export default function ProcessingView() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(10);
  const [currentStep, setCurrentStep] = useState('Initializing analysis...');
  const [error, setError] = useState(null);

  const steps = [
    { progress: 10, label: 'Initializing analysis...' },
    { progress: 25, label: 'Identifying competitors...' },
    { progress: 45, label: 'Analyzing market signals...' },
    { progress: 65, label: 'Diagnosing category fit...' },
    { progress: 85, label: 'Generating strategic recommendations...' },
    { progress: 95, label: 'Finalizing your report...' },
  ];

  useEffect(() => {
    let stopPolling;
    let stepInterval;
    let hasNavigated = false;

    // Simulate progress steps for better UX
    stepInterval = setInterval(() => {
      setProgress((prev) => {
        const nextStep = steps.find(s => s.progress > prev);
        if (nextStep) {
          setCurrentStep(nextStep.label);
          return nextStep.progress;
        }
        return prev;
      });
    }, 4000);

    // VERIFY data is available before navigating
    const verifyAndNavigate = async () => {
      console.log('✅ Analysis complete! Verifying data before navigation...');
      
      // Wait a bit for backend to finish writing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Now verify the data is actually there
      let attempts = 0;
      const maxAttempts = 5;
      
      while (attempts < maxAttempts) {
        try {
          console.log(`Verification attempt ${attempts + 1}/${maxAttempts}...`);
          const result = await getAnalysisResults(jobId);
          
          if (result.success && 
              result.data?.status === 'complete' && 
              result.data?.analysis) {
            console.log('✅ Data verified! Navigating now...');
            clearInterval(stepInterval);
            
            // Data is confirmed available - safe to navigate
            window.location.href = `/results/${jobId}`;
            return;
          }
          
          console.log('Data not ready yet, waiting...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          attempts++;
          
        } catch (err) {
          console.error('Verification error:', err);
          await new Promise(resolve => setTimeout(resolve, 1500));
          attempts++;
        }
      }
      
      // If we get here, verification failed - try navigation anyway
      console.log('⚠️ Verification timeout, navigating anyway...');
      window.location.href = `/results/${jobId}`;
    };

    // Poll for actual results
    stopPolling = pollAnalysisStatus(
      jobId,
      (result) => {
        if (result.data?.status === 'complete' && !hasNavigated) {
          hasNavigated = true;
          setProgress(100);
          setCurrentStep('Analysis complete! Loading dashboard...');
          
          // Verify data before navigating
          verifyAndNavigate();
          
        } else if (result.data?.status === 'failed') {
          clearInterval(stepInterval);
          setError(result.data?.error || 'Analysis failed. Please try again.');
        } else if (result.data?.progress) {
          setProgress(result.data.progress);
        }
      },
      3000
    );

    return () => {
      if (stopPolling) stopPolling();
      if (stepInterval) clearInterval(stepInterval);
    };
  }, [jobId, navigate]);

  const estimatedTimeRemaining = Math.max(0, Math.ceil((100 - progress) / 2));

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/analyze')}
              className="bg-gradient-to-r from-nectarine-500 to-nectarine-600 hover:from-nectarine-600 hover:to-nectarine-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Animated Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-nectarine-500 to-nectarine-600 rounded-full flex items-center justify-center pulse-slow">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-nectarine-500 to-nectarine-600 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">
              {progress === 100 ? 'Preparing Your Dashboard...' : 'Analyzing Your Market'}
            </h1>
            <p className="text-gray-400 text-lg">
              {progress === 100 
                ? 'Just a moment while we load your results...' 
                : "We're gathering intelligence from across the web..."}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">{currentStep}</span>
              <span className="text-sm font-semibold text-nectarine-500">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-nectarine-500 to-nectarine-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Time Estimate */}
          {progress < 100 && (
            <div className="text-center mb-8">
              <p className="text-gray-400">
                Estimated time remaining: <span className="font-semibold text-white">{estimatedTimeRemaining} minutes</span>
              </p>
            </div>
          )}

          {/* What We're Doing */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">What we're analyzing:</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${progress >= 25 ? 'text-nectarine-500' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className={progress >= 25 ? 'text-gray-300' : 'text-gray-500'}>
                  Competitor landscape (15-30 companies)
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${progress >= 45 ? 'text-nectarine-500' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className={progress >= 45 ? 'text-gray-300' : 'text-gray-500'}>
                  Market signals & user pain points
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${progress >= 65 ? 'text-nectarine-500' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className={progress >= 65 ? 'text-gray-300' : 'text-gray-500'}>
                  Category positioning & fit
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${progress >= 85 ? 'text-nectarine-500' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className={progress >= 85 ? 'text-gray-300' : 'text-gray-500'}>
                  Strategic recommendations
                </span>
              </li>
            </ul>
          </div>

          {/* Email Notice */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Email notifications coming soon
              <br />
              {progress === 100 ? 'Loading your dashboard...' : 'Bookmark this page to check your results later'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}