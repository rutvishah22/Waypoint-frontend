import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitAnalysis } from '../utils/api';

export default function AnalysisForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productIdea: '',
    tier: 'prelaunch',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productIdea.trim()) {
      newErrors.productIdea = 'Please describe your product idea';
    } else if (formData.productIdea.trim().length < 10) {
      newErrors.productIdea = 'Please provide more detail (at least 10 characters)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitAnalysis(formData);
      
      if (result.success && result.job_id) {
        navigate(`/analyzing/${result.job_id}`);
      } else {
        setErrors({ submit: 'Failed to start analysis. Please try again.' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wheat-50 to-white">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <svg className="w-8 h-8 text-oceanic-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-2xl font-bold text-oceanic-600">Waypoint</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Form */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 fade-in">
            <h1 className="text-4xl font-bold text-oceanic-700 mb-4">
              Tell us about your product
            </h1>
            <p className="text-lg text-gray-600">
              We'll analyze your market and give you strategic insights in 24 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card fade-in space-y-8">
            {/* Step 1: User Stage */}
            <div>
              <label className="block text-sm font-semibold text-oceanic-700 mb-3">
                Step 1: What stage are you at?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleChange('tier', 'prelaunch')}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                    formData.tier === 'prelaunch'
                      ? 'border-oceanic-500 bg-oceanic-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      formData.tier === 'prelaunch'
                        ? 'border-oceanic-500 bg-oceanic-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.tier === 'prelaunch' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-oceanic-700 mb-1">Pre-launch</p>
                      <p className="text-sm text-gray-600">Validating my idea, no product yet</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('tier', 'postlaunch')}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                    formData.tier === 'postlaunch'
                      ? 'border-oceanic-500 bg-oceanic-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      formData.tier === 'postlaunch'
                        ? 'border-oceanic-500 bg-oceanic-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.tier === 'postlaunch' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-oceanic-700 mb-1">Post-launch</p>
                      <p className="text-sm text-gray-600">I have a live product, seeking growth</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Product Idea */}
            <div>
              <label className="block text-sm font-semibold text-oceanic-700 mb-3">
                Step 2: Describe your product in one sentence
              </label>
              <textarea
                value={formData.productIdea}
                onChange={(e) => handleChange('productIdea', e.target.value)}
                placeholder="e.g., AI-powered task manager for people with ADHD"
                rows={4}
                className={`input-field resize-none ${errors.productIdea ? 'border-red-500' : ''}`}
              />
              {errors.productIdea && (
                <p className="text-red-500 text-sm mt-2">{errors.productIdea}</p>
              )}
              <p className="text-gray-500 text-sm mt-2">
                Be specific but concise. What problem does it solve? Who is it for?
              </p>
            </div>

            {/* Step 3: Email */}
            <div>
              <label className="block text-sm font-semibold text-oceanic-700 mb-3">
                Step 3: Your email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com"
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
              <div className="mt-2 flex items-start space-x-2">
                <svg className="w-4 h-4 text-nectarine-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 text-sm">
                  Save your analysis link • Email notifications coming soon
                </p>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-lg px-12 py-4"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Starting Analysis...</span>
                  </span>
                ) : (
                  'Analyze My Market →'
                )}
              </button>
            </div>

            {/* Privacy Note */}
            <p className="text-center text-xs text-gray-500">
              By submitting, you agree to our analysis of publicly available market data. 
              Your product idea remains confidential.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
