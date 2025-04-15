import { cn } from '@/utils/cn'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Select, SelectItem, Spacer } from "@heroui/react"
import React, { Fragment } from 'react'

type Props = {}

const CarbonReduce = (props: Props) => {
  const activityType = [
    { key: '01', label: 'การจัดประชุม' },
    { key: '02', label: 'กิจกรรมนอกอาคาร' },
    { key: '03', label: 'กิจกรรมในอาคาร' },
    { key: '04', label: 'ทัศนศึกษา' }
  ]

  const events = [
    {
      key: '01',
      label: 'อาหาร',
      icon: 'fluent:food-32-filled',
      value: 320,
      color: '#0088FE',
      colorForeground: '#ffffff'
    },
    {
      key: '02',
      label: 'การเดินทาง',
      icon: 'ph:lightning-fill',
      value: 320,
      color: '#FFBB28',
      colorForeground: '#ffffff'
    },
    {
      key: '03',
      label: 'ของเสีย',
      icon: 'cbi:garbage-residual',
      value: 320,
      color: '#820dd6',
      colorForeground: '#ffffff'
    },
    {
      key: '04',
      label: 'วัสดุตกแต่ง',
      icon: 'material-symbols:family-star',
      value: 320,
      color: '#00C49F',
      colorForeground: '#ffffff'
    }
  ]

  return (
    <Fragment>
      <div className='rounded-xl border-2 bg-content1 p-5'>
        <div className='flex items-center justify-between gap-5'>
          <h2 className='text-xl font-semibold'>4 หมวดกิจกรรมการลดคาร์บอนฟุตพริ้นท์อีเว้นท์</h2>
          <Select
            items={activityType}
            variant='bordered'
            label='ประเภทกิจกรรม'
            placeholder='ทั้งหมด'
            className='max-w-52'>
            {item => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
        </div>

        <Spacer y={5} />
        <div className='grid grid-cols-4 gap-5'>
          {events.map(item => {
            return (
              <Fragment key={item.key}>
                <div
                  className='flex items-center gap-4 rounded-xl border-2 p-3'
                  style={{ borderColor: item.color, color: item.color }}>
                  <div
                    className='flex h-16 w-16 items-center justify-center rounded-full p-3'
                    style={{ backgroundColor: item.color }}>
                    <Icon icon={item.icon} style={{ color: item.colorForeground }} width={32} />
                  </div>
                  <div className='flex flex-1 flex-col '>
                    <p className='truncate'>{item.label}</p>
                    <div className='flex items-center gap-1'>
                      <p className='text-2xl font-bold'>320</p>
                      <Icon icon='ion:caret-up' width={20} />
                    </div>
                    <p className='-mt-1'>CO2</p>
                  </div>
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
    </Fragment>
  )
}

export default CarbonReduce
