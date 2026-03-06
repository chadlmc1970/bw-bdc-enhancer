'use client'
import { useEffect, useState } from 'react'

const API = 'https://bw-bdc-backend.onrender.com'

export default function Home() {
  const [stats, setStats] = useState(null)
  const [infocubes, setInfocubes] = useState([])
  const [loading, setLoading] = useState(true)
  const [enhancing, setEnhancing] = useState(null)
  const [resetting, setResetting] = useState(false)

  const loadData = async () => {
    try {
      const [statsRes, cubesRes] = await Promise.all([
        fetch(`${API}/api/dashboard/stats`),
        fetch(`${API}/api/source/infocubes`)
      ])
      const statsData = await statsRes.json()
      const cubesData = await cubesRes.json()
      setStats(statsData)
      setInfocubes(cubesData)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEnhance = async (infocubeId) => {
    setEnhancing(infocubeId)
    try {
      const res = await fetch(`${API}/api/enhancement/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ infocube_id: infocubeId })
      })

      if (!res.ok) {
        const error = await res.json()
        alert(`Enhancement failed: ${error.detail}`)
        return
      }

      await loadData()
      alert('Enhancement complete! Click "View Details" to see AI results.')
    } catch (err) {
      alert(`Enhancement error: ${err.message}`)
    } finally {
      setEnhancing(null)
    }
  }

  const handleReset = async () => {
    if (!confirm('Reset all data? This will clear all enhancements and restore sample data.')) {
      return
    }

    setResetting(true)
    try {
      const res = await fetch(`${API}/api/reset`, { method: 'POST' })
      if (res.ok) {
        await loadData()
        alert('System reset complete!')
      } else {
        alert('Reset failed')
      }
    } catch (err) {
      alert(`Reset error: ${err.message}`)
    } finally {
      setResetting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">BW-BDC AI Enhancement Platform</h1>
              <p className="text-purple-200 mt-1">AI-powered semantic enhancement for SAP BW to Business Data Cloud</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={resetting}
                className="bg-red-600/80 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all border border-red-500/50 disabled:opacity-50"
              >
                {resetting ? 'Resetting...' : '🔄 Reset System'}
              </button>
              <a
                href="/architecture"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all border border-white/20"
              >
                📚 Platform Architecture
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">InfoCubes</div>
            <div className="text-4xl font-bold text-white mt-2">{stats?.infocubes || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">Dimensions</div>
            <div className="text-4xl font-bold text-white mt-2">{stats?.dimensions || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">Enhanced Models</div>
            <div className="text-4xl font-bold text-green-400 mt-2">{stats?.enhanced_models || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">AI Confidence</div>
            <div className="text-4xl font-bold text-blue-400 mt-2">{stats?.ai_confidence || 0}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">BW Source</h3>
              <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                {infocubes.length} Cubes
              </div>
            </div>
            <div className="space-y-2">
              {infocubes.slice(0, 3).map(cube => (
                <div key={cube.id} className="bg-black/20 rounded-lg p-3">
                  <div className="text-white text-sm font-mono">{cube.id}</div>
                  <div className="text-purple-200 text-xs">{cube.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md rounded-xl p-6 border border-purple-400/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">AI Enhancement</h3>
              <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                Claude Opus 4.6
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="text-white text-sm">Dimension Classification</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="text-white text-sm">Hierarchy Detection</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="text-white text-sm">Formula Translation</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="text-white text-sm">Data Quality Analysis</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">BDC Target</h3>
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                {stats?.enhanced_models || 0} Models
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-green-400 text-sm font-medium">✓ Enhanced Metadata</div>
                <div className="text-purple-200 text-xs">Semantic types assigned</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-green-400 text-sm font-medium">✓ Hierarchies Detected</div>
                <div className="text-purple-200 text-xs">Multi-level relationships</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-green-400 text-sm font-medium">✓ Quality Validated</div>
                <div className="text-purple-200 text-xs">Data completeness scored</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">BW InfoCubes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Dimensions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {infocubes.map(cube => (
                  <tr key={cube.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">{cube.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">{cube.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">{cube.dimensions}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cube.status === 'enhanced' ? (
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">
                          Enhanced
                        </span>
                      ) : enhancing === cube.id ? (
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30">
                          Processing...
                        </span>
                      ) : (
                        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/30">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cube.status === 'enhanced' ? (
                        <a
                          href={`/enhancement?id=${cube.id}`}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all inline-block"
                        >
                          View Details
                        </a>
                      ) : (
                        <button
                          onClick={() => handleEnhance(cube.id)}
                          disabled={enhancing === cube.id}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                        >
                          {enhancing === cube.id ? 'Enhancing...' : 'Enhance with AI'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
