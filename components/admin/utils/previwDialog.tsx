import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { slide } from "@/types/schema"
import { CompositionType } from "@/types/slideShows"
import { Eye } from "lucide-react"
import { CompositionPreview } from "./slides/compositionPreviw"

export const PreviwDialog = ({
    allSlides,
    selectedComposition,
    minmalBtb
}: {
    minmalBtb?: boolean
    selectedComposition: CompositionType
    allSlides: slide[]
}) => {


    return (
        <>

            <Dialog >

                <DialogTrigger asChild className="w-1/2">

                    {minmalBtb ?

                        <button className="w-fit p-1 cursor-pointer border-2 hover:text-secondary  text-center flex items-center justify-center shadow-md flex items-center justify-center duration-300 group  rounded-md hover:bg-primary">
                            
                            <Eye className=" group-hover:text-primary-foreground text-muted-foreground h-4 w-4 mr-2" />
                                preview
                            

                        </button>

                        : <button className="w-full  border-2 border-muted-foreground text-muted-foreground h-24 shadow-md flex items-center justify-center duration-300 group  rounded-md hover:bg-primary">
                            <Eye className=" group-hover:text-primary-foreground text-muted-foreground h-8 w-8 mr-2" />
                            <span className=" group-hover:text-primary-foreground text-muted-foreground ">
                                preview
                                {allSlides.length ? (
                                    <span className="text-destructive font-semibold">
                                        {` (${allSlides.length > 9 ? "9+" : allSlides.length})`}
                                    </span>
                                ) : null}
                            </span>

                        </button>
                    }
                </DialogTrigger>
                <DialogContent className="min-w-[95vw] flex flex-col  gap-12 h-[90vh] ">

                    <DialogHeader className="px-6 py-4 border-b h-fit">
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Eye className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <span className="block">Preview Slides</span>
                                <span className="text-sm font-normal text-muted-foreground">
                                    {allSlides.length} {allSlides.length === 1 ? 'slide' : 'slides'} • {selectedComposition}
                                </span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-auto cursor-default w-full  flex align-top items-start justify-start">

                        <div className="w-5xl mx-auto">


                            <CompositionPreview

                                composition={
                                    selectedComposition as
                                    | "CAROUSEL"
                                    | "GRID"
                                    | "STACKED"
                                    | "FADE"
                                    | "SINGLE"
                                }
                                slides={allSlides}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}