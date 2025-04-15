import { Spacer } from "@heroui/react"
import React, { Fragment } from 'react'

type Props = {}

const Department = (props: Props) => {
  const departments = [
    {
      department: 'Department A',
      activity: 123
    },
    {
      department: 'Department B',
      activity: 342
    },
    {
      department: 'Department C',
      activity: 45
    },
    {
      department: 'Department D',
      activity: 299
    },
    {
      department: 'Department E',
      activity: 87
    }
  ]

  const totalActivity = departments.reduce((acc, curr) => acc + curr.activity, 0)
  return (
    <Fragment>
      <div className='grid grid-cols-4 rounded-lg bg-default-100 p-1 font-semibold'>
        <div className='col-span-2'>ชื่อหน่วยงาน</div>
        <div className='col-span-1'>กิจกรรม</div>
        <div className='col-span-1'>เปอร์เซ็นต์ (%)</div>
      </div>
      <Spacer y={3} />
      <div className='grid grid-cols-4 gap-3'>
        {departments.map(item => (
          <Fragment key={item.department}>
            <div className='col-span-2'>{item.department}</div>
            <div className='col-span-1'>{item.activity.toLocaleString()}</div>
            <div className='col-span-1'>{((item.activity / totalActivity) * 100).toFixed(2)}</div>
          </Fragment>
        ))}
      </div>
    </Fragment>
  )
}

export default Department
