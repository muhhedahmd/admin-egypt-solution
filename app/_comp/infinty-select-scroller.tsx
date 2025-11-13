

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Check, ChevronDown, Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDebounce } from "@/lib/store/hooks"
import { useIntersectionObserver } from "@uidotdev/usehooks"

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    remainingItems: number
    nowCount: number
    pageSize: number
  }
}

interface InfiniteScrollSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  searchPlaceholder?: string
  fetchData: (params: { q: string; skip: number; take: number }) => Promise<PaginatedResponse<any[] | any>>
  pageSize?: number
  renderItem?: (item: any) => React.ReactNode
  getItemLabel?: (item: any) => string
  getItemValue?: (item: any) => string
}

export function InfiniteScrollSelect({
  value,
  onValueChange,
  placeholder = "Select...",
  disabled = false,
  searchPlaceholder = "Search...",
  fetchData,
  pageSize = 20,
  renderItem,
  getItemLabel = (item) => item.name,
  getItemValue = (item) => item.id,
}: InfiniteScrollSelectProps) {

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const observerTarget = useRef<HTMLDivElement>(null)
  
  const debouncedSearch = useDebounce(search, 300)
  const [ 
    ref , 
    isIntercecting
  ] = useIntersectionObserver( {
    scrollMargin: "0px",
    rootMargin: "0px",
    threshold : .1
  })

  // Load data
  const loadData = useCallback(
    async (currentPage: number, searchQuery: string, reset = false) => {
      if (loading) return
      
      setLoading(true)
      try {
        const result = await fetchData({
          q: searchQuery,
          skip: currentPage * pageSize,
          take: pageSize,
        })

       
        setItems((prev) => (reset ? result.data : [...prev, ...result.data]))
        setTotal(result.pagination.totalItems)
        setHasMore(result.data.length === pageSize && (currentPage + 1) * pageSize < result.pagination.totalItems)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    },
    [fetchData, pageSize, loading]
  )

  // Reset and load on search change
  useEffect(() => {
    setPage(0)
    setItems([])
    setHasMore(true)
    loadData(0, debouncedSearch, true)
  }, [debouncedSearch])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1
          setPage(nextPage)
          loadData(nextPage, debouncedSearch, false)
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, page, debouncedSearch, loadData])

  // Get selected item label
  const selectedItem = items.find((item) => getItemValue(item) === value)
  const selectedLabel = selectedItem ? getItemLabel(selectedItem) : placeholder

  // Handle select
  const handleSelect = (item: any) => {
    onValueChange(getItemValue(item))
    setOpen(false)
    setSearch("")
  }

  // Reset on close
  const handleOpenChange = (newOpen: boolean) => {
    if (!disabled) {
      setOpen(newOpen)
      if (!newOpen) {
        setSearch("")
        setPage(0)
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground"
          )}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Items List */}
          <div
            ref={scrollRef}
            className="max-h-[300px] overflow-y-auto p-1"
          >
            {items.length === 0 && !loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No items found.
              </div>
            ) : (
              <>
                {items.map((item , idx) => {
                  const itemValue = getItemValue(item)
                  const isSelected = value === itemValue


                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelect(item)}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent"
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {renderItem ? (
                        renderItem(item)
                      ) : (
                        <span>{getItemLabel(item)}</span>
                      )}
                    </div>
                  )
                })}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}

                {/* Intersection observer target */}
                {hasMore && !loading && (
                  <div ref={observerTarget} className="h-4" />
                )}

                {/* End of list indicator */}
                {!hasMore && items.length > 0 && (
                  <div className="py-2 text-center text-xs text-muted-foreground">
                    Loaded all {total} items
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

