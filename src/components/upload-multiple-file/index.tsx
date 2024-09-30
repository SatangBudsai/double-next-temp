import { cn } from '@/utils/cn'
import { Icon } from '@iconify/react'
import { Button, Image } from '@nextui-org/react'
import { SlideshowLightbox } from 'lightbox.js-react'
import React, { useState, useEffect, Fragment, useMemo } from 'react'
import Dropzone, { DropzoneOptions } from 'react-dropzone'
import 'lightbox.js-react/dist/index.css'
import { isImageFile } from '@/utils/images/isImageFile'
import { formatFileSize } from '@/utils/images/formatFileSize'
import { fileNameFromUrl } from '@/utils/images/fileNameFormUrl'

interface FileObject {
  [key: string]: any
}

interface UploadMultipleFileProps<T> extends DropzoneOptions {
  defaultFiles?: T[]
  maxFiles?: number
  onFilesAccepted?: (files: File[]) => void
  onFilesDeleted?: (deleteFile: T[]) => void
  srcImage?: (file: T) => string | undefined | null
  altImage?: (file: T) => string | undefined | null
  className?: string
}

const UploadMultipleFile = <T extends FileObject>({
  defaultFiles = [],
  maxFiles,
  onFilesAccepted,
  onFilesDeleted,
  srcImage = file => file?.src,
  altImage = file => file?.alt,
  className,
  ...dropzoneProps
}: UploadMultipleFileProps<T>) => {
  const [error, setError] = useState<string>('')
  const [defaultList, setDefaultList] = useState<T[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [deleteFiles, setDeleteFiles] = useState<T[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [startingIndex, setStartingIndex] = useState(0)

  useEffect(() => {
    setDefaultList(defaultFiles)
    setUploadedFiles([])
    setDeleteFiles([])
  }, [defaultFiles])

  const transformedInitialImages = useMemo(() => {
    return defaultList.map(file => {
      const src = srcImage(file) || ''
      return {
        src,
        alt: altImage(file),
        isImage: isImageFile(fileNameFromUrl(src))
      }
    })
  }, [defaultList, srcImage, altImage])

  const transformedUploadedImages = useMemo(() => {
    return uploadedFiles.map(file => ({
      src: URL.createObjectURL(file),
      alt: file.name,
      isImage: file.type.startsWith('image/')
    }))
  }, [uploadedFiles])

  const transformedImages = useMemo(() => {
    return [...transformedInitialImages, ...transformedUploadedImages]
  }, [transformedInitialImages, transformedUploadedImages])

  const handleUploadFiles = (files: File[]) => {
    if (maxFiles && files.length + uploadedFiles.length + defaultList.length > maxFiles) {
      setError(`คุณสามารถอัปโหลดได้สูงสุด ${maxFiles} ไฟล์`)
      return
    }

    setError('')
    const newFiles = [...uploadedFiles, ...files]
    setUploadedFiles(newFiles)
    onFilesAccepted && onFilesAccepted(newFiles)
  }

  const handleRemoveFiles = (index: number) => {
    if (index < defaultList.length) {
      // Remove from defaultFiles
      const delFile = defaultList.find((_, i) => i === index)
      if (delFile) {
        const delFileList = [...deleteFiles, delFile]
        setDeleteFiles(delFileList)
        const newDefaultFiles = defaultList.filter((_, i) => i !== index)
        setDefaultList(newDefaultFiles)
        onFilesDeleted && onFilesDeleted(delFileList)
      }
    } else {
      // Remove from uploadedFiles
      const newFiles = uploadedFiles.filter((_, i) => i !== index - defaultList.length)
      setUploadedFiles(newFiles)
    }
  }

  return (
    <Fragment>
      <Dropzone onDrop={handleUploadFiles} {...dropzoneProps}>
        {({ getRootProps, getInputProps, open }) => (
          <section>
            <div {...getRootProps()} className='w-full'>
              <input {...getInputProps()} />
              <div
                className={cn(
                  'flex flex-col items-center justify-center gap-2',
                  'rounded-xl border-2 border-dashed border-default-200 text-default-500',
                  'cursor-pointer py-5 ',
                  className
                )}>
                <Icon icon='lucide:upload' width={25} />
                <Button onClick={open}>Upload File</Button>
                <p className='text-sm'>or Drag and Drop</p>
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
        images={transformedImages.filter(file => file.isImage)}
        open={isOpen}
        startingSlideIndex={startingIndex}
        showThumbnails={true}
        onClose={() => setIsOpen(false)}
        lightboxIdentifier='lightBoxUploaMultipleFile'
        backgroundColor='rgba(255, 255, 255, 0.8)'
      />

      <div className='mt-5 flex flex-col gap-2'>
        {transformedImages.length > 0 &&
          transformedImages.map((file, index) => {
            const isImage = file.isImage

            return (
              <div className='flex items-center justify-between gap-4 hover:bg-default/15' key={index}>
                <div
                  className='flex flex-1 items-center gap-2 hover:opacity-80'
                  onClick={() => {
                    if (isImage) {
                      setIsOpen(true)
                      setStartingIndex(index)
                    }
                  }}>
                  {isImage ? (
                    <Image
                      src={file.src || '/images/@mock/300x200.jpg'}
                      alt={file.alt || ''}
                      radius='sm'
                      className='h-11 w-14 object-cover'
                    />
                  ) : (
                    <Icon icon='solar:document-bold-duotone' width={40} className='text-primary' />
                  )}
                  <div className='flex flex-1 flex-col'>
                    <p className='flex-1 truncate text-nowrap'>{file.alt}</p>
                    {index >= defaultList.length ? (
                      <p className='text-sm text-default-500'>
                        {formatFileSize(uploadedFiles[index - defaultList.length].size)}
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
