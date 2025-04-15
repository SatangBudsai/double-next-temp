'use client'

import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

type Props = {}

const Footer = (props: Props) => {
  return (
    <div className='flex justify-between px-7 py-7 text-default-500'>
      <div className='flex items-center gap-1'>
        Copyright
        <Icon icon='tdesign:copyright' className='text-lg' />
        2025 | {process.env.NEXT_PUBLIC_PROJECT_NAME}
      </div>
    </div>
  )
}

export default Footer
