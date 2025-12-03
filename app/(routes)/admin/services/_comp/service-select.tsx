s
import { useGetServicesQuery } from '@/lib/store/api/services-api'
import React from 'react'

const ServiceSelect = () => {
    const { data: services, isLoading, isError } = useGetServicesQuery({ skip: 0, take: 100 })
    
  return (
    <div className='w-full '>
        hello

    </div>
  )
}

export default ServiceSelect