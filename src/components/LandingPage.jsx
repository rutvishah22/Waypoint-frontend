import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                className="w-8 h-8 text-nectarine-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span className="text-2xl font-bold text-white">Waypoint</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Know Your Market
              <br />
              <span className="bg-gradient-to-r from-nectarine-400 to-nectarine-600 bg-clip-text text-transparent">
                Before You Build
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Get AI-powered market intelligence in 24 hours. Stop guessing if
              you're competing in the right category.
            </p>

            {/* Value Props */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-xl p-6 text-left hover:border-nectarine-500/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-nectarine-500 to-nectarine-600 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  Category Diagnosis
                </h3>
                <p className="text-gray-400 text-sm">
                  Find out if you're competing in the right category—or if you
                  should reframe entirely
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-xl p-6 text-left hover:border-nectarine-500/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-nectarine-500 to-nectarine-600 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  Competitor Analysis
                </h3>
                <p className="text-gray-400 text-sm">
                  Deep dive into 15–30 competitors with pricing, positioning, and
                  market gaps
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm rounded-xl p-6 text-left hover:border-nectarine-500/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-nectarine-500 to-nectarine-600 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  Strategic Playbook
                </h3>
                <p className="text-gray-400 text-sm">
                  Get specific actions: what to build, where to launch, how to
                  price
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/analyze')}
              className="bg-gradient-to-r from-nectarine-500 to-nectarine-600 hover:from-nectarine-600 hover:to-nectarine-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-nectarine-500/50 transition-all duration-200 transform hover:scale-105"
            >
              Start Your Analysis →
            </button>

            <p className="text-gray-500 text-sm mt-4">
              Free for first 100 users • No credit card required
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-800">
        <div className="text-center text-gray-600 text-sm">
          <p>&copy; 2026 Waypoint. Built for founders who want to win.</p>
        </div>
      </footer>
    </div>
  );
}
