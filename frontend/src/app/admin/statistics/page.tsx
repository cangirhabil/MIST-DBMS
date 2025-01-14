'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { adminService } from '@/lib/services/admin.service' // Add this import

// Interfaces can remain the same as they match the Metrics interface
interface MetricCardData {
  title: string
  value: number
  description: string
}

interface StatisticsData {
  metrics: {
    totalUsers: MetricCardData
    totalMovies: MetricCardData
    totalMovieLists: MetricCardData
  }
}

// MetricCard component remains the same
const MetricCard = ({ data }: { data: MetricCardData }) => {
  const { title, value, description } = data
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <Progress value={value} className="mt-3" />
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  )
}

const StatisticsPage = () => {
  const [data, setData] = useState<StatisticsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const metrics = await adminService.getMetrics()
        setData({ metrics }) // Wrap metrics in an object to match the interface
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      }
      setLoading(false)
    }

    loadData()
  }, [])

  // Rest of the component remains the same
  if (loading || !data) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">İstatistikler</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard data={data.metrics.totalUsers} />
        <MetricCard data={data.metrics.totalMovies} />
        <MetricCard data={data.metrics.totalMovieLists} />
      </div>
    </div>
  )
}

export default StatisticsPage
