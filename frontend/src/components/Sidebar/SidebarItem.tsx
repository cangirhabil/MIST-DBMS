import { FC, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface BaseSidebarItemProps {
  icon: ReactNode
  label: string
  active?: boolean
  className?: string
}

interface ButtonSidebarItemProps extends BaseSidebarItemProps {
  type: 'button'
  onClick: () => void
}

interface LinkSidebarItemProps extends BaseSidebarItemProps {
  type: 'link'
  href: string
}

type SidebarItemProps = ButtonSidebarItemProps | LinkSidebarItemProps

const baseStyles = cn(
  'w-full flex items-center justify-start',
  'transition-all duration-200 ease-in-out',
  'px-3 py-4 sm:px-4 sm:py-5 lg:px-6',
  'text-base sm:text-lg',
  'hover:bg-muted/50',
  'flex flex-col sm:flex-row items-center gap-2 sm:gap-4',
  'hover:scale-[0.98] active:scale-[0.97]'
)

export const SidebarItem: FC<SidebarItemProps> = (props) => {
  const { icon, label, active } = props
  
  const contentElement = (
    <>
      <div className={cn('flex items-center justify-center', 'w-8 h-8 sm:w-9 sm:h-9')}>
        {icon}
      </div>
      <span className={cn('text-sm sm:text-base', 'block text-center sm:text-left', 'opacity-90')}>
        {label}
      </span>
    </>
  )

  if (props.type === 'button') {
    return (
      <button
        onClick={props.onClick}
        className={cn(
          baseStyles,
          active && 'bg-muted font-medium',
          props.className
        )}
      >
        {contentElement}
      </button>
    )
  }

  return (
    <Link
      href={props.href}
      className={cn(
        baseStyles,
        active && 'bg-muted font-medium',
        props.className
      )}
    >
      {contentElement}
    </Link>
  )
}