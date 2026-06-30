/** Default number of items per page for paginated lists. */
export const DEFAULT_PAGE_SIZE = 10

/** Available page size options. */
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const

/** Application name shown in the UI. */
export const APP_NAME = 'Simple Book Manager'

/** Navigation links used in the layout. */
export const NAV_LINKS = [
  { label: 'Dashboard', to: '/' },
  { label: 'Books', to: '/books' },
] as const
