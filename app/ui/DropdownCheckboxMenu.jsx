import { useState, useEffect, useRef } from "react"
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function DropdownCheckboxMenu({
  label,
  options = [],
  name,
  value = [],
  onChange
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleChange = (e) => {
    const changedValue = e.target.value
    const newSelectedValues = e.target.checked
      ? [...value, changedValue]
      : value.filter((val) => val !== changedValue)
    
    onChange(newSelectedValues)
  }

  const clearSelections = (e) => {
    e.stopPropagation()
    setIsOpen(false)
    onChange([])
  }

  const hasSelections = value.length > 0

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      <div
        className={`inline-flex items-center overflow-hidden border-2 ${
          hasSelections ? 'border-gray-500 text-gray-700 bg-gray-200' : 'text-gray-500 border-gray-300 bg-white'
        } shadow-sm transition-colors`}
      >
        <button
          type="button"
          className="pl-3 pr-2 flex items-center"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="text-sm font-semibold">{label}</span>
          {hasSelections ? (
            <span className="font-semibold ml-1 text-sm">({value.length})</span>
          ) : (
            <ChevronDownIcon className="ml-2 size-4" />
          )}
        </button>
        {hasSelections && (
          <div className="pr-2">
            <XMarkIcon
              className="size-4 text-gray-700 hover:text-black cursor-pointer"
              onClick={clearSelections}
            />
          </div>
        )}
      </div>
      
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1 z-10 w-56 border-2 border-gray-300 bg-white shadow-md"
        >
          {options.map((option, idx) => (
            <label
              key={idx}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
            >
              <input
                type="checkbox"
                name={name}
                value={option.value}
                checked={value.includes(option.value)}
                onChange={handleChange}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
