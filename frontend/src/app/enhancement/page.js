'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const API = 'https://bw-bdc-backend.onrender.com'

export default function EnhancementDetails() {
  const searchParams = useSearchParams()
  const infocubeId = searchParams.get('id') || '0FIGL_C10'

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dimensions')

  useEffect(() => {
    fetch(`${API}/api/enhancement/${infocubeId}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [infocubeId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading enhancement details...</div>
      </div>
    )
  }

  const severityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Link href="/" className="text-purple-300 hover:text-purple-200 text-sm mb-2 inline-block">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-white">AI Enhancement Results</h1>
          <p className="text-purple-200 mt-1">{data.infocube_name} ({data.infocube_id})</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">Overall Confidence</div>
            <div className="text-4xl font-bold text-green-400 mt-2">{data.overall_confidence}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">Dimensions Classified</div>
            <div className="text-4xl font-bold text-white mt-2">{data.dimensions.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">Hierarchies Detected</div>
            <div className="text-4xl font-bold text-white mt-2">{data.hierarchies.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-purple-200 text-sm font-medium">Data Quality Score</div>
            <div className="text-4xl font-bold text-blue-400 mt-2">{data.data_quality.overall_score}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['dimensions', 'hierarchies', 'formulas', 'quality'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-transparent'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'dimensions' && data.dimensions.map((dim, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white font-mono">{dim.original_name}</h3>
                  <p className="text-purple-200 text-sm mt-1">{dim.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg text-sm font-medium border border-purple-500/30">
                    {dim.semantic_type}
                  </div>
                  <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg text-sm font-medium border border-green-500/30">
                    {(dim.ai_confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
              </div>
              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <div className="text-purple-200 text-sm font-medium mb-2">AI Reasoning:</div>
                <div className="text-white text-sm">{dim.reasoning}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-purple-300 text-xs uppercase tracking-wide mb-1">Display Format</div>
                  <div className="text-white font-mono">{dim.display_format}</div>
                </div>
                <div>
                  <div className="text-purple-300 text-xs uppercase tracking-wide mb-1">Sort Order</div>
                  <div className="text-white">{dim.sort_order}</div>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'hierarchies' && data.hierarchies.map((hier, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{hier.name}</h3>
                  <p className="text-purple-200 text-sm mt-1">{hier.type} Hierarchy</p>
                </div>
                <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg text-sm font-medium border border-green-500/30">
                  {(hier.ai_confidence * 100).toFixed(0)}% confidence
                </div>
              </div>
              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <div className="text-purple-200 text-sm font-medium mb-2">AI Reasoning:</div>
                <div className="text-white text-sm">{hier.reasoning}</div>
              </div>
              <div className="space-y-3">
                {hier.levels.map((level, levelIdx) => (
                  <div key={levelIdx} className="flex items-center gap-4 bg-white/5 rounded-lg p-4">
                    <div className="bg-purple-500/30 text-purple-200 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      {level.level}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{level.dimension}</div>
                      <div className="text-purple-300 text-sm">{level.cardinality} unique values</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {activeTab === 'formulas' && data.formulas.map((formula, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white font-mono">{formula.original_name}</h3>
                  <p className="text-purple-200 text-sm mt-1">{formula.description}</p>
                </div>
                <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg text-sm font-medium border border-green-500/30">
                  {(formula.ai_confidence * 100).toFixed(0)}% confidence
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-red-300 text-xs uppercase tracking-wide mb-2">BW Formula</div>
                  <div className="text-white font-mono text-sm">{formula.bw_formula}</div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-green-300 text-xs uppercase tracking-wide mb-2">Datasphere Formula</div>
                  <div className="text-white font-mono text-sm">{formula.datasphere_formula}</div>
                </div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-purple-200 text-sm font-medium mb-2">AI Reasoning:</div>
                <div className="text-white text-sm">{formula.reasoning}</div>
              </div>
            </div>
          ))}

          {activeTab === 'quality' && (
            <>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-purple-200 text-sm font-medium">Completeness</div>
                  <div className="text-3xl font-bold text-green-400 mt-2">{(data.data_quality.completeness * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-purple-200 text-sm font-medium">Consistency</div>
                  <div className="text-3xl font-bold text-yellow-400 mt-2">{(data.data_quality.consistency * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="text-purple-200 text-sm font-medium">Accuracy</div>
                  <div className="text-3xl font-bold text-blue-400 mt-2">{(data.data_quality.accuracy * 100).toFixed(0)}%</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Data Quality Issues</h3>
                <div className="space-y-3">
                  {data.data_quality.issues.map((issue, idx) => (
                    <div key={idx} className={`rounded-lg p-4 border ${severityColors[issue.severity]}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium">{issue.dimension}</div>
                        <div className="text-xs uppercase px-2 py-1 rounded bg-black/20">{issue.severity}</div>
                      </div>
                      <div className="text-sm mb-1">{issue.description}</div>
                      <div className="text-xs opacity-80">{issue.issue_type} • {issue.count} records ({issue.percentage}%)</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">AI Recommendations</h3>
                <div className="space-y-3">
                  {data.data_quality.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <div className="text-green-400 font-bold">✓</div>
                      <div className="text-white text-sm">{rec}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
