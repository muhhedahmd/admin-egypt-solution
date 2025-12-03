"use client"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDebounce } from "@/lib/store/hooks"
import { ServiceWithImage } from "@/types/schema"
import { useLazySearchServicesQuery } from "@/lib/store/api/services-api"
import BlurredImage from "@/app/_comp/BlurredHashImage"

interface ItemConfig<T> {
  getId: (item: T) => string
  getTitle: (item: T) => string
  getDescription?: (item: T) => string
  getImageUrl?: (item: T) => string | undefined
  getImageAlt?: (item: T) => string
  getBlurHash?: (item: T) => string
}

interface AutocompleteSelectProps<T> {
  value?: string | null
  onSelect: (id: string | null) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  config: ItemConfig<T>
  useLazySearch: any
  dataExtractor: (data: any) => T[]
  disabled?: boolean
  className?: string
}

export function AutocompleteSelect<T>({
  value,
  onSelect,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  emptyText = "No items found.",
  config,
  useLazySearch,
  dataExtractor,
  disabled = false,
  className,
}: AutocompleteSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 300)
  
  const [searchTrigger, { data: searchResults, isLoading }] = useLazySearch()
  const [items, setItems] = useState<T[]>([])
  const [selectedItem, setSelectedItem] = useState<T | null>(null)

  useEffect(() => {
    if (debouncedSearch.trim() !== "") {
      searchTrigger({ q: debouncedSearch, skip: 0, take: 20 })
    }
  }, [debouncedSearch, searchTrigger])

  useEffect(() => {
    if (searchResults) {
      const extracted = dataExtractor(searchResults)
      setItems(extracted)
      
      if (value && !selectedItem) {
        const found = extracted.find((item) => config.getId(item) === value)
        if (found) setSelectedItem(found)
      }
    }
  }, [searchResults, dataExtractor, value, selectedItem, config])

  const handleSelect = (itemId: string) => {
    const item = items.find((i) => config.getId(i) === itemId)
    
    if (value === itemId) {
      onSelect(null)
      setSelectedItem(null)
    } else {
      onSelect(itemId)
      setSelectedItem(item || null)
    }
    
    setOpen(false)
    setSearchQuery("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(null)
    setSelectedItem(null)
    setSearchQuery("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {selectedItem && config.getImageUrl ? (
              <div className="flex-shrink-0">
                <BlurredImage
                  imageUrl={config.getImageUrl(selectedItem) || "/placeholder.svg"}
                  alt={config.getImageAlt?.(selectedItem) || ""}
                  className="w-5 h-5 rounded-full object-cover"
                  blurhash={config.getBlurHash?.(selectedItem) || ""}
                  width={20}
                  height={20}
                  quality={30}
                />
              </div>
            ) : null}
            <span className="truncate">
              {selectedItem ? config.getTitle(selectedItem) : placeholder}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {value && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Searching..." : emptyText}
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const itemId = config.getId(item)
                const isSelected = value === itemId

                return (
                  <CommandItem
                    key={itemId}
                    value={itemId}
                    onSelect={() => handleSelect(itemId)}
                    className="flex items-start gap-2 cursor-pointer"
                  >
                    {config.getImageUrl && (
                      <div className="flex-shrink-0 mt-0.5">
                        <BlurredImage
                          imageUrl={config.getImageUrl(item) || "/placeholder.svg"}
                          alt={config.getImageAlt?.(item) || ""}
                          className="w-8 h-8 rounded object-cover"
                          blurhash={config.getBlurHash?.(item) || ""}
                          width={32}
                          height={32}
                          quality={40}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{config.getTitle(item)}</p>
                      {config.getDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {config.getDescription(item)}
                        </p>
                      )}
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Service-specific configuration
const serviceConfig: ItemConfig<ServiceWithImage> = {
  getId: (item) => item.id,
  getTitle: (item) => item.name,
  getDescription: (item) => item?.description || "",
  getImageUrl: (item) => item?.image?.url,
  getImageAlt: (item) => item?.image?.alt || `${item.name}-alt`,
  getBlurHash: (item) => item.image?.blurHash || "",
}

// Pre-configured Service Autocomplete
interface ServiceAutocompleteProps {
  value?: string | null
  onSelect: (id: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ServiceAutocomplete({
  value,
  onSelect,
  placeholder = "Select a service...",
  disabled,
  className,
}: ServiceAutocompleteProps) {
  return (
    <AutocompleteSelect<ServiceWithImage>
      value={value}
      onSelect={onSelect}
      placeholder={placeholder}
      searchPlaceholder="Search services..."
      emptyText="No services found."
      config={serviceConfig}
      useLazySearch={useLazySearchServicesQuery}
      dataExtractor={(data) => data?.data || []}
      disabled={disabled}
      className={className}
    />
  )
}
