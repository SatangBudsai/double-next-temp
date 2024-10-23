import { Fragment, ReactElement, useState } from 'react'
import { useTheme } from 'next-themes'
import RootLayout from '@/layouts/root-layout'
import MainLayout from '@/layouts/main-layout'
import { DateRange } from 'react-day-picker'
import Alert from '@/components/alert'
import { Button, Input, Image, Spacer } from '@nextui-org/react'
import DatePicker from '@/components/date-picker'
import DateMultiplePicker from '@/components/date-multiple-picker'
import DateRangePicker from '@/components/date-range-picker'
import exampleSubService from '@/api/manual/sub-service/example'
import { Controller, useForm } from 'react-hook-form'
import { SlideshowLightbox } from 'lightbox.js-react'
import { useTranslation } from 'react-i18next'
import UploadMultipleFile from '@/components/upload-multiple-file'
import UploadSingleFile from '@/components/upload-singer-file'
import useLoadingScreen from '@/hooks/useLoadingScreen'

type ItemsType = {
  pathURL: string
  fileName: string
}

const items: ItemsType[] = [
  {
    pathURL: 'https://pixlr.com/images/generator/text-to-image.webp',
    fileName: 'text-to-image.webp'
  },
  {
    pathURL: 'https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649',
    fileName: 'subhome-ai.webp'
  },
  {
    pathURL:
      'https://img.freepik.com/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg',
    fileName: 'abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg'
  }
]

const productsCafe = [
  {
    id: 1,
    name: 'Macarons',
    href: '#',
    imageSrc:
      'https://images.pexels.com/photos/808941/pexels-photo-808941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    imageAlt: 'Macarons',
    price: '$6',
    color: 'Black'
  },
  {
    id: 2,
    name: 'Pancakes',
    href: '#',
    imageSrc:
      'https://images.pexels.com/photos/2280545/pexels-photo-2280545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    imageAlt: 'Pancakes',
    price: '$4',
    color: 'White'
  },
  {
    id: 3,
    name: 'Macaron Box',
    href: '#',
    imageSrc:
      'https://images.pexels.com/photos/1346345/pexels-photo-1346345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    imageAlt: 'Pink macarons.',
    price: '$7',
    color: 'Navy'
  }
]

type Props = {}

const Home = (props: Props) => {
  const { t } = useTranslation()
  const loadingScreen = useLoadingScreen()
  const { theme, setTheme } = useTheme()
  const [date, setDate] = useState<Date | undefined>()
  const [arrDate, setArrDate] = useState<Date[] | undefined>()
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>()

  const getApi = async () => {
    loadingScreen.start({ key: 'home' })
    exampleSubService.getExample()
    loadingScreen.stop({ key: 'home' })
  }

  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [defaultFiles, setDefaultFiles] = useState<ItemsType[]>([])

  return (
    <Fragment>
      <div className='flex flex-col gap-5'>
        <div className='flex flex-wrap items-center justify-center gap-5'>Template NextJs and NextUI</div>
        <div className='flex justify-center'>{t('common.hello')}</div>

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
            color='secondary'
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
            color='danger'
            onClick={() =>
              Alert.error({
                content: 'Open Error'
              })
            }>
            Open Error
          </Button>

          <Button
            color='warning'
            onClick={() =>
              Alert.warning({
                content: 'Open warning'
              })
            }>
            Open warning
          </Button>

          <Button
            color='success'
            onClick={() =>
              Alert.success({
                content: 'Open success'
              })
            }>
            Open success
          </Button>

          <Button
            color='default'
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

      <Spacer y={5} />
      <SlideshowLightbox
        lightboxIdentifier='lbox1'
        showThumbnails={true}
        images={productsCafe}
        modalClose={'clickOutside'}
        onOpen={() => {
          document.body.classList.add('overflow-y-hidden')
        }}
        onClose={() => {
          document.body.classList.remove('overflow-y-hidden')
        }}
        className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8'>
        {productsCafe.map(product => (
          <div key={product.id}>
            <div className='aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 h-48 overflow-hidden rounded-lg bg-gray-200'>
              <Image
                src={product.imageSrc}
                alt={product.imageAlt}
                data-lightboxjs='lbox1'
                className='demoImg h-full w-full object-cover group-hover:opacity-75'
              />
            </div>
            <h3 className='mt-4 text-sm text-gray-700'>{product.name}</h3>
            <p className='mt-1 text-lg font-medium text-gray-900'>{product.price}</p>
          </div>
        ))}
      </SlideshowLightbox>
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
