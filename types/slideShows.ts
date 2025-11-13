import {
  ClientWithImages,
  ProjectWithRelations,
  ServiceWithImage,
  TestimonialWithImage,
} from "./schema";
import { Image } from "./services";

export type SlideshowType =
  | "TEAM"
  | "HERO"
  | "SERVICES"
  | "PROJECTS"
  | "TESTIMONIALS"
  | "CLIENTS"
  | "CUSTOM";
export type CompositionType =
  | "CUSTOM"
  | "SINGLE"
  | "GRID"
  | "CAROUSEL"
  | "STACKED"
  | "FADE";

export type ServiceSlideShow = {
  id: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  serviceId: string;
  slideShowId: string;
  isVisible: boolean;
  customTitle: string | null;
  customDesc: string | null;
};
export type ClientSlideShow = {
  id: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  slideShowId: string;
  isVisible: boolean;
  clientId: string;
};
export type ProjectSlideShow = {
  id: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  slideShowId: string;
  isVisible: boolean;
  projectId: string;
};

export type TestimonialSlideShow = {
  id: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  slideShowId: string;
  isVisible: boolean;
  testimonialId: string;
};

export type AttachmentTypes =
  | ServiceSlideShow
  | ClientSlideShow
  | ProjectSlideShow
  | TestimonialSlideShow
  | TeamSlideShow;
export type SlideShow = {
  id: string;
  order: number;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  type: SlideshowType;
  title: string;
  composition: CompositionType;
  background: string | null;
  autoPlay: boolean;
  interval: number;
};

export type SlideShowWithRelationsAndSlides = SlideShow & {

  ServiceSlideShows: ServiceSlideShowRelation[];
  ClientSlideShows: ClientSlideShowRelation[];
  ProjectSlideShows: ProjectSlideShowRelation[];
  TestimonialSlideShows: testimonialSlideShowRelation[];
  TeamSlideShows: TeamSlideShowRelation[];
};

export type slideshowsWithRelations=  {
  
  ServiceSlideShows: ServiceSlideShowRelation[];
  ClientSlideShows: ClientSlideShowRelation[];
  ProjectSlideShows: ProjectSlideShowRelation[];
  TestimonialSlideShows: testimonialSlideShowRelation[];
  TeamSlideShows: TeamSlideShowRelation[];
}
export type ServiceSlideShowRelation = ServiceSlideShow & {
  
  service: ServiceWithImage;
};

export type ClientSlideShowRelation = ClientSlideShow & {
  client: ClientWithImages;
};
export type ProjectSlideShowRelation = ProjectSlideShow & {
  project: ProjectWithRelations;
};
export type testimonialSlideShowRelation = TestimonialSlideShow & {
  testimonial: TestimonialWithImage;
};
export type TeamSlideShowRelation = TeamSlideShow & {
  teamMember: ClientWithImages;
};

type TeamSlideShow = {
  id: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  slideShowId: string;
  isVisible: boolean;
  teamId: string;
};

type slideShowWithImage = SlideShow & {
  Image: Image | null;
};
export interface IslideShow extends slideShowWithImage {}
export interface IslideShowRepositoryCreateResponse {
  Image: Image | null;
  slideShow: SlideShow;
}
export interface deattachManyDTO {
  slideShowId: string;
  items: {
    type: "service" | "client" | "project" | "testimonial" | "teamMember";
    id: string;
  }[];
}
export interface deattachDTO {
  slideShowId: string;
  type: "service" | "client" | "project" | "testimonial" | "teamMember";
  id: string;
}

export type AttachmentWithSlideShowRelationsModels =
  | TestimonialSlideShow
  | TeamSlideShow
  | ClientSlideShow
  | ProjectSlideShow
  | ServiceSlideShow;

export interface PaginationDTO {
  skip: number;
  take: number;
}
export interface CreateslideShowDTO {
  title: string;
  slug: string;
  description?: string;
  type: SlideshowType;
  composition: CompositionType;
  background?: string;
  isActive?: boolean;
  autoPlay?: boolean;
  interval?: number;
  order?: number;
}

export interface UpdateslideShowDTO {
  slideShowId: string;
  title?: string;
  slug?: string;
  description?: string;
  type?: SlideshowType;
  composition?: CompositionType;
  background?: string;
  isActive?: boolean;
  autoPlay?: boolean;
  interval?: number;
  order?: number;
}

export interface AttachServiceDTO {
  slideShowId: string;
  serviceId: string;
  order?: number;
  isVisible?: boolean;
  customTitle?: string;
  customDesc?: string;
}

export interface AttachProjectDTO {
  slideShowId: string;
  projectId: string;
  order?: number;
  isVisible?: boolean;
}

export interface AttachClientDTO {
  slideShowId: string;
  clientId: string;
  order?: number;
  isVisible?: boolean;
}

export interface AttachTestimonialDTO {
  slideShowId: string;
  testimonialId: string;
  order?: number;
  isVisible?: boolean;
}

export interface AttachTeamDTO {
  slideShowId: string;
  teamId: string;
  order?: number;
  isVisible?: boolean;
}

export interface BulkAttachDTO {
  slideShowId: string;
  items: Array<{
    type: SlideShow;
    id: string;
    order?: number;
    isVisible?: boolean;
    customTitle?: string;
    customDesc?: string;
  }>;
}

export interface ReorderItemsDTO {
  slideShowId: string;
  items: Array<{
    id: string;
    order: number;
  }>;
}

export interface DetachItemDTO {
  slideShowId: string;
  itemId: string;
  itemType: SlideShow;
}

export interface deattachManyDTO {
  slideShowId: string;
  items: {
    type: "service" | "client" | "project" | "testimonial" | "teamMember";
    id: string;
  }[];
}

export interface AttachMany {
  slideShowId: string;
  items: {
    type: "service" | "project" | "teamMember" | "client" | "testimonial";
    id: string;
    order: number;
    isVisible: boolean;
    customTitle?: string | undefined;
    customDesc?: string | undefined;
  }[];
}
