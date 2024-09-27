'use client'

import React, { useState, Fragment, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { Button, Card, Select, SelectItem, SelectSection, Tooltip } from '@nextui-org/react'
import { useDispatch, useSelector } from 'react-redux'
import Drawer from '@/components/drawer'
import Sidebar from './sidebar'
import { appSettingAction } from '@/store/reducers/app-setting'
import { StateType } from '@/store'
import SwitchTheme from '@/components/switch-theme'
import configLayout from '@/layouts/config-layout.json'
import NProgress from 'nprogress'
import useBreakpoint from '@/hooks/useBreakpoint'
import SwitchLanguage from '@/components/switch-language'

type Props = {}

const Navbar = (props: Props) => {
  const dispatch = useDispatch()
  const appSettingState = useSelector((state: StateType) => state.appSettingState)
  const { isMobile } = useBreakpoint()
  const [isOpenToggle, setIsOpenToggle] = useState(false)
  const isCompact = appSettingState.isCompact || isMobile

  const onToggleCompact = () => {
    dispatch(appSettingAction.onToggleCompact())
  }

  useEffect(() => {
    if (NProgress.done()) {
      setIsOpenToggle(false)
    }
  }, [NProgress.status])

  const workspaces = [
    {
      value: '0',
      label: 'เลือกพอร์ต',
      items: [
        {
          value: '1',
          label: 'พอร์ตลงทุนหลัก'
        },
        {
          value: '2',
          label: 'พอร์ตลงทุนรอง'
        }
      ]
    }
  ]

  return (
    <Fragment>
      <Drawer
        direction='left'
        open={isOpenToggle}
        onClose={() => {
          setIsOpenToggle(!isOpenToggle)
        }}
        size={configLayout.sidebar.width}>
        <Sidebar disableIsCompact={true} />
      </Drawer>

      <nav className='sticky top-0 z-[40]'>
        <Card
          className={'flex flex-row items-center justify-between border-b-1 px-4'}
          radius='none'
          shadow='none'
          style={{ height: configLayout.navbar.height }}>
          <div className='flex items-center gap-2'>
            {isMobile ? (
              <div className='flex items-center gap-2'>
                <Button
                  isIconOnly
                  variant='light'
                  onClick={() => {
                    setIsOpenToggle(!isOpenToggle)
                  }}>
                  <Icon icon='solar:hamburger-menu-linear' width={26} className='text-default-500' />
                </Button>
              </div>
            ) : (
              <Tooltip
                showArrow={true}
                content={`${appSettingState.isCompact ? 'ขยายเมนู' : 'ย่อเมนู'}`}
                delay={0}
                closeDelay={200}>
                <Button isIconOnly size='sm' variant='light' onPress={onToggleCompact}>
                  <Icon icon='solar:sidebar-minimalistic-linear' width={26} className='text-default-500' />
                </Button>
              </Tooltip>
            )}
            <div className='flex items-center gap-2'>
              <Icon icon='solar:code-square-bold' width={35} className='text-primary' />
              {!isMobile && (
                <p className='text-lg font-bold uppercase text-primary'>{process.env.NEXT_PUBLIC_PROJECT_NAME}</p>
              )}
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>{!isMobile && <SwitchTheme />}</div>
            <div className='flex items-center gap-2'>{!isMobile && <SwitchLanguage />}</div>
          </div>
        </Card>
      </nav>
    </Fragment>
  )
}

export default Navbar
