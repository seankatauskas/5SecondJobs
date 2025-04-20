export type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export type NormalizedFilters = {
  search: string
  location: string[]
  experience: string[]
}

export type Filters = {
  search?: string
  location?: string[]
  experience?: string[]
}

export type PageType = 'search' | 'reviewed' | 'completed'

export type PageParam = string | number

export type QueryKey = [string, PageType, NormalizedFilters]

export type CardData = {
    id: string
    url: string | undefined
    categories: string | string[] | null
    industries: string | string[] | null
    requirements: string | string[] | null
    skills: string | string[] | null
    responsibilities: string | string[] | null
    company_id: string
    min_salary: number
    max_salary: number
    functions: string | string[] | null
    updated_at: string | number
    last_applied: string | number
    updated_date: number
    locations: string | string[] | null
    [key: string]: string | boolean | number | string[] | null | undefined
}

