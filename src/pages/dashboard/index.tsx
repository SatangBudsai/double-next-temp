import MainLayout from '@/layouts/main-layout'
import RootLayout from '@/layouts/root-layout'
import React, { Fragment, ReactElement } from 'react'
import { Select, SelectItem, Spacer } from "@heroui/react"
import BarChart from './BarChart'
import PieChart from './PieChart'
import Department from './Department'
import CarbonUse from './CarbonUse'
import CarbonReduce from './CarbonReduce'

type Props = {}

const Dashboard = (props: Props) => {
  const years = [
    { key: '2566', label: '2566' },
    { key: '2567', label: '2567' }
  ]

  const activityType = [
    { key: '01', label: 'การจัดประชุม' },
    { key: '02', label: 'กิจกรรมนอกอาคาร' },
    { key: '03', label: 'กิจกรรมในอาคาร' },
    { key: '04', label: 'ทัศนศึกษา' }
  ]

  return (
    <div>
      <div className='flex items-center justify-center gap-5'>
        <h1 className='text-center text-2xl font-semibold'>
          สรุปการใช้งานแพลต์ฟอร์มประเมินคาร์บอนฟุตพริ้นท์อีเว้นท์ มหาลัยเชียงใหม่
        </h1>
        <Select
          items={years}
          variant='bordered'
          defaultSelectedKeys={['2567']}
          label='ประจำปี'
          placeholder='กรุณาเลือกปี พ.ศ.'
          className='max-w-32'>
          {item => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      </div>
      <Spacer y={5} />
      <div className='grid grid-cols-12 gap-5'>
        <div className='col-span-4 rounded-xl border-2 bg-content1 py-10'>
          <h2 className='text-center text-xl font-semibold'>ปรเภทกิจกรรม</h2>
          <PieChart />
        </div>
        <div className='col-span-8'>
          <div className='col-span-4 rounded-xl border-2 bg-content1 p-5'>
            <div className='flex items-center justify-between gap-5'>
              <h2 className='text-center text-xl font-semibold'>การประเมินคาร์บอนฟุตพริ้นท์อีเว้นท์ ประจำปี 2567</h2>
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
            <BarChart />
          </div>
        </div>
        <div className='col-span-4 rounded-xl border-2 bg-content1 p-5'>
          <div className='flex items-center justify-between gap-5'>
            <h2 className='text-center text-xl font-semibold'>หน่วยผู้จัดงาน</h2>
            <Select
              items={activityType}
              variant='bordered'
              label='เลือกหน่วยงาน'
              placeholder='ทั้งหมด'
              className='max-w-52'>
              {item => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>
          </div>
          <Spacer y={5} />
          <Department />
        </div>
        <div className='col-span-8'>
          <div className='flex flex-col gap-5'>
            <CarbonUse />
            <CarbonReduce />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

Dashboard.auth = false

Dashboard.getLayout = (page: ReactElement) => {
  return (
    <Fragment>
      <MainLayout>{page}</MainLayout>
    </Fragment>
  )
}
