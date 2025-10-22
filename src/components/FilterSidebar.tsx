import React from 'react'
import { Filter, CheckCircle, MapPin, Tag } from 'lucide-react'
import Button from './ui/Button'

interface FilterSidebarProps {
  filters: {
    category: string[]
    verified: boolean | null
    geography: string[]
  }
  onFilterChange: (key: string, value: any) => void
  onClearFilters: () => void
}

const categories = ['Environment', 'Health', 'Education', 'Poverty', 'Animals', 'Arts']
const geographies = ['local', 'national', 'international']

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, onClearFilters }) => {
  const handleCheckboxChange = (key: string, value: string) => {
    const currentValues = filters[key as 'category' | 'geography'] as string[]
    if (currentValues.includes(value)) {
      onFilterChange(key, currentValues.filter((v) => v !== value))
    } else {
      onFilterChange(key, [...currentValues, value])
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-card sticky top-28 animate-slideInLeft">
      <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <Filter size={24} className="mr-3 text-blue-600" /> Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-gray-500 hover:text-red-500">
          Clear All
        </Button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Tag size={18} className="mr-2 text-purple-500" /> Category
        </h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
                checked={filters.category.includes(cat)}
                onChange={() => handleCheckboxChange('category', cat)}
              />
              <span className="ml-3 text-base">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Geography Filter */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <MapPin size={18} className="mr-2 text-green-500" /> Geography
        </h4>
        <div className="space-y-2">
          {geographies.map((geo) => (
            <label key={geo} className="flex items-center text-gray-700 cursor-pointer capitalize">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
                checked={filters.geography.includes(geo)}
                onChange={() => handleCheckboxChange('geography', geo)}
              />
              <span className="ml-3 text-base">{geo}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Verification Filter */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <CheckCircle size={18} className="mr-2 text-yellow-500" /> Verification
        </h4>
        <div className="space-y-2">
          <label className="flex items-center text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="verified"
              className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
              checked={filters.verified === true}
              onChange={() => onFilterChange('verified', true)}
            />
            <span className="ml-3 text-base">Verified Only</span>
          </label>
          <label className="flex items-center text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="verified"
              className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
              checked={filters.verified === false}
              onChange={() => onFilterChange('verified', false)}
            />
            <span className="ml-3 text-base">Unverified Only</span>
          </label>
          <label className="flex items-center text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="verified"
              className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
              checked={filters.verified === null}
              onChange={() => onFilterChange('verified', null)}
            />
            <span className="ml-3 text-base">All</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar
