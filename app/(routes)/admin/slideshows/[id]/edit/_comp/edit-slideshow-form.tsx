import React from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import { CompositionType, SLIDESHOW_TYPES_ARRAY, SlideshowType } from '@/types/schema'
import { SlideShow } from '@/types/slideShows'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useUpdateSlideShowMutation } from '@/lib/store/api/slideShow-api'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'



// --- validation schema ---
const schema = z.object({
  id: z.string().cuid(),
  order: z.number().int(),
  slug: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  type: z.nativeEnum(SlideshowType),
  title: z.string().min(1),
  composition: z.nativeEnum(CompositionType),
  background: z.string().nullable(),
  autoPlay: z.boolean(),
  interval: z.number().int().nonnegative(),
})

type FormValues = z.infer<typeof schema>

export default function EditSlideShowForm({ SlideShow }: { SlideShow: SlideShow }) {
  const [update, { isLoading, error }] = useUpdateSlideShowMutation()

  const defaultValues: Partial<FormValues> = {
    id: SlideShow?.id,
    order: SlideShow?.order ?? 0,
    slug: SlideShow?.slug ?? '',
    description: SlideShow?.description ?? null,
    isActive: SlideShow?.isActive ?? true,
    createdAt: SlideShow?.createdAt ? new Date(SlideShow.createdAt) : new Date(),
    updatedAt: SlideShow?.updatedAt ? new Date(SlideShow.updatedAt) : new Date(),
    type: SlideShow?.type as SlideshowType,
    title: SlideShow?.title ?? '',
    composition: SlideShow?.composition as CompositionType,
    background: SlideShow?.background ?? null,
    autoPlay: SlideShow?.autoPlay ?? false,
    interval: SlideShow?.interval ?? 3000,
  }

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormValues,

  })
  const router = useRouter()
  const autoPlay = watch('autoPlay')

  const onSubmit: SubmitHandler<FormValues> =  async (data) => {
    try {

      // Replace with your save/update logic
      console.log('submit payload', data)

      const formData = new FormData()
      const keys = Object.keys(data) as (keyof typeof data)[]
      keys.forEach((key, index) => {
        formData.append(key, data[key] as string)
      })

      const res = await update({
        id: SlideShow.id!,
        body: formData
      }).unwrap()

      if (res.data) {
        toast.success("Slideshow updated successfully")

      }
    } catch (error) {
      toast.error("Failed to update slideshow. Please try again.")

    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-full space-y-6">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basic Settings</h2>

            <div className="space-y-2">
              <Label htmlFor="title">Slideshow Title</Label>
              <Input id="title" {...register('title')} placeholder="e.g., Homepage Hero" disabled={isSubmitting} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Slideshow Description</Label>
              <Textarea id="description" rows={2} {...register('description')} placeholder="e.g., Homepage Hero" disabled={isSubmitting} />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={String(field.value)} disabled={isSubmitting}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SLIDESHOW_TYPES_ARRAY.map((t) => (
                          <SelectItem key={t} value={String(t)}>
                            {t.toLocaleLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && <p className="text-red-500 text-sm">{(errors.type as any)?.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <Select onValueChange={(v) => field.onChange(v === 'true')} value={String(field.value)} disabled={isSubmitting}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">

            <h2 className="text-lg font-semibold flex items-center gap-2">Autoplay Settings</h2>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Controller
                  control={control}
                  name="autoPlay"
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={isSubmitting}
                      className="w-4 h-4"
                    />
                  )}
                />
                <span className="text-sm">Enable Autoplay</span>
              </label>
            </div>

            {autoPlay && (
              <div className="space-y-2">
                <Label htmlFor="interval">Autoplay Interval (ms)</Label>
                <Input id="interval" type="number" {...register('interval', { valueAsNumber: true })} min={1000} step={500} disabled={isSubmitting} />
                <p className="text-xs text-muted-foreground">{(Number(watch('interval')) / 1000).toFixed(1)} seconds between slides</p>
              </div>
            )}
              <div className="space-y-2 shadow-xs p-4  flex  items-center justify-center gap-3 rounded-md w-fit">
                <p >display order  </p>
                <Badge className="text-xs ">{SlideShow.order}</Badge>
              </div>
          </div>

          <div className=" w-full flex gap-3 border-t pt-6">
            <div className='w-full flex items-end justify-end gap-3 '>

            <Button type="submit" className="" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Slideshow'}
            </Button>

            <Button  type="button" variant="destructive" className="" disabled={isSubmitting}>
              delete slideshow
            </Button>
            <Button type="button" variant="outline" className="" onClick={() => { router.push("edit/slides") }} disabled={isSubmitting}>
              Edit Slide
            </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Configuration Panel */}

    </form>
  )
}
