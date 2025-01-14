// adminService.ts
interface Metric {
  title: string
  value: number
  description: string
}

interface Metrics {
  totalUsers: Metric
  totalMovies: Metric
  totalMovieLists: Metric
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}

export const adminService = {
  async getMetrics(): Promise<Metrics> {
    try {
      const response = await fetch(`${API_URL}/admin/getStatistics`, {
        // URL'i /search olarak güncelledik
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      return data.metrics
    } catch (error) {
      console.error('Error fetching metrics:', error)
      throw error
    }
  },
}
