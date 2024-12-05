'use client'

import { FC, useState } from 'react'
import { MdMovieEdit } from 'react-icons/md'
import { MdOutlineMovie } from 'react-icons/md'
import { FaRegHeart } from 'react-icons/fa6'
import { FiSettings } from 'react-icons/fi'
import { SidebarItem } from './SidebarItem'
import { LogoutIcon } from '../shared/Icons'
import { cn } from '@/lib/utils'
import { logOut } from '@/services/login.service'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants/route'
import { RouterHelper } from '@/utils/routerConfig'
import { useUserStore } from '@/store/user'

export const Sidebar: FC = () => {
  const [activeItem] = useState('Gönder')
  const router = useRouter()
  const currentUser = useUserStore((state) => state.currentUser)
  const userProfile: User = {
    name: currentUser?.name || '',
    surname: currentUser?.surname || '',
    email: currentUser?.email || '',
  }

  const pathname = usePathname() // Mevcut yol adını al

  const handleLogout = async () => {
    try {
      await logOut()
      router.push(ROUTE_PATHS.HOME)
    } catch (error) {
      console.error(error)
    }
  }

  const handleBalanceClick = () => {
    router.push(RouterHelper.navigate(ROUTE_NAMES.SETTINGS))
  }

  const menuItems = [
    {
      type: 'link' as const,
      icon: <MdOutlineMovie size={24} />,
      label: 'Ara',
      href: RouterHelper.navigate(ROUTE_NAMES.SEARCH),
    },
    {
      type: 'link' as const,
      icon: <MdMovieEdit size={24} />,
      label: 'Listelerim',
      href: RouterHelper.navigate(ROUTE_NAMES.MY_LISTS),
    },
    {
      type: 'link' as const,
      icon: <FaRegHeart size={24} />,
      label: 'İzlediklerim',
      href: RouterHelper.navigate(ROUTE_NAMES.WATCHED),
    },
    {
      type: 'link' as const,
      icon: <FiSettings size={24} />,
      label: 'Ayarlar',
      href: RouterHelper.navigate(ROUTE_NAMES.SETTINGS),
    },
    {
      type: 'button' as const,
      icon: <LogoutIcon />,
      label: 'Çıkış Yap',
      onClick: handleLogout,
    },
  ]

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen',
        'w-20 md:w-64 bg-background',
        'border-r border-gray-200',
        'transition-all duration-300 ease-in-out',
        'flex flex-col',
        'shadow-sm',
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-1 flex items-center justify-center">
          <div className="relative w-12 h-12 md:w-60 md:h-60">
            <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = item.type === 'link' && pathname === item.href // Mevcut yol href ile eşleşiyor mu kontrol et
            return (
              <SidebarItem
                key={item.label}
                {...(item.type === 'link'
                  ? {
                      type: 'link',
                      href: item.href,
                      icon: item.icon,
                      label: item.label,
                      active: isActive,
                    }
                  : {
                      type: 'button',
                      onClick: item.onClick,
                      icon: item.icon,
                      label: item.label,
                      active: false,
                    })}
              />
            )
          })}
        </nav>
        <div className="border-t border-gray-200 p-3 md:p-4 mt-auto">
          <div className="flex flex-col space-y-2">
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-900 truncate">
                {userProfile.name} {userProfile.surname}
              </div>
              <div className="text-xs text-gray-500 truncate">{userProfile.email}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
