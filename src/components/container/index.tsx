import { cn } from '@heroui/react'
import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  isBackground?: boolean
  heightScreen?: boolean
  className?: string
}

const Container = (props: Props) => {
  const { children, className, isBackground = false, heightScreen = false } = props

  return (
    <section className={cn(isBackground && 'bg-glass', heightScreen && 'flex min-h-[100dvh] flex-col justify-center')}>
      <div className='flex justify-center'>
        <div className={cn('w-full max-w-4xl max-xl:px-5 lg:max-w-5xl xl:max-w-6xl', className)}>{children}</div>
      </div>
    </section>
  )
}

export default Container
