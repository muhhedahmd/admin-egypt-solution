

import { successResponse } from "@/types/services";
import { baseApi } from "./base-api";

export interface CompanyInfo {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
  youtube?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  logoId?: string;
  logo?: {
    id: string;
    url: string;
    filename: string;
    alt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Achivement { 
  stats : {label : string , value : number}[]

}

export const companyInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get company info
    getCompanyInfo: builder.query<successResponse<CompanyInfo>, void>({
      query: () => "/company-info",
      providesTags: ["CompanyInfo"],
    }),

    getAchivements: builder.query<successResponse<Achivement>, void>({
      query: () => "/company-info/achivements",
    }),
    // Create company info
    createCompanyInfo: builder.mutation<
      successResponse<CompanyInfo>,
      FormData
    >({
      query: (formData) => ({
        url: "/company-info",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CompanyInfo"],
    }),

    // Update company info
    updateCompanyInfo: builder.mutation<
      successResponse<CompanyInfo>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/company-info/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["CompanyInfo"],
    }),



  }),
});

export const {
  useGetCompanyInfoQuery,
  useCreateCompanyInfoMutation,
  useUpdateCompanyInfoMutation,
  useGetAchivementsQuery
} = companyInfoApi;
