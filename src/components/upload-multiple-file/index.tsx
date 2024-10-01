import { cn } from '@/utils/cn'
import { Icon } from '@iconify/react'
import { Button, Image } from '@nextui-org/react'
import { SlideshowLightbox } from 'lightbox.js-react'
import React, { useState, useEffect, Fragment, useMemo } from 'react'
import Dropzone, { DropzoneOptions, FileRejection } from 'react-dropzone'
import 'lightbox.js-react/dist/index.css'
import { isImageFile } from '@/utils/upload-files/isImageFile'
import { formatFileSize } from '@/utils/upload-files/formatFileSize'
import { fileNameFromUrl } from '@/utils/upload-files/fileNameFormUrl'
import path from 'path'
import { getIconFileName } from '@/utils/upload-files/getIconFileName'

interface FileObject {
  [key: string]: any
}

interface ErrorCategory {
  [category: string]: string[] // Each category is a list of error messages.
}
interface UploadMultipleFileProps<T> {
  defaultFiles: T[] | []
  srcImage?: (file: T) => string | undefined | null
  fileName?: (file: T) => string | undefined | null
  fileSize?: (file: T) => number | undefined | null
  onFilesSelect?: (files: File[]) => void
  onDefaultFilesRemove?: (deleteFile: T[]) => void
  dropzoneContent?: React.ReactNode
  dropzoneClassName?: string
  contentClassName?: string
  dropzoneOptions?: DropzoneOptions
}

const UploadMultipleFile = <T extends FileObject>({
  defaultFiles = [],
  onFilesSelect,
  onDefaultFilesRemove,
  srcImage = file => file?.src,
  fileName = file => file?.alt,
  fileSize = file => file?.fileSize,
  dropzoneClassName,
  contentClassName,
  dropzoneContent,
  dropzoneOptions
}: UploadMultipleFileProps<T>) => {
  const [errors, setErrors] = useState<ErrorCategory>({})
  const [initFiles, setInitFiles] = useState<T[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [deleteFiles, setDeleteFiles] = useState<T[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [startingIndex, setStartingIndex] = useState(0)

  useEffect(() => {
    setInitFiles(defaultFiles)
    setUploadedFiles([])
    setDeleteFiles([])
  }, [defaultFiles])

  const transformedDefaultImages = useMemo(() => {
    return initFiles.map(file => ({
      src: srcImage(file) || '',
      fileName: fileName(file),
      isImage: isImageFile(fileNameFromUrl(srcImage(file) || '')),
      fileSize: fileSize(file)
    }))
  }, [initFiles, srcImage, fileName, fileSize])

  const transformedSelectImages = useMemo(() => {
    return uploadedFiles.map(file => ({
      src: URL.createObjectURL(file),
      fileName: file.name,
      isImage: file.type.startsWith('image/'),
      fileSize: file.size
    }))
  }, [uploadedFiles])

  const transformedImages = useMemo(() => {
    return [...transformedDefaultImages, ...transformedSelectImages]
  }, [transformedDefaultImages, transformedSelectImages])

  const handleUploadFiles = (fileList: File[], rejectedFiles: FileRejection[]) => {
    // Initialize an object to hold categorized errors
    let errorCategories: ErrorCategory = {
      duplicateFiles: [],
      oversizedFiles: [],
      unsupportedFiles: [],
      maxFilesExceeded: []
    }

    // Check for duplicate filenames
    const existingFileNames = [
      ...initFiles.map(file => fileName(file)),
      ...uploadedFiles.map(file => file.name)
    ].filter(Boolean)

    const duplicateFiles = fileList.filter(file => existingFileNames.includes(file.name))
    if (duplicateFiles.length > 0) {
      duplicateFiles.forEach(file => {
        errorCategories.duplicateFiles.push(`ชื่อไฟล์ซ้ำ: "${file.name}"`)
      })
    }

    if (dropzoneOptions) {
      // Check for maximum file count
      if (
        dropzoneOptions.maxFiles &&
        fileList.length + uploadedFiles.length + initFiles.length > dropzoneOptions.maxFiles
      ) {
        errorCategories.maxFilesExceeded.push(`คุณสามารถอัปโหลดได้สูงสุด ${dropzoneOptions.maxFiles} ไฟล์`)
      }

      // Check for rejected files due to size and type
      rejectedFiles.forEach(rejection => {
        rejection.errors.forEach(error => {
          if (error.code === 'file-too-large') {
            errorCategories.oversizedFiles.push(
              `ขนาดไฟล์เกินกำหนด: "${rejection.file.name}" ขนาดใหญ่กว่า ${formatFileSize(dropzoneOptions?.maxSize || 0)}`
            )
          }
          if (error.code === 'file-invalid-type') {
            errorCategories.unsupportedFiles.push(`ประเภทไฟล์ไม่รองรับ: "${rejection.file.name}"`)
          }
        })
      })
    }

    // Set the categorized errors or clear errors if no errors exist
    if (
      errorCategories.duplicateFiles.length > 0 ||
      errorCategories.oversizedFiles.length > 0 ||
      errorCategories.unsupportedFiles.length > 0 ||
      errorCategories.maxFilesExceeded.length > 0
    ) {
      setErrors(errorCategories)
      return
    }

    setErrors({})
    const newFiles = [...uploadedFiles, ...fileList]
    setUploadedFiles(newFiles)
    onFilesSelect && onFilesSelect(newFiles)
  }

  const handleRemoveFiles = (index: number) => {
    if (index < initFiles.length) {
      // Remove from files
      const delFile = initFiles.find((_, i) => i === index)
      if (delFile) {
        const delFileList = [...deleteFiles, delFile]
        setDeleteFiles(delFileList)
        const newFiles = initFiles.filter((_, i) => i !== index)
        setInitFiles(newFiles)
        onDefaultFilesRemove && onDefaultFilesRemove(delFileList)
      }
    } else {
      // Remove from uploadedFiles
      const newFiles = uploadedFiles.filter((_, i) => i !== index - initFiles.length)
      setUploadedFiles(newFiles)
    }
  }

  return (
    <Fragment>
      <Dropzone onDrop={handleUploadFiles} {...dropzoneOptions}>
        {({ getRootProps, getInputProps, open }) => (
          <section>
            <div {...getRootProps()} className='w-full'>
              <input {...getInputProps()} />
              <div
                className={cn(
                  'flex flex-col items-center justify-center gap-2',
                  'rounded-xl border-2 border-dashed border-default-200 text-default-500',
                  'h-52 cursor-pointer py-5',
                  dropzoneClassName
                )}>
                {dropzoneContent || (
                  <Fragment>
                    <Icon icon='lucide:upload' width={25} />
                    <Button onClick={open}>Upload File</Button>
                    <p className='text-sm'>or Drag and Drop</p>
                  </Fragment>
                )}
              </div>
            </div>
          </section>
        )}
      </Dropzone>

      {/* Error Message */}
      {Object.keys(errors).length > 0 && (
        <div className='mt-2 rounded-lg bg-danger/10 p-5 text-danger'>
          <p className='text-lg font-semibold'>ไฟล์อัพโหลดไม่ตรงตามเงื่อนไขที่กำหนดดังนี้</p>
          <ul className='list-disc pl-5 text-sm'>
            {Object.entries(errors).map(([category, messages]) => (
              <Fragment key={category}>
                {messages.length > 0 && (
                  <li>
                    <p className='font-semibold uppercase'>{category}:</p>
                    <ul className='list-disc pl-5'>
                      {messages.map((message, index) => (
                        <li key={index}>{message}</li>
                      ))}
                    </ul>
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
        </div>
      )}

      {/* Display uploaded and initial files */}
      <SlideshowLightbox
        lightboxIdentifier='lightBoxUploadMultipleFile'
        images={transformedImages.filter(file => file.isImage)}
        open={isOpen}
        startingSlideIndex={startingIndex}
        showThumbnails={true}
        onClose={() => setIsOpen(false)}
        modalClose={'clickOutside'}
        backgroundColor='rgba(255, 255, 255, 0.8)'
      />

      <div className={cn('mt-5 flex flex-col gap-2', contentClassName)}>
        {transformedImages.length > 0 &&
          transformedImages.map((file, index) => {
            const isImage = file.isImage
            console.log('file.fileSize', file.fileSize)

            return (
              <div className='flex items-center justify-between gap-4 hover:bg-default/15' key={index}>
                <div
                  className={cn('flex flex-1 items-center gap-2 hover:opacity-80', isImage && 'cursor-pointer')}
                  onClick={() => {
                    if (isImage) {
                      setIsOpen(true)
                      setStartingIndex(index)
                    }
                  }}>
                  {isImage ? (
                    <Image
                      src={file.src || '/images/@mock/300x200.jpg'}
                      alt={file.fileName || ''}
                      radius='sm'
                      className='h-11 w-14 object-cover'
                    />
                  ) : (
                    <Icon icon={getIconFileName(file.fileName as string)} width={40} className='w-14 text-primary' />
                  )}
                  <div className='flex flex-1 flex-col'>
                    <p className='flex-1 truncate text-nowrap'>{file.fileName}</p>
                    <div className='flex gap-1'>
                      <Icon
                        icon='solar:check-circle-bold-duotone'
                        className={cn(index < initFiles.length ? 'text-success' : 'text-default-400')}
                      />
                      <p className='text-sm text-default-500'>
                        {file.fileSize
                          ? formatFileSize(file.fileSize)
                          : file.fileSize === 0
                            ? 'ไม่พบไฟล์'
                            : 'อัพโหลดเเล้ว'}
                      </p>
                    </div>
                  </div>
                </div>
                <Button size='sm' color='danger' variant='bordered' isIconOnly onPress={() => handleRemoveFiles(index)}>
                  <Icon icon='solar:close-square-bold' width={20} />
                </Button>
              </div>
            )
          })}
      </div>
    </Fragment>
  )
}

export default UploadMultipleFile
