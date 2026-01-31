import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-indigo-600">
            AI Recruitment Platform
          </h1>
          <p className="text-gray-600 mt-1">
            Automated Hiring & Assessment System
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to Day 3! 🚀
          </h2>
          
          <p className="text-gray-600 mb-6">
            Frontend is successfully running with React + Vite + Tailwind CSS
          </p>

          {/* Counter Test */}
          <div className="bg-indigo-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-indigo-800 mb-3">
              React State Test
            </h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCount(count + 1)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Count: {count}
              </button>
              <button 
                onClick={() => setCount(0)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="text-blue-600 text-3xl mb-3">👤</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Job Seeker Panel
              </h3>
              <p className="text-sm text-gray-600">
                Profile, CV upload, assessments, interviews
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="text-green-600 text-3xl mb-3">💼</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Job Provider Panel
              </h3>
              <p className="text-sm text-gray-600">
                Post jobs, review candidates, analytics
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="text-purple-600 text-3xl mb-3">⚙️</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Admin Panel
              </h3>
              <p className="text-sm text-gray-600">
                User management, monitoring, security
              </p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✅ Development Environment Ready!
          </h3>
          <ul className="text-green-700 space-y-1">
            <li>✓ Backend: Express server running on port 5000</li>
            <li>✓ Frontend: React app running on port 5173</li>
            <li>✓ Styling: Tailwind CSS configured</li>
            <li>✓ Ready for feature development!</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 mt-12">
        <p className="text-center text-gray-500">
          FYP Project by Sana Hussain (FSD-FL-143) | Day 3 Complete 🎉
        </p>
      </footer>
    </div>
  )
}

export default App