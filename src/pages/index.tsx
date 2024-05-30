import { Fragment, ReactElement, useState } from 'react'
import { useTheme } from 'next-themes'
import RootLayout from '@/layouts/root-layout'
import MainLayout from '@/layouts/main-layout'
import { DateRange } from 'react-day-picker'
import Alert from '@/components/alert'
import { Button, Input } from '@nextui-org/react'
import apiBase from '@/api/base'
import useLoaderGlobal from '@/hooks/useLoaderGlobal'
import DatePicker from '@/components/date-picker'
import DateMultiplePicker from '@/components/date-multiple-picker'
import DateRangePicker from '@/components/date-range-picker'
import dayjs from 'dayjs'
import apiClient from '@/service/main-service'

type Props = {}

const Home = (props: Props) => {
  const loaderGlobal = useLoaderGlobal()

  const { theme, setTheme } = useTheme()
  const [date, setDate] = useState<Date | undefined>()
  const [arrDate, setArrDate] = useState<Date[] | undefined>()
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>()

  const getApi = async () => {
    loaderGlobal.start()
    await apiClient.get('/users')
    await apiBase.get({ urlBase: 'https://randomuser.me', url: '/api' })
    loaderGlobal.stop()
  }

  return (
    <Fragment>
      <div className='flex flex-col gap-5'>
        <div className='flex flex-wrap items-center justify-center gap-5'>Template NextJs and NextUI</div>

        <Button variant='flat' color='primary' onClick={getApi}>
          Call API
        </Button>
        <div className='grid grid-cols-6 gap-5 max-md:grid-cols-2'>
          <Button
            color='primary'
            onClick={() =>
              Alert.message({
                content: 'Open Message',
                noButton: true
              })
            }>
            Open Message
          </Button>

          <Button
            color='primary'
            onClick={() =>
              Alert.message({
                content: 'Open Message',
                noButton: true,
                color: 'secondary'
              })
            }>
            Open Message
          </Button>

          <Button
            color='primary'
            onClick={() =>
              Alert.error({
                content: 'Open Error'
              })
            }>
            Open Error
          </Button>

          <Button
            color='primary'
            onClick={() =>
              Alert.warning({
                content: 'Open warning'
              })
            }>
            Open warning
          </Button>

          <Button
            color='primary'
            onClick={() =>
              Alert.success({
                content: 'Open success'
              })
            }>
            Open success
          </Button>

          <Button
            color='primary'
            onClick={() =>
              Alert.question({
                content: 'Open Question',
                color: 'default'
              })
            }>
            Open Question
          </Button>
        </div>
        <div className='grid grid-cols-2 gap-5 max-sm:grid-cols-1'>
          <DatePicker
            mode='single'
            label='DatePicker'
            placeholder='Picker Date'
            labelPlacement='inside'
            variant='bordered'
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
          />
          <DateMultiplePicker
            mode='multiple'
            label='DateMultiplePicker'
            placeholder='DateMultiplePicker'
            variant='bordered'
            captionLayout='dropdown-buttons'
            selected={arrDate}
            onSelect={setArrDate}
            defaultMonth={arrDate ? arrDate[0] : new Date()}
          />
          <DateRangePicker
            mode='range'
            label='DateRangePicker'
            placeholder='DateMultiplePicker'
            labelPlacement='inside'
            variant='bordered'
            captionLayout='dropdown-buttons'
            selected={rangeDate}
            onSelect={setRangeDate}
            numberOfMonths={2}
            defaultMonth={rangeDate?.from}
          />
          <Input type='text' label='Name' placeholder='Enter Name' variant='bordered' />
          <Input type='number' label='Number' placeholder='Enter Number' variant='bordered' />
          <Input type='email' label='Email' placeholder='Enter Email' variant='bordered' />
        </div>
      </div>
    </Fragment>
  )
}

export default Home
Home.auth = false

Home.getLayout = (page: ReactElement) => {
  return (
    <Fragment>
      <MainLayout>{page}</MainLayout>
    </Fragment>
  )
}
