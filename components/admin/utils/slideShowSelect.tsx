"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import TabContentService from "./SlideShowSelectTapContent"
import { ClientWithImages, ProjectWithRelations, ServiceWithImage, TeamMemberWithImage, TestimonialWithImage } from "@/types/schema"
import { useState } from "react"
import { useGetServicesQuery, useLazySearchServicesQuery } from '@/lib/store/api/services-api'
import { TabContentClients, TabContentProject, TabContentService, TabContentTeamMembers, TabContentTestimonial } from "./GenericTapContent"
import { PaginatedResponse } from "@/types/services"
import { useGetProjectsQuery, useLazySearchProjectsQuery } from "@/lib/store/api/projects-api"
import { useGetClientsQuery, useLazySearchClientsQuery } from "@/lib/store/api/client-api"
import { useGetTeamMembersQuery } from "@/lib/store/api/team-api"
import { useGetTestimonialsQuery } from "@/lib/store/api/testimonials-api"

const SlideShowSelect = ({
    setSelectedServices,
    selectedServices,
    selectedProjects,
    setSelectedProjects,
    selectedClients,
    selectedTeam,
    selectedTestimonial,
    setSelectedclients,
    setSelectedTeam,
    setSelectedTestimonial
}: {

    setSelectedServices: React.Dispatch<React.SetStateAction<ServiceWithImage[]>>
    selectedServices: ServiceWithImage[]
    selectedProjects: ProjectWithRelations[]
    setSelectedProjects: React.Dispatch<React.SetStateAction<ProjectWithRelations[]>>,
    setSelectedclients: React.Dispatch<React.SetStateAction<ClientWithImages[]>>
    setSelectedTeam: React.Dispatch<React.SetStateAction<TeamMemberWithImage[]>>
    setSelectedTestimonial: React.Dispatch<React.SetStateAction<TestimonialWithImage[]>>
    selectedClients: ClientWithImages[]
    selectedTeam: TeamMemberWithImage[]
    selectedTestimonial: TestimonialWithImage[]

}) => {
    


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
                            selectedItems={selectedServices}
                            setSelectedItems={setSelectedServices}
                            tabType="service"
                            title="Select Services"
                            placeholder="Search services..."
                            extraInputs={true}

                            useQuery={useGetServicesQuery} // Now using lazy query
                            useLazySearch={useLazySearchServicesQuery}
                            searchParamKey="search"
                            dataExtractor={(data: PaginatedResponse<any>) => data?.data || []}
                            paginationExtractor={(data: PaginatedResponse<any>) => data?.pagination}
                        />
                    </TabsContent>
                    <TabsContent value="PROJECTS">
                        <TabContentProject
                            selectedItems={selectedProjects}
                            setSelectedItems={setSelectedProjects}
                            tabType="project"
                            title="Select projects"
                            placeholder="Search projects..."
                            extraInputs={false}
                            useQuery={useGetProjectsQuery}
                            useLazySearch={useLazySearchProjectsQuery}
                            searchParamKey="q"
                            dataExtractor={(data: PaginatedResponse<any>) => data?.data || []}
                            paginationExtractor={(data: PaginatedResponse<any>) => data?.pagination}
                        />

                    </TabsContent>
                    <TabsContent value="CLIENTS">
                        <TabContentClients
                            selectedItems={selectedClients}
                            setSelectedItems={setSelectedclients}
                            tabType="client"
                            title="Select Services"
                            placeholder="Search services..."
                            extraInputs={false}
                            useQuery={useGetClientsQuery}
                            useLazySearch={useLazySearchClientsQuery}
                            searchParamKey="q"
                            dataExtractor={(data: PaginatedResponse<any>) => data?.data || []}
                            paginationExtractor={(data: PaginatedResponse<any>) => data?.pagination}
                        />
                    </TabsContent>
                    <TabsContent value="TEAM">
                        <TabContentTeamMembers
                            selectedItems={selectedTeam}
                            setSelectedItems={setSelectedTeam}
                            tabType="team"
                            title="Select TEAM"
                            placeholder="Search TEAM..."
                            extraInputs={false}
                            useQuery={useGetTeamMembersQuery}
                            useLazySearch={useLazySearchClientsQuery}
                            searchParamKey="q"
                            dataExtractor={(data: PaginatedResponse<any>) => data?.data || []}
                            paginationExtractor={(data: PaginatedResponse<any>) => data?.pagination}
                        />
                    </TabsContent>
                    <TabsContent value="TESTIMONIALS">

                        <TabContentTestimonial
                            selectedItems={selectedTestimonial}
                            setSelectedItems={setSelectedTestimonial}
                            tabType="testimonial"
                            title="Select testimonial"
                            placeholder="Search testimonial..."
                            extraInputs={false}
                            useQuery={useGetTestimonialsQuery}
                            useLazySearch={useLazySearchProjectsQuery}
                            searchParamKey="q"
                            dataExtractor={(data: PaginatedResponse<any>) => data?.data || []}
                            paginationExtractor={(data: PaginatedResponse<any>) => data?.pagination}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}

export default SlideShowSelect

