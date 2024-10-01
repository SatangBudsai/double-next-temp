import { StateType } from '@/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, Button, ScrollShadow, Spacer, Tooltip } from '@nextui-org/react'
import { cn } from '@/utils/cn'
import SidebarMenu from './sidebar-menu'
import useSectionItems from './sidebar-items'
import { Icon } from '@iconify/react/dist/iconify.js'
import configLayout from '@/layouts/config-layout.json'
import { useTheme } from 'next-themes'
import useBreakpoint from '@/hooks/useBreakpoint'

type Props = {
  disableIsCompact?: boolean
}

const Sidebar = (props: Props) => {
  const sectionItems = useSectionItems()
  const appSettingState = useSelector((state: StateType) => state.appSettingState)
  const { isMobile, isIpad } = useBreakpoint()
  const { setTheme, theme } = useTheme()

  const isCompact = props.disableIsCompact ? false : appSettingState.isCompact || isIpad

  const handleChangeTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <aside
      className={cn('w-screen- flex h-full flex-col p-6 transition-width', isCompact && 'items-center px-2 py-6')}
      style={{ width: isCompact ? configLayout.sidebar.widthCompact : configLayout.sidebar.width }}>
      {isMobile && (
        <div className='flex items-center gap-2 pl-2'>
          <Icon icon='solar:graph-new-bold' width={40} className='text-primary' />
          <p className='text-lg font-bold uppercase text-primary'>{process.env.NEXT_PUBLIC_PROJECT_NAME}</p>
        </div>
      )}

      <div className='mt-5 flex items-center gap-3 px-3'>
        <Avatar isBordered className='flex-none text-default-600' size='sm' />
        <div className={cn('flex max-w-full flex-col', { hidden: isCompact })}>
          <p className='truncate text-small font-medium text-default-600'>FirstName LastName</p>
          <p className='truncate text-tiny text-default-400'>ผู้ดูแลระบบ</p>
        </div>
      </div>

      <ScrollShadow className='-mr-6 h-full max-h-full py-6 pr-6'>
        <SidebarMenu isCompact={isCompact} items={sectionItems.data()} />
      </ScrollShadow>

      <Spacer y={2} />
      <div className={cn('mt-auto flex flex-col', { 'items-center': isCompact })}>
        {isMobile && (
          <Button
            fullWidth
            className={cn('justify-start truncate text-default-500 data-[hover=true]:text-foreground')}
            startContent={
              <div>
                {theme === 'light' ? (
                  <Icon className='text-default-400' icon='solar:moon-line-duotone' width={24} />
                ) : (
                  <Icon className='text-default-400' icon='solar:sun-2-line-duotone' width={24} />
                )}
              </div>
            }
            variant='light'
            onClick={handleChangeTheme}>
            โหมดสว่าง/มืด
          </Button>
        )}
        <Tooltip content='ออกจากระบบ' isDisabled={!isCompact} placement='right'>
          <Button
            className={cn('justify-start text-default-500 data-[hover=true]:text-foreground', {
              'justify-center': isCompact
            })}
            isIconOnly={isCompact}
            startContent={
              isCompact ? null : <Icon icon='solar:logout-3-linear' className='flex-none text-default-500' width={24} />
            }
            variant='light'>
            {isCompact ? <Icon icon='solar:logout-3-linear' className='text-default-500' width={24} /> : 'ออกจากระบบ'}
          </Button>
        </Tooltip>
      </div>
    </aside>
  )
}

export default Sidebar
