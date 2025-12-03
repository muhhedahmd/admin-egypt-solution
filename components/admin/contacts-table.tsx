"use client"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  MoreHorizontal, Eye, Mail, Trash2, CheckCircle, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, Filter, X, Loader2
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { useGetContactsQuery, useLazySearchQuery, useLazyFilterQuery } from "@/lib/store/api/contact-api"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useDebounce } from "@uidotdev/usehooks"

type FilterType = "email" | "name" | "phone" | "company" | "subject" | "message" | "category" | "status" | "priority" | "budget" | "timeline" | "dateRange"

export function ContactsTable() {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [isSearching, setIsSearching] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Partial<Record<FilterType, any>>>({})
  const [showFilters, setShowFilters] = useState(false)

  const router = useRouter()

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const { data: contactsData, isLoading } = useGetContactsQuery(
    { skip: currentPage, take: 10 },
    { skip: isSearching || Object.keys(activeFilters).length > 0 }
  )

  const [triggerSearch, { data: searchData, isLoading: isSearchLoading }] = useLazySearchQuery()
  const [triggerFilter, { data: filterData, isLoading: isFilterLoading }] = useLazyFilterQuery()

  // Determine which data to display
  const displayData = isSearching 
    ? searchData 
    : Object.keys(activeFilters).length > 0 
    ? filterData 
    : contactsData

  const contacts = displayData?.data || []
  const pagination = displayData?.pagination
  const totalPages = pagination?.totalPages || 1

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearch.trim()) {
      setIsSearching(true)
      setCurrentPage(0)
      triggerSearch({ query: debouncedSearch, skip: 0, take: 10 })
    } else {
      setIsSearching(false)
    }
  }, [debouncedSearch, triggerSearch])

  // Handle filter application
  const applyFilters = () => {
    const filters: Partial<Record<FilterType, any>> = {}
    
    if (statusFilter && statusFilter !== "all") filters.status = statusFilter
    if (priorityFilter && priorityFilter !== "all") filters.priority = priorityFilter
    if (categoryFilter && categoryFilter !== "all") filters.category = categoryFilter

    setActiveFilters(filters)
    setCurrentPage(0)
    
    if (Object.keys(filters).length > 0) {
      triggerFilter({ filters, skip: 0, take: 10 })
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all")
    setPriorityFilter("all")
    setCategoryFilter("all")
    setActiveFilters({})
    setSearchQuery("")
    setIsSearching(false)
    setCurrentPage(0)
    setShowFilters(false)
  }

  // Remove individual filter
  const removeFilter = (filterType: 'status' | 'priority' | 'category' | 'search') => {
    if (filterType === 'search') {
      setSearchQuery("")
      setIsSearching(false)
    } else if (filterType === 'status') {
      setStatusFilter("all")
      const newFilters = { ...activeFilters }
      delete newFilters.status
      setActiveFilters(newFilters)
    } else if (filterType === 'priority') {
      setPriorityFilter("all")
      const newFilters = { ...activeFilters }
      delete newFilters.priority
      setActiveFilters(newFilters)
    } else if (filterType === 'category') {
      setCategoryFilter("all")
      const newFilters = { ...activeFilters }
      delete newFilters.category
      setActiveFilters(newFilters)
    }
    
    // Re-apply remaining filters
    setTimeout(() => applyFilters(), 0)
  }

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(0)
  const goToLastPage = () => setCurrentPage(totalPages - 1)
  const goToPrevPage = () => setCurrentPage(prev => Math.max(0, prev - 1))
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))
  const goToPage = (page: number) => setCurrentPage(page)

  // Update search/filter when page changes
  useEffect(() => {
    if (isSearching && debouncedSearch) {
      triggerSearch({ query: debouncedSearch, skip: currentPage, take: 10 })
    } else if (Object.keys(activeFilters).length > 0) {
      triggerFilter({ filters: activeFilters, skip: currentPage, take: 10 })
    }
  }, [currentPage])

  const generatePageNumbers = () => {
    const pages = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 0; i < 5; i++) pages.push(i)
        pages.push('ellipsis-end')
        pages.push(totalPages - 1)
      } else if (currentPage >= totalPages - 3) {
        pages.push(0)
        pages.push('ellipsis-start')
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i)
      } else {
        pages.push(0)
        pages.push('ellipsis-start')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('ellipsis-end')
        pages.push(totalPages - 1)
      }
    }

    return pages
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
      case 'high': 
        return 'destructive'
      case 'medium': 
        return 'default'
      case 'low': 
        return 'secondary'
      default: 
        return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved': 
        return 'default'
      case 'pending': 
        return 'secondary'
      case 'in_progress':
      case 'in progress': 
        return 'outline'
      default: 
        return 'outline'
    }
  }

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || isSearching
  const isLoadingAny = isLoading || isSearchLoading || isFilterLoading

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Search and Filter Bar */}
      {!isLoadingAny && (
        <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-top duration-300">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts by name, email, company, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 transition-all"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {isSearchLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto transition-all"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0 h-5 text-xs animate-pulse">
                {Object.keys(activeFilters).length + (isSearching ? 1 : 0)}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="w-full sm:w-auto"
            >
              Clear All
            </Button>
          )}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && !isLoadingAny && (
        <Card className="p-4 animate-in slide-in-from-top duration-300 border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="SUPPORT">Support</SelectItem>
                  <SelectItem value="SALES">Sales</SelectItem>
                  <SelectItem value="FEEDBACK">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => {
              setStatusFilter("all")
              setPriorityFilter("all")
              setCategoryFilter("all")
            }}>
              Reset
            </Button>
            <Button onClick={applyFilters} disabled={isFilterLoading}>
              {isFilterLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && !isLoadingAny && (
        <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
          {isSearching && (
            <Badge 
              variant="secondary" 
              className="px-3 py-1.5 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => removeFilter('search')}
            >
              <Search className="mr-1 h-3 w-3" />
              Search: "{searchQuery}"
              <X className="ml-2 h-3 w-3" />
            </Badge>
          )}
          {statusFilter && statusFilter !== "all" && (
            <Badge 
              variant="secondary" 
              className="px-3 py-1.5 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => removeFilter('status')}
            >
              Status: {statusFilter}
              <X className="ml-2 h-3 w-3" />
            </Badge>
          )}
          {priorityFilter && priorityFilter !== "all" && (
            <Badge 
              variant="secondary" 
              className="px-3 py-1.5 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => removeFilter('priority')}
            >
              Priority: {priorityFilter}
              <X className="ml-2 h-3 w-3" />
            </Badge>
          )}
          {categoryFilter && categoryFilter !== "all" && (
            <Badge 
              variant="secondary" 
              className="px-3 py-1.5 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => removeFilter('category')}
            >
              Category: {categoryFilter}
              <X className="ml-2 h-3 w-3" />
            </Badge>
          )}
        </div>
      )}

      {/* Contacts Table */}
      <Card className="relative overflow-hidden max-h-[600px]">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingAny && (
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index} className="animate-pulse">
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  </TableRow>
                ))
              )}

              {!isLoadingAny && contacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-12 w-12 opacity-20" />
                      <p className="font-medium">
                        {hasActiveFilters ? "No contacts found matching your filters" : "No contacts found"}
                      </p>
                      {hasActiveFilters && (
                        <Button variant="link" onClick={clearFilters}>
                          Clear filters to see all contacts
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoadingAny && contacts.map((contact, index) => (
                <TableRow 
                  key={contact.id} 
                  className={cn(
                    "transition-all hover:bg-muted/50 animate-in fade-in",
                    `duration-${Math.min(300 + index * 50, 800)}`
                  )}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{contact.name}</span>
                      <span className="text-sm text-muted-foreground">{contact.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{contact.subject}</TableCell>
                  <TableCell>
                    <div className="max-w-md truncate">{contact.message}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(contact.priority)} className="transition-all">
                      {contact.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(contact.status)} className="transition-all">
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(contact.status)} className="transition-all">
                      {contact.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => router.push(`/admin/contacts/${contact.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/contacts/${contact.id}/reply`)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      {pagination && totalPages > 1 && !isLoadingAny && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 animate-in fade-in duration-300">
          <div className="text-sm text-muted-foreground">
            Showing page {currentPage + 1} of {totalPages} ({pagination.totalItems || 0} total items)
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToFirstPage}
              disabled={currentPage === 0}
              className="transition-all"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className="transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {generatePageNumbers().map((page, index) => {
                if (typeof page === 'string') {
                  return (
                    <Button
                      key={`${page}-${index}`}
                      variant="ghost"
                      size="icon"
                      disabled
                    >
                      ...
                    </Button>
                  )
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => goToPage(page)}
                    className="transition-all"
                  >
                    {page + 1}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className="transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={goToLastPage}
              disabled={currentPage === totalPages - 1}
              className="transition-all"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}