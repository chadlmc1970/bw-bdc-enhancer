'use client'
import { useEffect, useState } from 'react'

const API = 'https://bw-bdc-backend.onrender.com'

export default function Home() {
  const [stats, setStats] = useState(null)
  const [infocubes, setInfocubes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, cubesRes] = await Promise.all([
          fetch(`${API}/api/dashboard/stats`),
          fetch(`${API}/api/source/infocubes`)
        ])

        if (!statsRes.ok || !cubesRes.ok) {
          throw new Error('API request failed')
        }

        const statsData = await statsRes.json()
        const cubesData = await cubesRes.json()

        setStats(statsData)
        setInfocubes(cubesData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <div style={{padding: '50px', fontFamily: 'system-ui'}}>Loading dashboard...</div>
  }

  if (error) {
    return <div style={{padding: '50px', fontFamily: 'system-ui', color: 'red'}}>Error: {error}</div>
  }

  return (
    <div style={{padding: '50px', fontFamily: 'system-ui', background: '#f8fafc', minHeight: '100vh'}}>
      <h1 style={{fontSize: '32px', marginBottom: '10px'}}>BW-BDC AI Enhancement Platform</h1>
      <p style={{color: '#64748b', marginBottom: '30px'}}>AI-powered semantic enhancement for SAP BW to Business Data Cloud</p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px'}}>
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <div style={{color: '#64748b', fontSize: '14px'}}>InfoCubes</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#0f172a'}}>{stats?.infocubes || 0}</div>
        </div>
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <div style={{color: '#64748b', fontSize: '14px'}}>Dimensions</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#0f172a'}}>{stats?.dimensions || 0}</div>
        </div>
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <div style={{color: '#64748b', fontSize: '14px'}}>Enhanced Models</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#10b981'}}>{stats?.enhanced_models || 0}</div>
        </div>
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <div style={{color: '#64748b', fontSize: '14px'}}>AI Confidence</div>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#6366f1'}}>{stats?.ai_confidence || 0}</div>
        </div>
      </div>

      <div style={{background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <h2 style={{fontSize: '20px', marginBottom: '20px'}}>BW InfoCubes</h2>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #e2e8f0', textAlign: 'left'}}>
              <th style={{padding: '12px', color: '#64748b', fontWeight: '600'}}>ID</th>
              <th style={{padding: '12px', color: '#64748b', fontWeight: '600'}}>Name</th>
              <th style={{padding: '12px', color: '#64748b', fontWeight: '600'}}>Dimensions</th>
              <th style={{padding: '12px', color: '#64748b', fontWeight: '600'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {infocubes.map(cube => (
              <tr key={cube.id} style={{borderBottom: '1px solid #e2e8f0'}}>
                <td style={{padding: '12px', fontFamily: 'monospace'}}>{cube.id}</td>
                <td style={{padding: '12px'}}>{cube.name}</td>
                <td style={{padding: '12px'}}>{cube.dimensions}</td>
                <td style={{padding: '12px'}}>
                  <button style={{
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>Enhance with AI</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
