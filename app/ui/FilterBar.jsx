import { useState, useEffect } from 'react'
import DropdownCheckboxMenu from './DropdownCheckboxMenu'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { fetchApplicationsCount } from '@/app/lib/fetchApplications'

export default function FilterUI({ initialCount, initialFilters, onFilterChange, pageType }) {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    location: initialFilters.location || [],
    experience: initialFilters.experience || [],
  })

  const [count, setCount] = useState(initialCount)

  useEffect(() => {
        const getCount = async () => {
            const count = await fetchApplicationsCount(filters, pageType)
            setCount(count)
        }
        getCount()
  }, [filters])

  const updateFilters = (newFilters) => {
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSearchChange = (e) => {
    updateFilters({
      ...filters,
      search: e.target.value
    })
  }

  const handleLocationChange = (locations) => {
    updateFilters({
      ...filters,
      location: locations
    })
  }

  const handleExperienceChange = (experiences) => {
    updateFilters({
      ...filters,
      experience: experiences
    })
  }

  const handleClearFilters = () => {
    updateFilters({
      search: '',
      location: [],
      experience: []
    })
  }

  const locationOptions = [
    { value: 'ny', label: 'New York' },
    { value: 'sf', label: 'San Francisco' },
    { value: 'la', label: 'Los Angeles' },
    { value: 'chicago', label: 'Chicago' },
  ]

  const experienceOptions = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'junior', label: 'Junior' },
    { value: 'mid', label: 'Mid Level' },
  ]

  return (
    <div className="flex mb-4 gap-2">
      <div className="relative w-2/5">
        <input
          placeholder="Search for roles"
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-4 pr-8 border-2 border-gray-300 focus:outline-gray-700 focus:outline-[1px] focus:outline w-full"
        />
        <MagnifyingGlassIcon className="absolute text-gray-400 size-5 right-2 top-1/2 transform -translate-y-1/2" />
      </div>      
      <div className="flex items-center border-2 border-gray-300 px-2 font-semibold text-sm text-gray-500">
        {count}
      </div>
      <DropdownCheckboxMenu
        label="Location"
        name="location"
        options={locationOptions}
        value={filters.location}
        onChange={handleLocationChange}
      />
      <DropdownCheckboxMenu
        label="Experience"
        name="experience"
        options={experienceOptions}
        value={filters.experience}
        onChange={handleExperienceChange}
      />
      <button
        onClick={handleClearFilters}
        className="ml-auto border-2 border-gray-300 px-2 font-semibold text-sm text-gray-500 hover:text-gray-700 hover:border-gray-500 transition-colors"
      >
        Clear
      </button>
    </div>
  )
}
