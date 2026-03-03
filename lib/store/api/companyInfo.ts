import { successResponse } from "@/types/services";
import { baseApi } from "./base-api";

export interface CompanyTranslation {
  name: string;
  tagline?: string;
  description?: string;
  footerText?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  lang: "EN" | "AR";
}

export interface CompanyInfo {
  id: string;
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
  logoId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyInfoWithTranslation {
  company: CompanyInfo;
  logo?: {
    id: string;
    url: string;
    filename: string;
    alt?: string;
  } | null;
  translation: CompanyTranslation[];
}

export interface Achievement {
  stats: { label: string; value: number }[];
}

export const companyInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get company info
    getCompanyInfo: builder.query<
      successResponse<CompanyInfoWithTranslation>,
      void
    >({
      query: () => "/company-info",
      providesTags: ["CompanyInfo"],
    }),

    getAchievements: builder.query<successResponse<Achievement>, void>({
      query: () => "/company-info/achievements",
      providesTags: ["CompanyInfo"],
    }),

    // Create company info
    createCompanyInfo: builder.mutation<
      successResponse<{
        Logo: {
          id: string;
          url: string;
          filename: string;
          alt?: string;
        } | null;
        translation: CompanyTranslation[];
        company: CompanyInfo;
      }>,
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
      successResponse<{
        Logo: {
          id: string;
          url: string;
          filename: string;
          alt?: string;
        } | null;
        translation: CompanyTranslation;
        company: CompanyInfo;
      }>,
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
  useGetAchievementsQuery,
} = companyInfoApi;