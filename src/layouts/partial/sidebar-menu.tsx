'use client'

import { Accordion, AccordionItem, type ListboxProps, type ListboxSectionProps, type Selection } from '@heroui/react'
import React from 'react'
import { Listbox, Tooltip, ListboxItem, ListboxSection } from '@heroui/react'
import { cn } from '@/utils/cn'
import { useRouter } from 'next/router'
import Icon from '@/components/icon'

export enum SidebarItemType {
  Nest = 'nest'
}

export type SidebarItem = {
  key: string
  title: string
  icon?: string
  href?: string
  type?: SidebarItemType.Nest
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  items?: SidebarItem[]
  className?: string
}

export type SidebarProps = Omit<ListboxProps<SidebarItem>, 'children'> & {
  items: SidebarItem[]
  isCompact?: boolean
  hideEndContent?: boolean
  iconClassName?: string
  sectionClasses?: ListboxSectionProps['classNames']
  classNames?: ListboxProps['classNames']
}

const SidebarMenu = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      isCompact,
      hideEndContent,
      sectionClasses: sectionClassesProp = {},
      itemClasses: itemClassesProp = {},
      iconClassName,
      classNames,
      className,
      ...props
    },
    ref
  ) => {
    const router = useRouter()
    const sectionClasses = {
      ...sectionClassesProp,
      base: cn(sectionClassesProp?.base, 'w-full', {
        'p-0 max-w-[44px]': isCompact
      }),
      group: cn(sectionClassesProp?.group, {
        'flex flex-col gap-1': isCompact
      }),
      heading: cn(
        sectionClassesProp?.heading,
        {
          hidden: isCompact
        },
        'text-sm'
      )
    }

    const itemClasses = {
      ...itemClassesProp,
      base: cn(itemClassesProp?.base, {
        'w-11 h-11 gap-0 p-0': isCompact
      })
    }

    const renderNestItem = React.useCallback(
      (item: SidebarItem) => {
        const isNestType = item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest

        if (isNestType) {
          delete item.href
        }

        return (
          <ListboxItem
            {...item}
            key={item.key}
            classNames={{
              base: cn(
                {
                  'h-auto p-0': !isCompact && isNestType
                },
                {
                  'inline-block w-11': isCompact && isNestType
                }
              )
            }}
            endContent={isCompact || isNestType || hideEndContent ? null : item.endContent ?? null}
            startContent={
              isCompact || isNestType ? null : item.icon ? (
                <Icon
                  className={cn('text-default-500 group-data-[selected=true]:text-foreground', iconClassName)}
                  icon={item.icon}
                  width={24}
                />
              ) : (
                item.startContent ?? null
              )
            }
            title={isCompact || isNestType ? null : item.title}>
            {isCompact ? (
              <Tooltip content={item.title} placement='right'>
                <div className='flex w-full items-center justify-center'>
                  {item.icon ? (
                    <Icon
                      className={cn('text-default-500 group-data-[selected=true]:text-foreground', iconClassName)}
                      icon={item.icon}
                      width={24}
                    />
                  ) : (
                    item.startContent ?? null
                  )}
                </div>
              </Tooltip>
            ) : null}
            {!isCompact && isNestType ? (
              <Accordion className={'p-0'}>
                <AccordionItem
                  key={item.key}
                  aria-label={item.title}
                  classNames={{
                    heading: 'pr-3',
                    trigger: 'p-0',
                    content: 'py-0 pl-4'
                  }}
                  title={
                    item.icon ? (
                      <div className={'flex h-11 items-center gap-2 px-2 py-1.5'}>
                        <Icon
                          className={cn('text-default-500 group-data-[selected=true]:text-foreground', iconClassName)}
                          icon={item.icon}
                          width={24}
                        />
                        <span className='text-small font-medium text-default-500 group-data-[selected=true]:text-foreground'>
                          {item.title}
                        </span>
                      </div>
                    ) : (
                      item.startContent ?? null
                    )
                  }>
                  {item.items && item.items?.length > 0 ? (
                    <Listbox
                      className={'mt-0.5'}
                      classNames={{
                        list: cn('border-l border-default-200 pl-4')
                      }}
                      items={item.items}
                      variant='flat'>
                      {item.items.map(renderItem)}
                    </Listbox>
                  ) : (
                    renderItem(item)
                  )}
                </AccordionItem>
              </Accordion>
            ) : null}
          </ListboxItem>
        )
      },
      [isCompact, hideEndContent, iconClassName, items]
    )

    const renderItem = React.useCallback(
      (item: SidebarItem) => {
        const { href, ...restItemProps } = item

        const isNestType = item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest

        if (isNestType) {
          return renderNestItem(item)
        }

        return (
          <ListboxItem
            {...restItemProps}
            key={item.key}
            onPress={() => href && router.push(href)}
            endContent={isCompact || hideEndContent ? null : item.endContent ?? null}
            startContent={
              isCompact ? null : item.icon ? (
                <Icon
                  className={cn('text-default-500 group-data-[selected=true]:text-foreground', iconClassName)}
                  icon={item.icon}
                  width={24}
                />
              ) : (
                item.startContent ?? null
              )
            }
            textValue={item.title}
            title={isCompact ? null : item.title}>
            {isCompact ? (
              <Tooltip content={item.title} placement='right'>
                <div className='flex w-full items-center justify-center'>
                  {item.icon ? (
                    <Icon
                      className={cn('text-default-500 group-data-[selected=true]:text-foreground', iconClassName)}
                      icon={item.icon}
                      width={24}
                    />
                  ) : (
                    item.startContent ?? null
                  )}
                </div>
              </Tooltip>
            ) : null}
          </ListboxItem>
        )
      },
      [isCompact, hideEndContent, iconClassName, itemClasses?.base]
    )

    const handleActivePath = () => {
      const path = router.asPath
      let itemActive: string | undefined = undefined

      items.map(item => {
        if (item.items && item.items.length > 0) {
          item.items.forEach(subItem => {
            if (subItem.href && path.startsWith(subItem.href)) {
              itemActive = subItem.key
            }
          })
        } else {
          if (item.href && path.startsWith(item.href)) {
            itemActive = item.key
          }
        }
      })

      return itemActive
    }

    return (
      <Listbox
        aria-label='sidebar-menu'
        key={isCompact ? 'compact' : 'default'}
        ref={ref}
        hideSelectedIcon
        as='nav'
        className={cn('list-none', className)}
        classNames={{
          ...classNames,
          list: cn('items-center', classNames?.list)
        }}
        color='default'
        itemClasses={{
          ...itemClasses,
          base: cn('px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-200/50', itemClasses?.base),
          title: cn(
            'text-small font-medium text-default-500 group-data-[selected=true]:text-foreground',
            itemClasses?.title
          )
        }}
        items={items}
        selectedKeys={[`${handleActivePath()}`] as unknown as Selection}
        selectionMode='single'
        variant='flat'
        {...props}>
        {item => {
          return item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest ? (
            renderNestItem(item)
          ) : item.items && item.items?.length > 0 ? (
            <ListboxSection
              key={item.key}
              showDivider={isCompact}
              title={item.title}
              classNames={{ ...sectionClasses }}
              className='truncate'>
              {item.items.map(renderItem)}
            </ListboxSection>
          ) : (
            renderItem(item)
          )
        }}
      </Listbox>
    )
  }
)

SidebarMenu.displayName = 'Sidebar'

export default SidebarMenu
