import React from 'react'
import EditSlideshowPage from './EditSlideshowPage'

const page = async ( { 
  params
} : {
  params: { id: string }
} ) => {
  return (
    <EditSlideshowPage params={await params}/>
  )
}

export default page