export type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export type NormalizedFilters = {
  search: string;
  location: string[];
  experience: string[];
}

export type PageType = 'search' | 'reviewed' | 'completed'

