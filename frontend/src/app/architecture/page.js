'use client'
import Link from 'next/link'

export default function Architecture() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Link href="/" className="text-purple-300 hover:text-purple-200 text-sm mb-2 inline-block">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-white">Platform Architecture</h1>
          <p className="text-purple-200 mt-1">Understanding the BW-BDC AI Enhancement Pipeline</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Overview */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">System Overview</h2>
          <p className="text-purple-200 text-lg leading-relaxed">
            This platform demonstrates AI-powered semantic enhancement of SAP Business Warehouse (BW) metadata for migration to SAP Business Data Cloud (BDC) Datasphere.
            Using Claude Opus 4.6, the system automatically classifies dimensions, detects hierarchies, translates formulas, and validates data quality—transforming legacy
            BW structures into modern, semantically-enriched Datasphere models.
          </p>
        </div>

        {/* Source vs Target Comparison */}
        <div className="grid grid-cols-2 gap-6">
          {/* BW Source */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg font-bold">SOURCE</div>
              <h3 className="text-2xl font-bold text-white">SAP BW (Business Warehouse)</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">What is SAP BW?</h4>
                <p className="text-purple-200 text-sm">
                  SAP Business Warehouse is an enterprise data warehousing solution that consolidates data from multiple sources for
                  reporting and analysis. It uses InfoCubes (multidimensional data structures) to store aggregated transaction data.
                </p>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Key Components:</h4>
                <ul className="space-y-2 text-purple-200 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong>InfoCubes:</strong> Star schema structures containing dimensions and key figures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong>Dimensions:</strong> Characteristics for slicing data (e.g., Time, Customer, Product)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong>Key Figures:</strong> Numeric measures (e.g., Revenue, Quantity, Cost)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    <span><strong>BEx Queries:</strong> Reports and analysis tools built on InfoCubes</span>
                  </li>
                </ul>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Limitations:</h4>
                <ul className="space-y-1 text-purple-200 text-sm">
                  <li>❌ No semantic metadata (dimension types unknown)</li>
                  <li>❌ Manual hierarchy management</li>
                  <li>❌ Proprietary formula syntax</li>
                  <li>❌ Limited data quality visibility</li>
                  <li>❌ On-premise infrastructure dependency</li>
                </ul>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-blue-300 font-semibold mb-2">Database Mapping:</h4>
                <p className="text-purple-200 text-sm mb-2">
                  <strong>Neon PostgreSQL:</strong> <code className="bg-black/40 px-2 py-1 rounded text-xs">ep-cool-mountain-ai7bow5i</code>
                </p>
                <p className="text-purple-300 text-xs">
                  Contains InfoCube metadata (0FIGL_C10, 0SD_C03, 0COPC_C01) with dimensions, key figures, and sample data patterns
                  mirroring actual SAP BW structures.
                </p>
              </div>
            </div>
          </div>

          {/* BDC Target */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-bold">TARGET</div>
              <h3 className="text-2xl font-bold text-white">SAP BDC Datasphere</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">What is BDC Datasphere?</h4>
                <p className="text-purple-200 text-sm">
                  SAP Business Data Cloud (BDC) Datasphere is a next-generation cloud data platform that combines data warehousing,
                  data federation, and business semantics in a unified SaaS offering. It enables modern analytics with AI-ready data.
                </p>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Key Components:</h4>
                <ul className="space-y-2 text-purple-200 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span><strong>Data Models:</strong> Semantic layer with business context and relationships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span><strong>Dimensions:</strong> Typed characteristics (Time, Geography, Organization, Attribute)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span><strong>Measures:</strong> Calculated fields with SQL/MDX expressions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span><strong>Hierarchies:</strong> Auto-detected multi-level relationships</span>
                  </li>
                </ul>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Advantages:</h4>
                <ul className="space-y-1 text-purple-200 text-sm">
                  <li>✅ Rich semantic metadata (dimension types assigned)</li>
                  <li>✅ Automatic hierarchy detection</li>
                  <li>✅ Standard SQL formula syntax</li>
                  <li>✅ Built-in data quality monitoring</li>
                  <li>✅ Cloud-native, scalable architecture</li>
                </ul>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">Database Mapping:</h4>
                <p className="text-purple-200 text-sm mb-2">
                  <strong>Neon PostgreSQL:</strong> <code className="bg-black/40 px-2 py-1 rounded text-xs">ep-weathered-sea-ain8b9ju</code>
                </p>
                <p className="text-purple-300 text-xs">
                  Stores AI-enhanced models with semantic types, detected hierarchies, translated formulas, and data quality reports—
                  representing the enriched Datasphere metadata layer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Enhancement Process */}
        <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md rounded-xl p-8 border border-purple-400/30">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="bg-purple-500/30 px-3 py-1 rounded-lg text-sm">POWERED BY AI</span>
            Transformation Pipeline
          </h2>

          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-3xl mb-3">🏷️</div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Dimension Classification</h3>
              <p className="text-purple-200 text-sm mb-3">
                AI analyzes dimension names, descriptions, and sample values to assign semantic types.
              </p>
              <div className="bg-black/30 rounded p-3 text-xs">
                <div className="text-purple-300 mb-1">Types Identified:</div>
                <ul className="text-white space-y-1">
                  <li>• Time (Fiscal Period)</li>
                  <li>• Geography (Region)</li>
                  <li>• Organizational (Company)</li>
                  <li>• Attribute (Customer, Currency)</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-3xl mb-3">🌳</div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Hierarchy Detection</h3>
              <p className="text-purple-200 text-sm mb-3">
                Discovers multi-level relationships between dimensions using pattern recognition.
              </p>
              <div className="bg-black/30 rounded p-3 text-xs">
                <div className="text-purple-300 mb-1">Detected Structures:</div>
                <ul className="text-white space-y-1">
                  <li>• Year → Quarter → Month</li>
                  <li>• Company → Unit → Center</li>
                  <li>• Region → Country → City</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Formula Translation</h3>
              <p className="text-purple-200 text-sm mb-3">
                Converts BW proprietary formula syntax to Datasphere SQL with safety enhancements.
              </p>
              <div className="bg-black/30 rounded p-3 text-xs">
                <div className="text-purple-300 mb-1">Improvements:</div>
                <ul className="text-white space-y-1">
                  <li>• Division-by-zero protection</li>
                  <li>• NULL handling with COALESCE</li>
                  <li>• Standard SQL compliance</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold text-white mb-2">4. Data Quality Analysis</h3>
              <p className="text-purple-200 text-sm mb-3">
                Validates completeness, consistency, and accuracy with actionable recommendations.
              </p>
              <div className="bg-black/30 rounded p-3 text-xs">
                <div className="text-purple-300 mb-1">Metrics Tracked:</div>
                <ul className="text-white space-y-1">
                  <li>• NULL value detection</li>
                  <li>• Format consistency</li>
                  <li>• Invalid value identification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Technology Stack</h2>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">AI & Backend</h3>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span><strong>Claude Opus 4.6:</strong> Semantic reasoning engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span><strong>FastAPI:</strong> Python REST API framework</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span><strong>SQLAlchemy:</strong> Database ORM</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Frontend</h3>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span><strong>Next.js 14:</strong> React framework</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span><strong>Tailwind CSS:</strong> Utility-first styling</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span><strong>React Hooks:</strong> State management</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Infrastructure</h3>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span><strong>Render:</strong> Cloud deployment platform</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span><strong>Neon PostgreSQL:</strong> Serverless database</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span><strong>GitHub:</strong> Version control & CI/CD</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20">
          <div className="px-8 py-4 bg-black/20 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Feature Comparison: BW vs BDC Datasphere</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-purple-200">Feature</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-300">SAP BW</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-green-300">BDC Datasphere (AI-Enhanced)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr className="hover:bg-white/5">
                  <td className="px-6 py-4 text-white font-medium">Dimension Types</td>
                  <td className="px-6 py-4 text-purple-200 text-sm">Generic (no semantic classification)</td>
                  <td className="px-6 py-4 text-purple-200 text-sm">✅ Typed (Time, Geography, Org, Attribute)</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="px-6 py-4 text-white font-medium">Hierarchy Management</td>
                  <td className="px-6 py-4 text-purple-200 text-sm">Manual configuration required</td>
                  <td className="px-6 py-4 text-purple-200 text-sm">✅ AI auto-detection with confidence scores</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="px-6 py-4 text-white font-medium">Formula Syntax</td>
                  <td className="px-6 py-4 text-purple-200 text-sm">Proprietary BW expression language</td>
                  <td className="px-6 py-4 text-purple-200 text-sm">✅ Standard SQL with safety enhancements</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="px-6 py-4 text-white font-medium">Data Quality</td>
                  <td className="px-6 py-4 text-purple-200 text-sm">Limited visibility, manual checks</td>
                  <td className="px-6 py-4 text-purple-200 text-sm">✅ AI-powered analysis + recommendations</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="px-6 py-4 text-white font-medium">Deployment</td>
                  <td className="px-6 py-4 text-purple-200 text-sm">On-premise infrastructure</td>
                  <td className="px-6 py-4 text-purple-200 text-sm">✅ Cloud-native SaaS (serverless)</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="px-6 py-4 text-white font-medium">AI Reasoning</td>
                  <td className="px-6 py-4 text-purple-200 text-sm">None (manual interpretation)</td>
                  <td className="px-6 py-4 text-purple-200 text-sm">✅ Full explainability with confidence scores</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
