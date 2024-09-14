import { type SidebarItem } from './sidebar-menu'
import TeamAvatar from './team-avatar'
import { Chip } from '@nextui-org/react'

const useSectionItems = () => {
  const data = () => {
    const items: SidebarItem[] = [
      {
        key: 'main-menu',
        title: '',
        items: [
          {
            key: 'home',
            href: '/',
            icon: 'solar:home-2-linear',
            title: 'หน้าหลัก'
          },
          {
            key: 'dashboard',
            href: '/dashboard',
            icon: 'solar:widget-2-outline',
            title: 'สรุปผลข้อมูล'
          },
          {
            key: 'my-port',
            href: '#',
            icon: 'solar:pie-chart-2-outline',
            title: 'แบ่งสัดส่วน'
          }
        ]
      },
      {
        key: 'demo',
        title: 'โปรแกรมคำนวณ',
        items: [
          {
            key: 'demo-page',
            href: '#',
            icon: 'solar:calculator-linear',
            title: 'เครื่องคิดเลข',
            startContent: <TeamAvatar name='Demo' />,
            endContent: (
              <Chip size='sm' variant='flat'>
                Coming Soon
              </Chip>
            )
          }
        ]
      }
    ]
    return items
  }

  return { data }
}

export default useSectionItems
