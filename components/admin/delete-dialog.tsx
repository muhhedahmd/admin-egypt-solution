"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteProjectMutation } from "@/lib/store/api/projects-api"
import { useDeleteServiceMutation } from "@/lib/store/api/services-api"
import { Loader2 } from "lucide-react"
import { MouseEvent, useEffect } from "react"

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: string | null
  title: string
  description: string,
  skip: number,
  take: number

}

export function DeleteDialog({
  skip,
  take
  , id, open, onOpenChange, title, description }: DeleteDialogProps) {


  const [deleteService, { isLoading, isError, isSuccess }] = useDeleteServiceMutation()
  const onConfirm = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault()
      e.stopPropagation()

      if (id) {

        const del = await deleteService({
          id,
          skip,
          take,
        })
        if (del.data) onOpenChange(false)

      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {
        isError ?
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">
                {title || "Something went wrong"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {description || "An unexpected error occurred. Please try again."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer bg-gray-50 hover:bg-gray-100">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isLoading}
                onClick={onConfirm}
                className="cursor-pointer bg-red-500 hover:bg-red-400 text-destructive-foreground"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

          : <AlertDialogContent className="bg-white">

            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer bg-gray-50 hover:bg-gray-100">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isLoading}
                onClick={onConfirm}
                className=" cursor-pointer bg-red-500 hover:bg-red-400  text-destructive-foreground "
              >
                {
                  isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Delete"

                }
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
      }
    </AlertDialog>
  )
}
