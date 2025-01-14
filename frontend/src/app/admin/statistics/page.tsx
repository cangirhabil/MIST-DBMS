'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users, Film } from 'lucide-react'

// Interfaces
interface MetricCardData {
  title: string
  value: number | string
  trend: string
  icon: any
  description: string
  progress: number
}

interface ActivityData {
  name: string
  percentage: number
}

interface PlatformUsage {
  platform: string
  percentage: number
}

interface PerformanceMetric {
  name: string
  value: string
  percentage: number
}

interface StatisticsData {
  metrics: {
    totalUsers: MetricCardData
    totalMovies: MetricCardData
  }
  activities: ActivityData[]
  platformUsage: PlatformUsage[]
  performance: PerformanceMetric[]
}

// API'den veri çekme fonksiyonu (örnek)
const fetchStatisticsData = async (): Promise<StatisticsData> => {
  // Gerçek uygulamada bu bir API çağrısı olacak
  return {
    metrics: {
      totalUsers: {
        title: 'Toplam Kullanıcı',
        value: Math.floor(Math.random() * 10000),
        trend: `+${Math.floor(Math.random() * 30)}% artış`,
        icon: Users,
        description: 'Hedef: 10,000 kullanıcı',
        progress: Math.floor(Math.random() * 100),
      },
      totalMovies: {
        title: 'Toplam Film',
        value: Math.floor(Math.random() * 1000),
        trend: `+${Math.floor(Math.random() * 50)} yeni eklendi`,
        icon: Film,
        description: 'Aylık film ekleme hedefi: 50',
        progress: Math.floor(Math.random() * 100),
      },
    },
    activities: [
      { name: 'Film İzleme', percentage: Math.floor(Math.random() * 100) },
      { name: 'Yorum Yapma', percentage: Math.floor(Math.random() * 100) },
      { name: 'Liste Oluşturma', percentage: Math.floor(Math.random() * 100) },
      { name: 'Arkadaş Ekleme', percentage: Math.floor(Math.random() * 100) },
      { name: 'Profil Güncelleme', percentage: Math.floor(Math.random() * 100) },
    ],
    platformUsage: [
      { platform: 'Mobil', percentage: 45 },
      { platform: 'Desktop', percentage: 35 },
      { platform: 'Tablet', percentage: 20 },
    ],
    performance: [
      { name: 'Sayfa Yüklenme', value: '1.2s', percentage: 85 },
      { name: 'Uptime', value: '99.9%', percentage: 99.9 },
      { name: 'API Yanıt', value: '250ms', percentage: 92 },
    ],
  }
}

// Metrik Kartı Komponenti
const MetricCard = ({ data }: { data: MetricCardData }) => {
  const { title, value, trend, icon: Icon, description, progress } = data
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{trend}</p>
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
      </div>

      {/* Tabs ile Detaylı İstatistikler */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcı Aktiviteleri</CardTitle>
            <CardDescription>Son 30 günlük aktivite dağılımı</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              {data.activities.map((activity, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{activity.name}</span>
                    <span className="text-sm text-muted-foreground">{activity.percentage}%</span>
                  </div>
                  <Progress value={activity.percentage} />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Kullanımı</CardTitle>
            <CardDescription>Cihaz bazlı kullanım dağılımı</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-4">
                {data.platformUsage.map((platform, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{platform.platform}</span>
                      <span className="text-sm text-muted-foreground">{platform.percentage}%</span>
                    </div>
                    <Progress value={platform.percentage} className="mt-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performans Metrikleri</CardTitle>
            <CardDescription>Sistem performans göstergeleri</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-4">
                {data.performance.map((metric, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <span className="text-sm text-muted-foreground">{metric.value}</span>
                    </div>
                    <Progress value={metric.percentage} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StatisticsPage
