import clsx from 'clsx'
import { type ComponentType, useMemo, useState } from 'react'
import { Link as RRLink, useLocation } from 'react-router-dom'

import type * as Config from '../../config.js'
import { useConfig } from '../hooks/useConfig.js'
import { usePageData } from '../hooks/usePageData.js'
import { Icon } from './Icon.js'
import { Link } from './Link.js'
import { Logo } from './Logo.js'
import * as styles from './MobileTopNav.css.js'
import { Outline } from './Outline.js'
import { Popover } from './Popover.js'
import { Sidebar } from './Sidebar.js'
import { ChevronDown } from './icons/ChevronDown.js'
import { ChevronRight } from './icons/ChevronRight.js'
import { ChevronUp } from './icons/ChevronUp.js'
import { Discord } from './icons/Discord.js'
import { GitHub } from './icons/GitHub.js'
import { Menu } from './icons/Menu.js'
import { X } from './icons/X.js'

MobileTopNav.Curtain = Curtain

export function MobileTopNav() {
  const config = useConfig()

  const { pathname } = useLocation()
  const activeItem = config?.topNav
    ?.filter((item) => pathname.replace(/\.html$/, '').startsWith(item.link))
    .slice(-1)[0]

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <div className={styles.logo}>
          <RRLink to="/" style={{ alignItems: 'center', display: 'flex', height: '100%' }}>
            <Logo />
          </RRLink>
        </div>
      </div>
      <div className={styles.section}>
        {config.topNav && (
          <>
            <div className={clsx(styles.group)}>
              <div className={clsx(styles.navigation)}>
                <Navigation activeItem={activeItem} items={config.topNav} />
              </div>
              {activeItem && (
                <div className={clsx(styles.navigation, styles.navigation_compact)}>
                  <CompactNavigation activeItem={activeItem} items={config.topNav} />
                </div>
              )}
              <div className={styles.divider} />
            </div>
          </>
        )}
        <div className={styles.group}>
          {config.socials?.map((social, i) => (
            <SocialButton key={i} {...social} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Navigation({
  activeItem,
  items,
}: { activeItem?: Config.TopNavItem; items: Config.TopNavItem[] }) {
  return items.map((item) => (
    <Link
      key={item.link!}
      data-active={item.link === activeItem?.link}
      className={clsx(styles.navigationItem)}
      href={item.link!}
      variant="styleless"
    >
      {item.title}
    </Link>
  ))
}

function CompactNavigation({
  activeItem,
  items,
}: { activeItem: Config.TopNavItem; items: Config.TopNavItem[] }) {
  const [showPopover, setShowPopover] = useState(false)

  return (
    <Popover.Root modal open={showPopover} onOpenChange={setShowPopover}>
      <Popover.Trigger className={clsx(styles.menuTrigger, styles.navigationItem)}>
        {activeItem.title}
        <Icon label="Menu" icon={ChevronDown} size="11px" />
      </Popover.Trigger>
      <Popover className={styles.topNavPopover}>
        {items.map((item) => (
          <Link
            key={item.link!}
            data-active={item.link === activeItem?.link}
            className={clsx(styles.navigationItem)}
            href={item.link!}
            onClick={() => setShowPopover(false)}
            variant="styleless"
          >
            {item.title}
          </Link>
        ))}
      </Popover>
    </Popover.Root>
  )
}

const iconsForIcon = {
  discord: Discord,
  github: GitHub,
  x: X,
} satisfies Record<Config.ParsedSocialItem['type'], ComponentType>

const sizesForTypes = {
  discord: '21px',
  github: '18px',
  x: '16px',
} satisfies Record<Config.ParsedSocialItem['type'], string>

function SocialButton({ icon, label, link, type }: Config.ParsedSocialItem) {
  return (
    <a className={styles.button} href={link} target="_blank" rel="noopener noreferrer">
      <Icon
        className={styles.icon}
        label={label}
        icon={iconsForIcon[icon]}
        size={sizesForTypes[type] || '18px'}
      />
    </a>
  )
}

export function Curtain({
  enableScrollToTop,
}: {
  enableScrollToTop?: boolean
}) {
  const config = useConfig()
  const { frontmatter = {} } = usePageData()
  const { pathname } = useLocation()

  const [isOutlineOpen, setOutlineOpen] = useState(false)
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const sidebarItemTitle = useMemo(() => {
    if (!config.sidebar || frontmatter.layout === 'blog') return
    const sidebarItem = getSidebarItemFromPathname({
      sidebar: config.sidebar,
      pathname,
    })
    return sidebarItem?.title
  }, [config, frontmatter, pathname])

  const contentTitle = useMemo(() => {
    if (typeof window === 'undefined') return
    return document.querySelector('.vocs_Content h1')?.textContent
  }, [])

  const title = sidebarItemTitle || frontmatter.title || contentTitle

  return (
    <div className={styles.curtain}>
      <div className={styles.curtainGroup}>
        <div className={styles.curtainItem}>
          {frontmatter.layout === 'blog' ? (
            title
          ) : (
            <Popover.Root modal open={isSidebarOpen} onOpenChange={setSidebarOpen}>
              <Popover.Trigger className={styles.menuTrigger}>
                <Icon label="Menu" icon={Menu} size="13px" />
                {title}
              </Popover.Trigger>
              <Popover className={styles.sidebarPopover}>
                <Sidebar onClickItem={() => setSidebarOpen(false)} />
              </Popover>
            </Popover.Root>
          )}
        </div>
      </div>
      <div className={styles.curtainGroup}>
        {enableScrollToTop && (
          <>
            <div className={styles.curtainItem}>
              <button
                className={styles.outlineTrigger}
                onClick={() => window.scrollTo({ behavior: 'smooth', top: 0 })}
                type="button"
              >
                Top
                <Icon label="Scroll to top" icon={ChevronUp} size="10px" />
              </button>
            </div>
            <div className={styles.separator} />
          </>
        )}
        {frontmatter.layout !== 'blog' && (
          <div className={styles.curtainItem}>
            <Popover.Root modal open={isOutlineOpen} onOpenChange={setOutlineOpen}>
              <Popover.Trigger className={styles.outlineTrigger}>
                On this page
                <Icon label="On this page" icon={ChevronRight} size="10px" />
              </Popover.Trigger>
              <Popover className={styles.outlinePopover}>
                <Outline onClickItem={() => setOutlineOpen(false)} showTitle={false} />
              </Popover>
            </Popover.Root>
          </div>
        )}
      </div>
    </div>
  )
}

function getSidebarItemFromPathname({
  sidebar,
  pathname: pathname_,
}: { sidebar: Config.Sidebar; pathname: string }): Config.SidebarItem {
  const pathname = pathname_.replace(/(.+)\/$/, '$1')
  return sidebar.find((item) => {
    if (item.link === pathname) return true
    if (item.children) return getSidebarItemFromPathname({ sidebar, pathname })
    return false
  }) as Config.SidebarItem
}
