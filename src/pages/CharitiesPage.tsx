import React, { useState, useMemo, useEffect } from 'react'
import CharityCard from '../components/CharityCard'
import FilterSidebar from '../components/FilterSidebar'
import Input from '../components/ui/Input'
import Pagination from '../components/Pagination'
import { CHARITIES } from '../constants'
import { Search } from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce'
import EmptyState from '../components/EmptyState'
import { useQuiz } from '../hooks/useQuiz'
import { useCharityMatching } from '../hooks/useCharityMatching'

const ITEMS_PER_PAGE = 9

const CharitiesPage: React.FC = () => {
  const { answers, isQuizComplete } = useQuiz()
  const allCharitiesWithScores = useCharityMatching(CHARITIES, answers)

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [filters, setFilters] = useState({
    category: [] as string[],
    verified: null as boolean | null,
    geography: [] as string[],
  })
  const [currentPage, setCurrentPage] = useState(1)

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page on filter change
  }

  const handleClearFilters = () => {
    setFilters({
      category: [],
      verified: null,
      geography: [],
    })
    setSearchQuery('')
    setCurrentPage(1)
  }

  const filteredCharities = useMemo(() => {
    let filtered = allCharitiesWithScores

    // Apply search filter
    if (debouncedSearchQuery) {
      filtered = filtered.filter((charity) =>
        charity.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        charity.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter((charity) =>
        filters.category.includes(charity.category)
      )
    }

    // Apply verified filter
    if (filters.verified !== null) {
      filtered = filtered.filter((charity) => charity.verified === filters.verified)
    }

    // Apply geography filter
    if (filters.geography.length > 0) {
      filtered = filtered.filter((charity) =>
        filters.geography.includes(charity.geography)
      )
    }

    return filtered
  }, [allCharitiesWithScores, debouncedSearchQuery, filters])

  const totalPages = Math.ceil(filteredCharities.length / ITEMS_PER_PAGE)
  const paginatedCharities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredCharities.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredCharities, currentPage])

  useEffect(() => {
    // Ensure current page is valid if filters reduce total pages
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>
      <div className="lg:col-span-3">
        <div className="flex items-center bg-white rounded-xl shadow-card p-4 mb-8 animate-fadeInUp">
          <Search size={24} className="text-gray-400 mr-3" />
          <Input
            type="text"
            placeholder="Search charities by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow border-none focus:ring-0"
          />
        </div>

        {paginatedCharities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {paginatedCharities.map((charity) => (
              <CharityCard key={charity.id} charity={charity} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Charities Found"
            message="Your search and filter criteria did not match any charities. Try broadening your search or clearing filters."
            actionText="Clear Filters"
            onAction={handleClearFilters}
          />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default CharitiesPage
