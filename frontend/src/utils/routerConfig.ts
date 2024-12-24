// src/utils/routerConfig.ts
import { ROUTE_PATHS } from '@/constants/route'
import { ReadonlyURLSearchParams } from 'next/navigation'

interface Route {
  path: string
  generatePath: (...args: any[]) => string
}

interface RouteConfig {
  [key: string]: Route
}

// Ana router yapılandırması
export const routes: RouteConfig = {
  home: {
    path: ROUTE_PATHS.HOME,
    generatePath: () => ROUTE_PATHS.HOME,
  },
  myLists: {
    path: ROUTE_PATHS.MY_LISTS,
    generatePath: () => ROUTE_PATHS.MY_LISTS,
  },
  settings: {
    path: ROUTE_PATHS.SETTINGS,
    generatePath: () => ROUTE_PATHS.SETTINGS,
  },
  search: {
    path: ROUTE_PATHS.SEARCH,
    generatePath: () => ROUTE_PATHS.SEARCH,
  },
  auth: {
    path: ROUTE_PATHS.AUTH,
    generatePath: () => ROUTE_PATHS.AUTH,
  },
  watched: {
    path: ROUTE_PATHS.WATCHED,
    generatePath: () => ROUTE_PATHS.WATCHED,
  },
}
// URL oluşturucu utility fonksiyonu
export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams | null = null,
  baseUrl: string = 'https://mist-dbms.vercel.app',
) => {
  const url = new URL(pathname, baseUrl || 'http://localhost')

  if (params) {
    params.forEach((value, key) => {
      url.searchParams.append(key, value)
    })
  }

  return `${url.pathname}${url.search}`
}

// Router helper fonksiyonları
export const RouterHelper = {
  // Belirli bir route'a yönlendirme yapar
  navigate: (routeName: keyof typeof routes, ...args: any[]) => {
    const route = routes[routeName]
    if (!route) {
      throw new Error(`Route "${routeName}" not found`)
    }
    return route.generatePath(...args)
  },

  // Query parametreleri ile birlikte URL oluşturur
  createUrlWithQuery: (
    routeName: keyof typeof routes,
    params: Record<string, string>,
    ...args: any[]
  ) => {
    const route = routes[routeName]
    if (!route) {
      throw new Error(`Route "${routeName}" not found`)
    }

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value)
    })

    return createUrl(route.generatePath(...args), searchParams)
  },
}
