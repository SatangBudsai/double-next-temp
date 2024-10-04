import { Fragment, ReactElement, useState } from 'react'
import { useTheme } from 'next-themes'
import MainLayout from '@/layouts/main-layout'
import { DateRange } from 'react-day-picker'
import useLoaderGlobal from '@/hooks/useLoaderGlobal'
import exampleSubService from '@/api/manual/sub-service/example'
import { useTranslation } from 'react-i18next'
import UploadMultipleFile from '@/components/upload-multiple-file'
import { convertToBytes } from '@/utils/upload-files/convertToBytes'
import { Spacer } from '@nextui-org/react'

type ItemsType = {
  pathURL: string
  fileName: string
  fileSize: number
  orderNo: number
}

interface ProgressType {
  [key: string]: number // ใช้เพื่อเก็บเปอร์เซ็นต์ของแต่ละไฟล์ โดยมี key เป็นชื่อไฟล์
}

const items: ItemsType[] = [
  {
    pathURL: 'https://pixlr.com/images/generator/text-to-image.webp',
    fileName: 'text-to-image.webp',
    fileSize: 1000,
    orderNo: 0
  },
  {
    pathURL: 'https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649',
    fileName: 'subhome-ai.webp',
    fileSize: 1500,
    orderNo: 1
  },
  {
    pathURL:
      'https://img.freepik.com/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg',
    fileName: 'abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg',
    fileSize: 2300,
    orderNo: 2
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
  const [progress, setProgress] = useState<ProgressType>({})

  return (
    <Fragment>
      {/* <UploadSingleFile /> */}

      <Spacer y={5} />
      <UploadMultipleFile
        defaultFiles={items}
        srcImage={file => file.pathURL}
        fileName={file => file.fileName}
        fileSize={file => file.fileSize}
        // groupUploadStatus={true}
        // isDrag={true}
        // orderKey='order'
        onSelectFiles={value => {
          console.log('🚀 ~ onSelectFiles ~ value:', value)
          setUploadFiles(value.map(item => item.file))
        }}
        onRemoveDefaultFiles={value => {
          console.log('🚀 ~ onRemoveDefaultFiles ~ value:', value)
          setDefaultFilesRemove(value)
        }}
        // onChangeOrderDefaultFilesDrag={value => {
        //   console.log('🚀 ~ onChangeOrderDefaultFilesDrag ~ value:', value)
        //   setOrderDefaultFiles(value)
        // }}
        dropzoneOptions={{
          maxFiles: 10,
          maxSize: convertToBytes({ size: 20, unit: 'MB' })
        }}
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
