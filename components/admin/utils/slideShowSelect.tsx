"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TabContentService from "./SlideShowSelectTapContent"
import { ProjectWithRelations, ServiceWithImage } from "@/types/schema"
import TabContentProject from "./slideShowSelectProjectContent"


const SlideShowSelect = ({
    setSelectedServices,
    selectedServices,
    selectedProjects, 
    setSelectedProjects, 
}: {

    setSelectedServices: React.Dispatch<React.SetStateAction<ServiceWithImage[]>>
    selectedServices: ServiceWithImage[]
        selectedProjects : ProjectWithRelations[] 
    setSelectedProjects  : React.Dispatch<React.SetStateAction<ProjectWithRelations[]>>
}) => {

    // const [selectedTeam, setSelectedTeam] = useState<SelectedService[]>([])
    // const [selectedTestimonial, setSelectedTestimonial] = useState<SelectedService[]>([])
    // const [selectedClients, setSelectedclients] = useState<SelectedService[]>([])


    return (
        <>
            <div className="w-full">
                <Tabs defaultValue="SERVICES" className="w-full">
                    <TabsList className="grid grid-cols-5 w-full">
                        <TabsTrigger value="SERVICES">service</TabsTrigger>
                        <TabsTrigger value="CLIENTS">clients</TabsTrigger>
                        <TabsTrigger value="TESTIMONIALS">testimonial</TabsTrigger>
                        <TabsTrigger value="PROJECTS"> projects</TabsTrigger>
                        <TabsTrigger value="TEAM"> TEAM</TabsTrigger>
                    </TabsList>
                    <TabsContent value="SERVICES">
                        <TabContentService

                            tabType={"service"}
                            title={"Services"}
                            placeholder={"Search Services..."}

                            setSelectedServices={setSelectedServices}
                            selectedServices={selectedServices}
                        />
                    </TabsContent>
                    <TabsContent value="PROJECTS">
                        <TabContentProject

                            tabType={"project"}
                            title={"project"}
                            placeholder={"Search Services..."}

                            setSelectedServices={setSelectedProjects}
                            selectedServices={selectedProjects}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}

export default SlideShowSelect

