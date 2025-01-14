'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Users, Film } from 'lucide-react'

// Interfaces
interface MetricCardData {
  title: string
  value: number | string
  icon: any
  description: string
  progress: number
}

interface StatisticsData {
  metrics: {
    totalUsers: MetricCardData
    totalMovies: MetricCardData
    totalMovieLists: MetricCardData
  }
}

// API'den veri çekme fonksiyonu (örnek)
const fetchStatisticsData = async (): Promise<StatisticsData> => {
  // Gerçek uygulamada bu bir API çağrısı olacak
  return {
    metrics: {
      totalUsers: {
        title: 'Toplam Kullanıcı',
        value: Math.floor(Math.random() * 10000),
        icon: Users,
        description: 'Hedef: 10,000 kullanıcı',
        progress: Math.floor(Math.random() * 100),
      },
      totalMovies: {
        title: 'Toplam Film',
        value: Math.floor(Math.random() * 1000),
        icon: Film,
        description: 'Aylık film ekleme hedefi: 50',
        progress: Math.floor(Math.random() * 100),
      },
      totalMovieLists: {
        title: 'Toplam Film Listesi',
        value: Math.floor(Math.random() * 1000),
        icon: Film,
        description: 'Aylık film ekleme hedefi: 50',
        progress: Math.floor(Math.random() * 100),
      },
    },
  }
}

// Metrik Kartı Komponenti
const MetricCard = ({ data }: { data: MetricCardData }) => {
  const { title, value, icon: Icon, description, progress } = data
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <Progress value={progress} className="mt-3" />
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
        const newData = await fetchStatisticsData()
        setData(newData)
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error)
      }
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading || !data) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">İstatistikler</h2>
      </div>

      {/* Üst Metrikler */}
      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard data={data.metrics.totalUsers} />
        <MetricCard data={data.metrics.totalMovies} />
        <MetricCard data={data.metrics.totalMovieLists} />
      </div>

      {/* Tabs ile Detaylı İstatistikler */}
    </div>
  )
}

export default StatisticsPage
