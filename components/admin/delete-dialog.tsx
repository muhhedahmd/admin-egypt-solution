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
import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string,

  onConfirm?: () => Promise<void> ,
  isLoading: boolean,
  isError: boolean

}

export function DeleteDialog({

  onConfirm,
  isError,
  isLoading,
  open, onOpenChange,
  title,
  description }: DeleteDialogProps) {




  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {
        isError ?
          <AlertDialogContent className="">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">
                {title || "Something went wrong"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {description || "An unexpected error occurred. Please try again."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer ">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isLoading}
                onClick={() => onConfirm?.() || onOpenChange(false)}
                className="cursor-pointer bg-red-500 hover:bg-red-400 text-white"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

          : <AlertDialogContent className="">

            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer ">Cancel</AlertDialogCancel>
              <Button
                disabled={isLoading}
                onClick={() => onConfirm?.()}
                variant={"destructive"}
                className="cursor-pointer "
              >
                {
                  isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Delete"
                }
              </Button>
              {/* <AlertDialogAction
                disabled={isLoading}
                onClick={onConfirm}
                className=" cursor-pointer bg-red-500 hover:bg-red-400 text-white"
              >
                {
                  isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Delete"

                }
              </AlertDialogAction> */}
            </AlertDialogFooter>
          </AlertDialogContent>
      }
    </AlertDialog>
  )
}
