export type ServiceType = {
  name: string;
  id: string;
  slug: string;
  description: string | null;
  richDescription: string | null;
  icon: string | null;
  imageId: string | null;
  price: string | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

enum imageType {
  PROFILE,
  SERVICE,
  PROJECT,
  SLIDESHOW,
  CLIENT,
  BLOG,
  TEAM,
  HERO,
  TESTIMONIAL,
}
export type Image = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  filename: string;
  url: string;
  alt: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  blurHash: string | null;
  fileHash: string;
  key: string;
  imageType: imageType;
  type: string;
  customId: string | null;
};
// export type serviceWithImage = ServiceType & {
//   image: Image | null;
//   type ?: "SERVICES"
//   _order ?: number
// }
// export interface IService extends serviceWithImage {
//   // pagination: {
//   //   totalItems: number;
//   //   totalPages: number;
//   //   currentPage: number;
//   //   pageSize: number;
//   // };
// }
export interface IServiceRepositoryCreateResponse {
  Image: Image | null;
  service: ServiceType;
}

export interface CreateServiceDTO {
  
  name: string;
  description: string;
  richDescription: string;
  image?: Buffer;
  icon?: string;
  price?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
}

export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  richDescription?: string;
  image?: Buffer;
}

export interface PaginationParams {
  skip?: number;
  take?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    remainingItems: number;
    nowCount: number;
    pageSize: number;
  };
  message?: string;
}

export interface pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    remainingItems: number;
    nowCount: number;
    pageSize: number;

}
export interface updateService
  extends Partial<
    CreateServiceDTO & {
      imageState: "KEEP" | "REMOVE" | "UPDATE";
      // imageId?: string;
      image?: Buffer;
      serviceId: string;
      slug?: string;
      icon?: string;
      price?: string;
      isActive?: boolean;
      isFeatured?: boolean;
      order?: number;
    }
  > {}

export interface successResponse<T> {
  data: T;
  message: string;
}
