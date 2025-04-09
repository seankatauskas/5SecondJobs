export default function normalizeFilters(filters) {
  return {
    search: filters.search || '',
    location: Array.isArray(filters.location) 
      ? filters.location 
      : filters.location ? [filters.location] : [],
    experience: Array.isArray(filters.experience) 
      ? filters.experience 
      : filters.experience ? [filters.experience] : []
  };
}

export function configureFilters(searchParams) {
    const filters = {}
    for (const [key, value] of searchParams.entries()) {
        if (key === 'search') {
            filters[key] = value
        } 
        else if (key !== 'cursor') {
            if (value !== "") {
                filters[key] = value.split(",")
            } else {
                filters[key] = []
            }
        }
    }
    return filters
}

