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

interface UploadMultipleFileProps<T> {
  defaultFiles: T[] | []
  srcImage?: (file: T) => string | undefined | null
  fileName?: (file: T) => string | undefined | null
  fileSize?: (file: T) => string | undefined | null
  onFilesUpload?: (files: File[]) => void
  onFilesDeleted?: (deleteFile: T[]) => void
  dropzoneContent?: React.ReactNode
  dropzoneClassName?: string
  contentClassName?: string
  dropzoneOptions?: DropzoneOptions
}

const UploadMultipleFile = <T extends FileObject>({
  defaultFiles = [],
  onFilesUpload,
  onFilesDeleted,
  srcImage = file => file?.src,
  fileName = file => file?.alt,
  dropzoneClassName,
  contentClassName,
  dropzoneContent,
  dropzoneOptions
}: UploadMultipleFileProps<T>) => {
  const [error, setError] = useState<string>('')
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

  const transformedInitialImages = useMemo(() => {
    return initFiles.map(file => ({
      src: srcImage(file) || '',
      fileName: fileName(file),
      isImage: isImageFile(fileNameFromUrl(srcImage(file) || '')),
      type: 'existing' // Custom property to distinguish uploaded or default
    }))
  }, [initFiles, srcImage, fileName])

  const transformedUploadedImages = useMemo(() => {
    return uploadedFiles.map(file => ({
      src: URL.createObjectURL(file),
      fileName: file.name,
      isImage: file.type.startsWith('image/'),
      type: file.type
    }))
  }, [uploadedFiles])

  const transformedImages = useMemo(() => {
    return [...transformedInitialImages, ...transformedUploadedImages]
  }, [transformedInitialImages, transformedUploadedImages])

  const handleUploadFiles = (fileList: File[], rejectedFiles: FileRejection[]) => {
    console.log('🚀 ~ handleUploadFiles ~ fileList:', fileList)

    // Check for duplicate filenames
    const existingFileNames = [
      ...initFiles.map(file => fileName(file)),
      ...uploadedFiles.map(file => file.name)
    ].filter(Boolean)

    const duplicateFiles = fileList.filter(file => existingFileNames.includes(file.name))
    if (duplicateFiles.length > 0) {
      setError('ไม่สามารถอัปโหลดไฟล์ที่มีชื่อซ้ำได้')
      return
    }

    if (dropzoneOptions) {
      if (
        dropzoneOptions.maxFiles &&
        fileList.length + uploadedFiles.length + initFiles.length > dropzoneOptions.maxFiles
      ) {
        setError(`คุณสามารถอัปโหลดได้สูงสุด ${dropzoneOptions.maxFiles} ไฟล์`)
        return
      }

      if (rejectedFiles.length > 0) {
        const oversizedFiles = rejectedFiles.filter(rejection =>
          rejection.errors.some(error => error.code === 'file-too-large')
        )
        if (oversizedFiles.length > 0) {
          setError(`ไฟล์ที่คุณพยายามอัปโหลดมีขนาดใหญ่กว่า ${formatFileSize(dropzoneOptions?.maxSize || 0)} ที่กำหนด`)
          return
        }

        const unsupportedFiles = rejectedFiles.filter(rejection =>
          rejection.errors.some(error => error.code === 'file-invalid-type')
        )
        if (unsupportedFiles.length > 0) {
          setError('ไฟล์ที่คุณพยายามอัปโหลดไม่ใช่ประเภทที่รองรับ')
          return
        }
      }
    }

    setError('')
    const newFiles = [...uploadedFiles, ...fileList]
    setUploadedFiles(newFiles)
    onFilesUpload && onFilesUpload(newFiles)
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
        onFilesDeleted && onFilesDeleted(delFileList)
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
      {error && (
        <div>
          <p className='mt-2 rounded-lg bg-danger/10 p-2 text-danger'>{error}</p>
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
                    <Icon icon={getIconFileName(file.fileName as string)} width={40} className='text-primary' />
                  )}
                  <div className='flex flex-1 flex-col'>
                    <p className='flex-1 truncate text-nowrap'>{file.fileName}</p>
                    {index >= initFiles.length ? (
                      <p className='text-sm text-default-500'>
                        {formatFileSize(uploadedFiles[index - initFiles.length].size)}
                      </p>
                    ) : (
                      <p className='text-sm text-default-500'>อัพโหลดเสร็จสิ้น</p>
                    )}
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
