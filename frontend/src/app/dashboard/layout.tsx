import { Sidebar } from '@/components/Sidebar/Sidebar'
import { Toaster } from '@/components/ui/toaster'
export default function Layout({ children }: any) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="fixed">
          <Sidebar />
        </div>
        <div className="flex-1 p-6 ml-20 md:ml-64">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
            {children}
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  )
}