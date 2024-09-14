'use client'

import React, { ReactNode } from 'react'
import { Card } from '@nextui-org/react'
import { useMediaQuery } from 'usehooks-ts'
import Sidebar from './partial/sidebar'
import Navbar from './partial/navbar'
import { cn } from '@/utils/cn'
import configLayout from '@/layouts/config-layout.json'
import useBreakpoint from '@/hooks/useBreakpoint'

type Props = {
  children: ReactNode
  startContent?: ReactNode
}

export default function MainLayout(props: Props) {
  const { isMobile } = useBreakpoint()
  const heightSidebar = `calc(100dvh - ${configLayout.navbar.height})`

  return (
    <div className='max-w-screen relative flex min-h-dvh flex-col'>
      <Navbar />
      <section className='flex flex-1'>
        {!isMobile && (
          <Card radius='none' className={cn('sticky top-20 z-[39]')} style={{ height: heightSidebar }}>
            <Sidebar />
          </Card>
        )}
        <section className='flex flex-1'>
          <div className='flex flex-1 flex-col p-10 max-sm:px-3 max-sm:pb-5 max-sm:pt-6'>{props.children}</div>
        </section>
      </section>
    </div>
  )
}
