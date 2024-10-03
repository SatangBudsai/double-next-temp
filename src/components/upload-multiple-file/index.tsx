import { cn } from '@/utils/cn'
import { Icon } from '@iconify/react'
import { Button, Divider, Image, Progress, Spacer } from '@nextui-org/react'
import { SlideshowLightbox } from 'lightbox.js-react'
import React, { useState, useEffect, Fragment, useMemo } from 'react'
import Dropzone, { DropzoneOptions, FileRejection } from 'react-dropzone'
import 'lightbox.js-react/dist/index.css'
import { isImageFile } from '@/utils/upload-files/isImageFile'
import { formatFileSize } from '@/utils/upload-files/formatFileSize'
import { fileNameFromUrl } from '@/utils/upload-files/fileNameFormUrl'
import path from 'path'
import { getIconFileName } from '@/utils/upload-files/getIconFileName'

import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'

interface FileObject {
  [key: string]: any
}

interface ErrorCategory {
  [category: string]: string[] // Each category is a list of error messages.
}

interface TransformedImagesType {
  isDefaultFile: boolean
  order: number
  src: string
  fileName: string | null | undefined
  isImage: boolean
  fileSize: number | null | undefined
}

// interface UploadMultipleFileProps<T> {
//   defaultFiles: T[] | []
//   srcImage?: (file: T) => string | undefined | null
//   fileName?: (file: T) => string | undefined | null
//   fileSize?: (file: T) => number | undefined | null
//   orderKey?: keyof T
//   isDrag?: boolean
//   onSelectFiles?: (files: { order: number; file: File }[]) => void
//   onRemoveDefaultFiles?: (value: T[]) => void
//   onChangeOrderDefaultFilesDrag?: (value: T[]) => void
//   dropzoneContent?: React.ReactNode
//   dropzoneClassName?: string
//   contentClassName?: string
//   dropzoneOptions?: DropzoneOptions
// }

interface CommonProps<T> {
  defaultFiles: T[] | []
  srcImage?: (file: T) => string | undefined | null
  fileName?: (file: T) => string | undefined | null
  fileSize?: (file: T) => number | undefined | null
  onSelectFiles?: (files: { order: number; file: File }[]) => void
  onRemoveDefaultFiles?: (value: T[]) => void
  groupUploadStatus?: boolean
  dropzoneContent?: React.ReactNode
  dropzoneClassName?: string
  contentClassName?: string
  dropzoneOptions?: DropzoneOptions
}

interface UploadMultipleFileWithDragProps<T> extends CommonProps<T> {
  isDrag: true
  orderKey: keyof T // Required when isDrag is true
  onChangeOrderDefaultFilesDrag: (value: T[]) => void
}

interface UploadMultipleFileWithoutDragProps<T> extends CommonProps<T> {
  isDrag?: false
  orderKey?: never // Not required or should be undefined
  onChangeOrderDefaultFilesDrag?: never
}

type UploadMultipleFileProps<T> = UploadMultipleFileWithDragProps<T> | UploadMultipleFileWithoutDragProps<T>

const UploadMultipleFile = <T extends FileObject>({
  defaultFiles = [],
  srcImage = file => file?.src,
  fileName = file => file?.alt,
  fileSize = file => file?.fileSize,
  orderKey = 'order',
  isDrag = false,
  onSelectFiles,
  onRemoveDefaultFiles,
  onChangeOrderDefaultFilesDrag,
  groupUploadStatus = false,
  dropzoneClassName,
  contentClassName,
  dropzoneContent,
  dropzoneOptions
}: UploadMultipleFileProps<T>) => {
  const [errors, setErrors] = useState<ErrorCategory>({})
  const [initFiles, setInitFiles] = useState<T[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<{ order: number; file: File }[]>([])
  const [deleteFiles, setDeleteFiles] = useState<T[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [startingIndex, setStartingIndex] = useState(0)

  useEffect(() => {
    if (isDrag && !orderKey) {
      throw new Error("The 'orderKey' must be set when 'isDrag' is true.")
    }
  }, [isDrag, orderKey])

  useEffect(() => {
    setInitFiles(defaultFiles)
    setUploadedFiles([])
    setDeleteFiles([])
  }, [defaultFiles])

  const transformedDefaultImages = useMemo<TransformedImagesType[]>(() => {
    return initFiles.map(item => ({
      isDefaultFile: true,
      order: item[orderKey] as number,
      src: srcImage(item) || '',
      fileName: fileName(item),
      isImage: isImageFile(fileNameFromUrl(srcImage(item) || '')),
      fileSize: fileSize(item)
    }))
  }, [initFiles, srcImage, fileName, fileSize, orderKey])

  const transformedSelectImages = useMemo<TransformedImagesType[]>(() => {
    return uploadedFiles.map(item => ({
      isDefaultFile: false,
      order: item.order,
      src: URL.createObjectURL(item.file),
      fileName: item.file.name,
      isImage: item.file.type.startsWith('image/'),
      fileSize: item.file.size
    }))
  }, [uploadedFiles])

  const transformedImages = useMemo<TransformedImagesType[]>(() => {
    return [...transformedDefaultImages, ...transformedSelectImages].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
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
      ...uploadedFiles.map(item => item.file.name)
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

    let formatFileList: { order: number; file: File }[] = []
    fileList.forEach((file, index) => {
      formatFileList.push({ file: file, order: transformedImages.length + index })
    })

    const newFiles = [...uploadedFiles, ...formatFileList]
    setUploadedFiles(newFiles)
    onSelectFiles && onSelectFiles(newFiles)

    setErrors({})
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

        onRemoveDefaultFiles && onRemoveDefaultFiles(delFileList)
      }
    } else {
      // Remove from uploadedFiles
      const newFiles = uploadedFiles.filter((_, i) => i !== index - initFiles.length)
      setUploadedFiles(newFiles)
    }
  }

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10 // Drag will only activate if moved 10 pixels or more
    }
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 10 // Same for touch devices
    }
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  // Handle sorting logic
  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      // Get the old and new indices for all items
      const allItems = [...transformedImages]
      const oldIndex = allItems.findIndex(item => item.fileName === active.id)
      const newIndex = allItems.findIndex(item => item.fileName === over.id)

      // Rearrange the items in new order
      const newAllItems = arrayMove(allItems, oldIndex, newIndex)
      const newInitFiles: T[] = [...initFiles]
      const newUploadedFiles: { order: number; file: File }[] = [...uploadedFiles]

      // Update order for each item in newAllItems
      newAllItems.forEach((item, index) => {
        if (item.isDefaultFile) {
          // Update order in initFiles
          const initFileIndex = newInitFiles.findIndex(itemInit => fileName(itemInit) === item.fileName)
          if (initFileIndex !== -1) {
            newInitFiles[initFileIndex] = {
              ...newInitFiles[initFileIndex],
              [orderKey]: index
            }
          }
        } else {
          // Update order in uploadedFiles
          const uploadedFileIndex = newUploadedFiles.findIndex(uploaded => uploaded.file.name === item.fileName)
          if (uploadedFileIndex !== -1) {
            newUploadedFiles[uploadedFileIndex] = {
              ...newUploadedFiles[uploadedFileIndex],
              order: index
            }
          }
        }
      })

      // Sort
      newInitFiles.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      newUploadedFiles.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      // Update state
      setInitFiles(newInitFiles)
      setUploadedFiles(newUploadedFiles)

      // Trigger callback if provided
      onChangeOrderDefaultFilesDrag && onChangeOrderDefaultFilesDrag(newInitFiles)
      onSelectFiles && onSelectFiles(newUploadedFiles)
    }
  }

  return (
    <Fragment>
      {/* Dropzone Section Remains Unchanged */}
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

      {/* Error Message Remains Unchanged */}
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

      {/* Draggable and Sortable List */}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
        sensors={sensors}>
        <SortableContext
          disabled={!isDrag}
          items={transformedImages.map(file => file.fileName || file.order?.toString())}
          strategy={verticalListSortingStrategy}>
          <div className={cn('mt-5 flex flex-col gap-2', contentClassName)}>
            {groupUploadStatus ? (
              <Fragment>
                {transformedImages.filter(item => item.isDefaultFile).length > 0 && (
                  <Fragment>
                    {transformedImages
                      .filter(item => item.isDefaultFile)
                      .map((file, index) => (
                        <SortableItem
                          key={file.fileName || index.toString()}
                          id={file.fileName || file.order?.toString()}
                          index={index}
                          file={file}
                          initFiles={initFiles}
                          onRemove={handleRemoveFiles}
                          setIsOpen={setIsOpen}
                          setStartingIndex={setStartingIndex}
                          disableDrag={!isDrag}
                        />
                      ))}
                  </Fragment>
                )}
                {transformedImages.filter(item => !item.isDefaultFile).length > 0 && (
                  <Fragment>
                    <Spacer y={2} />
                    <Divider />
                    <p className='text font-medium'>ยังไม่ได้อัพโหลด</p>
                    {transformedImages
                      .filter(item => !item.isDefaultFile)
                      .map((file, index) => (
                        <SortableItem
                          key={file.fileName || index.toString()}
                          id={file.fileName || file.order?.toString()}
                          index={index}
                          file={file}
                          initFiles={initFiles}
                          onRemove={handleRemoveFiles}
                          setIsOpen={setIsOpen}
                          setStartingIndex={setStartingIndex}
                          disableDrag={!isDrag}
                        />
                      ))}
                  </Fragment>
                )}
              </Fragment>
            ) : (
              <Fragment>
                {transformedImages.length > 0 && (
                  <Fragment>
                    <p className='text font-medium'>อัพโหลดเเล้ว</p>
                    {transformedImages.map((file, index) => (
                      <SortableItem
                        key={file.fileName || index.toString()}
                        id={file.fileName || file.order?.toString()}
                        index={index}
                        file={file}
                        initFiles={initFiles}
                        onRemove={handleRemoveFiles}
                        setIsOpen={setIsOpen}
                        setStartingIndex={setStartingIndex}
                        disableDrag={!isDrag}
                      />
                    ))}
                  </Fragment>
                )}
              </Fragment>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </Fragment>
  )
}

// SortableItem Component
const SortableItem = ({
  id,
  index,
  file,
  initFiles,
  onRemove,
  setIsOpen,
  setStartingIndex,
  disableDrag = false
}: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const isImage = file.isImage

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!disableDrag && { ...attributes, ...listeners })}
      className='flex items-center justify-between gap-4 hover:bg-default/15'>
      <div
        className={cn('flex flex-1 items-center gap-2 hover:opacity-80', isImage && 'cursor-pointer')}
        onClick={() => {
          if (isImage) {
            setIsOpen(true)
            setStartingIndex(index)
          }
        }}>
        {!disableDrag && <Icon icon='akar-icons:drag-vertical' width={20} />}
        {isImage ? (
          <Image
            src={file.src || '/images/@mock/300x200.jpg'}
            alt={file.fileName || ''}
            radius='sm'
            className='h-11 w-14 object-cover'
          />
        ) : (
          <Icon
            icon={file.fileName ? getIconFileName(file.fileName as string) : 'emojione-v1:warning'}
            width={40}
            className='w-14 text-primary'
          />
        )}
        <div className='flex flex-1 flex-col'>
          <p className='flex-1 truncate text-nowrap'>{file.fileName || 'ไม่ได้ระบุ'}</p>
          <div className='flex items-center gap-1'>
            <Icon
              icon='solar:check-circle-bold-duotone'
              className={cn(file.isDefaultFile ? 'text-success' : 'text-default-400')}
            />
            <p className='text-sm text-default-500'>
              {file.fileSize ? formatFileSize(file.fileSize) : file.fileSize === 0 ? 'ไม่พบไฟล์' : 'อัพโหลดเเล้ว'}
            </p>
            {/* {!file.isDefaultFile && (
              <Progress color='success' aria-label='Loading...' value={0} className='flex-1' size='md' />
            )} */}
          </div>
        </div>
      </div>
      <Button size='sm' color='danger' variant='bordered' isIconOnly onPress={() => onRemove(index)}>
        <Icon icon='solar:trash-bin-2-bold-duotone' width={20} />
      </Button>
    </div>
  )
}

export default UploadMultipleFile
