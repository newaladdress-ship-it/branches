'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore'

interface Business {
  id: string
  businessName: string
  status: string
  createdAt: any
}

export default function BusinessDebug() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    latest: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Total businesses
        const totalQuery = query(collection(db, 'businesses'))
        const totalSnapshot = await getDocs(totalQuery)
        const total = totalSnapshot.size

        // Approved businesses
        const approvedQuery = query(collection(db, 'businesses'), where('status', '==', 'approved'))
        const approvedSnapshot = await getDocs(approvedQuery)
        const approved = approvedSnapshot.size

        // Pending businesses
        const pendingQuery = query(collection(db, 'businesses'), where('status', '==', 'pending'))
        const pendingSnapshot = await getDocs(pendingQuery)
        const pending = pendingSnapshot.size

        // Latest 8 businesses
        const latestQuery = query(
          collection(db, 'businesses'),
          orderBy('createdAt', 'desc'),
          limit(8)
        )
        const latestSnapshot = await getDocs(latestQuery)
        const latest = latestSnapshot.docs.map(doc => ({
          id: doc.id,
          businessName: doc.data().businessName || 'No Name',
          status: doc.data().status || 'No Status',
          createdAt: doc.data().createdAt
        }))

        setStats({ total, approved, pending, latest })
      } catch (error) {
        console.error('Error fetching business stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="p-4">Loading business stats...</div>
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Business Database Stats</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-3 rounded">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Businesses</div>
        </div>
        <div className="bg-white p-3 rounded">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-3 rounded">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>

      <div className="bg-white p-3 rounded">
        <h4 className="font-semibold mb-2">Latest 8 Businesses (Homepage Display):</h4>
        {stats.latest.length === 0 ? (
          <p className="text-gray-500">No businesses found</p>
        ) : (
          <ul className="space-y-1">
            {stats.latest.map((business) => (
              <li key={business.id} className="text-sm">
                • {business.businessName} ({business.status})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
