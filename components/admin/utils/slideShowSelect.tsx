"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import TabContentService from "./SlideShowSelectTapContent"
import {
    ClientWithImages,
    ProjectWithRelations,
    ServiceWithImage,
    TeamMemberWithImage,
    TestimonialWithImage,
} from "@/types/schema";
import { useState } from "react";
import {
    useGetServicesQuery,
    useLazySearchServicesQuery,
} from "@/lib/store/api/services-api";
import {
    TabContentClients,
    TabContentProject,
    TabContentService,
    TabContentTeamMembers,
    TabContentTestimonial,
} from "./GenericTapContent";
import { PaginatedResponse } from "@/types/services";
import {
    useGetProjectsQuery,
    useLazySearchProjectsQuery,
} from "@/lib/store/api/projects-api";
import {
    useGetClientsQuery,
    useLazySearchClientsQuery,
} from "@/lib/store/api/client-api";
import { useGetTeamMembersQuery, useLazySearchTeamMembersQuery, useSearchTeamMembersQuery } from "@/lib/store/api/team-api";
import { useGetTestimonialsQuery, useLazySearchTestimonialsQuery, useSearchTestimonialsQuery } from "@/lib/store/api/testimonials-api";

const SlideShowSelect = ({
    type,
    disabledItems,
    setSelectedServices,
    selectedServices,
    selectedProjects,
    setSelectedProjects,
    selectedClients,
    selectedTeam,
    selectedTestimonial,
    setSelectedclients,
    setSelectedTeam,
    setSelectedTestimonial,
}: {
    type: string;
    disabledItems?: {
        id: string;
        type: string;
    }[];
    setSelectedServices: React.Dispatch<React.SetStateAction<ServiceWithImage[]>>;
    selectedServices: ServiceWithImage[];
    selectedProjects: ProjectWithRelations[];
    setSelectedProjects: React.Dispatch<
        React.SetStateAction<ProjectWithRelations[]>
    >;
    setSelectedclients: React.Dispatch<React.SetStateAction<ClientWithImages[]>>;
    setSelectedTeam: React.Dispatch<React.SetStateAction<TeamMemberWithImage[]>>;
    setSelectedTestimonial: React.Dispatch<
        React.SetStateAction<TestimonialWithImage[]>
    >;
    selectedClients: ClientWithImages[];
    selectedTeam: TeamMemberWithImage[];
    selectedTestimonial: TestimonialWithImage[];
}) => {
    const disabledItemsPerType = disabledItems?.reduce(
        (acc, item) => {
            if (item.type === "service") {
                acc.services.push(item.id);
            } else if (item.type === "project") {
                acc.projects.push(item.id);
            } else if (item.type === "client") {
                acc.clients.push(item.id);
            } else if (item.type === "team") {
                acc.team.push(item.id);
            } else if (item.type === "testimonial") {
                acc.testimonials.push(item.id);
            }
            return acc;
        },
        {
            services: [] as string[],
            projects: [] as string[],
            clients: [] as string[],
            team: [] as string[],
            testimonials: [] as string[],
        },
    );

    // if (type === "SERVICES") {
    //     return (
    //         <div className="w-full">
    //             <Tabs defaultValue="SERVICES" className="w-full">
    //                 <TabsList className="grid grid-cols-1 w-full">
    //                     <TabsTrigger value="SERVICES"> Select services</TabsTrigger>
    //                 </TabsList>
    //                 <TabsContent value="SERVICES">
    //                     <TabContentService
    //                         disabledItems={disabledItemsPerType?.services}
    //                         selectedItems={selectedServices}
    //                         setSelectedItems={setSelectedServices}
    //                         tabType="service"
    //                         title="Select Services"
    //                         placeholder="Search services..."
    //                         extraInputs={true}
    //                         useQuery={useGetServicesQuery} // Now using lazy query
    //                         useLazySearch={useLazySearchServicesQuery}
    //                         searchParamKey="search"
    //                         dataExtractor={(data: PaginatedResponse<any>) => data?.data || []}
    //                         paginationExtractor={(data: PaginatedResponse<any>) =>
    //                             data?.pagination
    //                         }
    //                     />
    //                 </TabsContent>
    //             </Tabs>
    //         </div>
    //     );
    // }
    // if (type === "PROJECTS") {
    //     return (
    //         <div className="w-full">
    //             <Tabs defaultValue="PROJECTS" className="w-full">
    //                 <TabsList className="grid grid-cols-1 w-full">
    //                     <TabsTrigger value="PROJECTS"> Select projects</TabsTrigger>
    //                 </TabsList>
    //                 <TabsContent value="PROJECTS">
    //                     <TabContentProject
    //                         disabledItems={disabledItemsPerType?.projects}
    //                         selectedItems={selectedProjects}
    //                         setSelectedItems={setSelectedProjects}
    //                         tabType="project"
    //                         title="Select projects"
    //                         placeholder="Search projects..."
    //                         extraInputs={false}
    //                         useQuery={useGetProjectsQuery}
    //                         useLazySearch={useLazySearchProjectsQuery}
    //                         searchParamKey="q"
    //                         dataExtractor={(data: PaginatedResponse<any>) => data?.data || []}
    //                         paginationExtractor={(data: PaginatedResponse<any>) =>
    //                             data?.pagination

    //                         }
    //                     />
    //                 </TabsContent>
    //             </Tabs>
    //         </div>
    //     );
    // }
    // if (type === "CLIENTS") {
    //     return (
    //         <div className="w-full">
    //             <Tabs defaultValue="CLIENTS" className="w-full">
    //                 <TabsList className="grid grid-cols-1 w-full">
    //                     <TabsTrigger value="CLIENTS">clients</TabsTrigger>
    //                 </TabsList>
    //                 <TabsContent value="CLIENTS">
    //                     <TabContentClients
    //                         disabledItems={disabledItemsPerType?.clients}
    //                         selectedItems={selectedClients}
    //                         setSelectedItems={setSelectedclients}
    //                         tabType="client"
    //                         title="Select Services"
    //                         placeholder="Search services..."
    //                         extraInputs={false}
    //                         useQuery={useGetClientsQuery}
    //                         useLazySearch={useLazySearchClientsQuery}
    //                         searchParamKey="q"
    //                         dataExtractor={(data: PaginatedResponse<any>) => data?.data || []}
    //                         paginationExtractor={(data: PaginatedResponse<any>) =>
    //                             data?.pagination
    //                         }
    //                     />
    //                 </TabsContent>
    //             </Tabs>
    //         </div>
    //     );
    // }
    // if (type === "TEAM") {
    //     return (
    //         <div className="w-full">
    //             <Tabs defaultValue="TEAM" className="w-full">
    //                 <TabsList className="grid grid-cols-1 w-full">
    //                     <TabsTrigger value="TEAM"> Select team members</TabsTrigger>
    //                 </TabsList>
    //                 <TabsContent value="TEAM">
    //                     <TabContentTeamMembers
    //                         disabledItems={disabledItemsPerType?.team}
    //                         selectedItems={selectedTeam}
    //                         setSelectedItems={setSelectedTeam}
    //                         tabType="team"
    //                         title="Select TEAM"
    //                         placeholder="Search TEAM..."
    //                         extraInputs={false}
    //                         useQuery={useGetTeamMembersQuery}
    //                         useLazySearch={useLazySearchClientsQuery}
    //                         searchParamKey="q"
    //                         dataExtractor={(data: PaginatedResponse<any>) => data?.data || []}
    //                         paginationExtractor={(data: PaginatedResponse<any>) =>
    //                             data?.pagination
    //                         }
    //                     />
    //                 </TabsContent>
    //             </Tabs>
    //         </div>
    //     );
    // }

    return (
        <>
            <div className="w-full">

                <Tabs defaultValue="SERVICES" value={type} className="w-full">
                    <TabsList  className="grid grid-cols-5 w-full">
                        <TabsTrigger disabled={type !== "SERVICES"} value="SERVICES">service</TabsTrigger>
                        <TabsTrigger disabled={type !== "CLIENTS"} value="CLIENTS">clients</TabsTrigger>
                        <TabsTrigger disabled={type !== "TESTIMONIALS"} value="TESTIMONIALS">testimonial</TabsTrigger>
                        <TabsTrigger disabled={type !== "PROJECTS"} value="PROJECTS"> projects</TabsTrigger>
                        <TabsTrigger disabled={type !== "TEAM"} value="TEAM"> TEAM</TabsTrigger>
                    </TabsList>
                    <TabsContent value="SERVICES">
                        <TabContentService
                            disabledItems={disabledItemsPerType?.services}
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
                            paginationExtractor={(data: PaginatedResponse<any>) =>
                                data?.pagination
                            }
                        />
                    </TabsContent>
                    <TabsContent value="PROJECTS">
                        <TabContentProject
                            disabledItems={disabledItemsPerType?.projects}
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
                            paginationExtractor={(data: PaginatedResponse<any>) =>
                                data?.pagination
                            }
                        />
                    </TabsContent>
                    <TabsContent value="CLIENTS">
                        <TabContentClients
                            disabledItems={disabledItemsPerType?.clients}
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
                            paginationExtractor={(data: PaginatedResponse<any>) =>
                                data?.pagination
                            }
                        />
                    </TabsContent>
                    <TabsContent value="TEAM">
                        <TabContentTeamMembers
                            disabledItems={disabledItemsPerType?.team}
                            selectedItems={selectedTeam}
                            setSelectedItems={setSelectedTeam}
                            tabType="team"
                            title="Select TEAM"
                            placeholder="Search TEAM..."
                            extraInputs={false}
                            useQuery={useGetTeamMembersQuery}
                            useLazySearch={useLazySearchTeamMembersQuery}
                            searchParamKey="q"
                            dataExtractor={(data: PaginatedResponse<any>) => data?.data || []}
                            paginationExtractor={(data: PaginatedResponse<any>) =>
                                data?.pagination
                            }
                        />
                    </TabsContent>
                    <TabsContent value="TESTIMONIALS">
                        <TabContentTestimonial
                            disabledItems={disabledItemsPerType?.testimonials}
                            selectedItems={selectedTestimonial}
                            setSelectedItems={setSelectedTestimonial}
                            tabType="testimonial"
                            title="Select testimonial"
                            placeholder="Search testimonial..."
                            extraInputs={false}
                            useQuery={useGetTestimonialsQuery}
                            useLazySearch={useLazySearchTestimonialsQuery}
                            searchParamKey="q"
                            dataExtractor={(data: PaginatedResponse<any>) => data?.data || []}
                            paginationExtractor={(data: PaginatedResponse<any>) =>
                                data?.pagination
                            }
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default SlideShowSelect;
