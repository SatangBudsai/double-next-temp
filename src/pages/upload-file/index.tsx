import { Fragment, ReactElement, useState } from 'react'
import { useTheme } from 'next-themes'
import RootLayout from '@/layouts/root-layout'
import MainLayout from '@/layouts/main-layout'
import { DateRange } from 'react-day-picker'
import Alert from '@/components/alert'
import { Button, Input, Image, Spacer } from '@nextui-org/react'
import useLoaderGlobal from '@/hooks/useLoadingScreen'
import DatePicker from '@/components/date-picker'
import DateMultiplePicker from '@/components/date-multiple-picker'
import DateRangePicker from '@/components/date-range-picker'
import exampleSubService from '@/api/manual/sub-service/example'
import { Controller, useForm } from 'react-hook-form'
import { SlideshowLightbox } from 'lightbox.js-react'
import { useTranslation } from 'react-i18next'
import UploadMultipleFile from '@/components/upload-multiple-file'
import UploadSingleFile from '@/components/upload-singer-file'
import { convertToBytes } from '@/utils/upload-files/convertToBytes'

type ItemsType = {
  pathURL: string
  fileName: string
  fileSize: number
  order: number
}

const items: ItemsType[] = [
  {
    pathURL: 'https://pixlr.com/images/generator/text-to-image.webp',
    fileName: 'text-to-image.webp',
    fileSize: 1000,
    order: 0
  },
  {
    pathURL: 'https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649',
    fileName: 'subhome-ai.webp',
    fileSize: 1500,
    order: 1
  },
  {
    pathURL:
      'https://img.freepik.com/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg',
    fileName: 'abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg',
    fileSize: 2300,
    order: 2
  }
]

type Props = {}

const UploadFile = (props: Props) => {
  const loaderGlobal = useLoaderGlobal()
  const { theme, setTheme } = useTheme()
  const [date, setDate] = useState<Date | undefined>()
  const [arrDate, setArrDate] = useState<Date[] | undefined>()
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>()
  const { t: tCommon } = useTranslation('translation', { keyPrefix: 'common' })

  const getApi = async () => {
    loaderGlobal.start()
    exampleSubService.getExample()
    loaderGlobal.stop()
  }

  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [defaultFilesRemove, setDefaultFilesRemove] = useState<ItemsType[]>([])
  const [orderDefaultFiles, setOrderDefaultFiles] = useState<ItemsType[]>([])

  return (
    <Fragment>
      <UploadSingleFile />

      <Spacer y={5} />
      <UploadMultipleFile
        isDrag={true}
        orderKey='order'
        defaultFiles={items}
        srcImage={file => file.pathURL}
        fileName={file => file.fileName}
        fileSize={file => file.fileSize}
        onSelectFiles={value => {
          console.log('🚀 ~ onSelectFiles ~ value:', value)
          setUploadFiles(value.map(item => item.file))
        }}
        onRemoveDefaultFiles={value => {
          console.log('🚀 ~ onRemoveDefaultFiles ~ value:', value)
          setDefaultFilesRemove(value)
        }}
        onChangeOrderDefaultFiles={value => {
          console.log('🚀 ~ onChangeOrderDefaultFilesDrag ~ value:', value)
          setOrderDefaultFiles(value)
        }}
        dropzoneOptions={{
          maxFiles: 10,
          maxSize: convertToBytes({ size: 100, unit: 'MB' })
        }}
        maxTotalSize={convertToBytes({ size: 10, unit: 'MB' })}
      />
    </Fragment>
  )
}

export default UploadFile
UploadFile.auth = false

UploadFile.getLayout = (page: ReactElement) => {
  return (
    <Fragment>
      <MainLayout>{page}</MainLayout>
    </Fragment>
  )
}
