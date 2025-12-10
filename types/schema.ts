// ============================================================================
// ENUMS
// ============================================================================

  import { ServiceType } from "./services";

export enum UserRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum ImageType {
  PROFILE = "PROFILE",
  SERVICE = "SERVICE",
  PROJECT = "PROJECT",
  SLIDESHOW = "SLIDESHOW",
  CLIENT = "CLIENT",
  BLOG = "BLOG",
  TEAM = "TEAM",
  HERO = "HERO",
}

export enum SlideshowType {
  SERVICES = "SERVICES",
  PROJECTS = "PROJECTS",
  TESTIMONIALS = "TESTIMONIALS",
  TEAM = "TEAM",
  CLIENTS = "CLIENTS",
  HERO = "HERO",
  CUSTOM = "CUSTOM",
}
export const SLIDESHOW_TYPES_ARRAY = Object.values(SlideshowType);

export enum CompositionType {
  SINGLE = "SINGLE",
  GRID = "GRID",
  CAROUSEL = "CAROUSEL",
  STACKED = "STACKED",
  FADE = "FADE",
  CUSTOM = "CUSTOM",
  ZOOM = "ZOOM",
  PARALLAX = "PARALLAX",
  COVERFLOW = "COVERFLOW",
  KEN_BURNS = "KEN_BURNS",
  FLIP = "FLIP",
  CUBE_ROTATION = "CUBE",
  AUTO_GRID = "AUTO_GRID",
  STORY = "STORY",
  FILMSTRIP = "FILMSTRIP",
  LIGHTBOX = "LIGHTBOX",
  MARQUEE = "MARQUEE",
}

export const COMPOSITION_TYPES_ARRAY = Object.values(CompositionType);
export enum ProjectStatus {
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
}

export enum ContactStatus {
  NEW = "NEW",
  READ = "READ",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}
export enum ContactCategory {
  GENERAL = "GENERAL",
  SUPPORT = "SUPPORT",
  SALES = "SALES",
  FEEDBACK = "FEEDBACK",
  PARTNERSHIP = "PARTNERSHIP",
  COMPLAINT = "COMPLAINT",
  SERVICE_INQUIRY = "SERVICE_INQUIRY",
  OTHER = "OTHER",
}

export enum ContactPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

// ============================================================================
// USER MANAGEMENT TYPES
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  gender: Gender;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  is2FA: boolean;
  isVerifiedForEachDevice: boolean;
  emailConfirmed: boolean;
  googleId?: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  userAgent?: string;
  ipAddress?: string;
  refreshToken?: string;
  refreshTokenExpiresAt: Date;
  isActive: boolean;
  deviceVerification: boolean;
  twoFactorVerification: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  phone?: string;
  dateOfBirth?: Date;
  bio?: string;
  avatarId?: string;
  createdAt: Date;
  updatedAt: Date;
  isProfileComplete: boolean;
}

// ============================================================================
// COMPANY INFO TYPES
// ============================================================================

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
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SERVICE TYPES
// ============================================================================

export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  richDescription?: string;
  icon?: string;
  imageId?: string;
  price?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceDTO {
  name: string;
  slug: string;
  description?: string;
  richDescription?: string;
  icon?: string;
  imageId?: string;
  price?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
}

export interface UpdateServiceDTO extends Partial<CreateServiceDTO> {}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  richDescription?: string;
  clientName?: string;
  clientCompany?: string;
  projectUrl?: string;
  githubUrl?: string;
  status: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  imageId?: string;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDTO {
  title: string;
  slug: string;
  description?: string;
  richDescription?: string;
  clientName?: string;
  clientCompany?: string;
  projectUrl?: string;
  githubUrl?: string;
  status?: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  imageId?: string;
  isFeatured?: boolean;
  order?: number;
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {}

// ============================================================================
// TECHNOLOGY TYPES
// ============================================================================

export interface Technology {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTechnologyDTO {
  name: string;
  slug: string;
  icon?: string;
  category?: string;
}

export interface UpdateTechnologyDTO extends Partial<CreateTechnologyDTO> {}

export interface ProjectTechnology {
  projectId: string;
  technologyId: string;
}

// ============================================================================
// TEAM TYPES
// ============================================================================

export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  position: string;
  bio?: string;
  email?: string;
  phone?: string;
  imageId?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeamMemberDTO {
  name: string;
  slug: string;
  position: string;
  bio?: string;
  email?: string;
  phone?: string;
  imageId?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
}

export interface UpdateTeamMemberDTO extends Partial<CreateTeamMemberDTO> {}

// ============================================================================
// CLIENT TYPES
// ============================================================================

export interface Client {
  id: string;
  name: string;
  slug: string;
  description?: string;
  richDescription?: string;
  website?: string;
  industry?: string;
  imageId?: string;
  logoId?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientDTO {
  name: string;
  slug: string;
  description?: string;
  richDescription?: string;
  website?: string;
  industry?: string;
  imageId?: string;
  logoId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
}

export interface UpdateClientDTO extends Partial<CreateClientDTO> {}

// ============================================================================
// TESTIMONIAL TYPES
// ============================================================================

export interface Testimonial {
  id: string;
  clientName: string;
  clientPosition?: string;
  clientCompany?: string;
  content: string;
  rating: number;
  avatarId?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTestimonialDTO {
  clientName: string;
  clientPosition?: string;
  clientCompany?: string;
  content: string;
  rating?: number;
  avatarId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
}

export interface UpdateTestimonialDTO extends Partial<CreateTestimonialDTO> {}

// ============================================================================
// BLOG TYPES
// ============================================================================

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageId?: string;
  authorId: string;
  status: BlogStatus;
  publishedAt?: Date;
  isFeatured: boolean;
  views: number;
  readingTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlogDTO {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageId?: string;
  authorId: string;
  status?: BlogStatus;
  publishedAt?: Date;
  isFeatured?: boolean;
  readingTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface UpdateBlogDTO extends Partial<CreateBlogDTO> {}

// ============================================================================
// CATEGORY TYPES
// ============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDTO {
  name: string;
  slug: string;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

export interface BlogCategory {
  blogId: string;
  categoryId: string;
}

// ============================================================================
// SLIDESHOW TYPES
// ============================================================================

export interface SlideShow {
  id: string;
  title: string;
  slug: string;
  description?: string;
  type: SlideshowType;
  composition: CompositionType;
  background?: string;
  isActive: boolean;
  autoPlay: boolean;
  interval: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSlideShowDTO {

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

export interface CreateAndAttachMany {
    type: "SERVICES" | "PROJECTS" | "TESTIMONIALS" | "TEAM" | "CLIENTS" | "HERO" | "CUSTOM";
    title: string;
    composition: "CUSTOM" | "SINGLE" | "GRID" | "CAROUSEL" | "STACKED" | "FADE";
    isActive: boolean;
    autoPlay: boolean;
    interval: number;
    order: number;
    slides: {
       id : string;
        order: number;
        attachType: "service" | "client" | "project" | "testimonial" | "teamMember";
        attachId: string;
        isVisible: boolean;
        customTitle?: string | undefined;
        customDesc?: string | undefined;
    }[];
    description?: string | undefined;
    background?: string | undefined;
}
export interface UpdateSlideShowDTO extends Partial<CreateSlideShowDTO> {}

export interface ServiceSlideShow {
  id: string;
  serviceId: string;
  slideShowId: string;
  order: number;
  isVisible: boolean;
  customTitle?: string;
  customDesc?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSlideShow {
  id: string;
  projectId: string;
  slideShowId: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientSlideShow {
  id: string;
  clientId: string;
  slideShowId: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialSlideShow {
  id: string;
  testimonialId: string;
  slideShowId: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamSlideShow {
  id: string;
  teamId: string;
  slideShowId: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CONTACT TYPES
// ============================================================================

export type Contact = {
    email: string;
    name: string;
    phone: string | null;
    company: string | null;
    subject: string;
    message: string;
    category: ContactCategory;
    status: ContactStatus;
    priority: ContactPriority;
    budget: string | null;
    timeline: string | null;
    id: string;
    serviceId: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    source: string | null;
    referrer: string | null;
    respondedAt: Date | null;
    respondedBy: string | null;
    notes: string | null;
    response: string | null;
    resolved: boolean;
    readAt: Date | null;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateContactDTO {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UpdateContactDTO extends Partial<CreateContactDTO> {
  status?: ContactStatus;
  respondedAt?: Date;
  notes?: string;
}

// ============================================================================
// IMAGE/MEDIA TYPES
// ============================================================================

export interface Image {
  id: string;
  filename: string;
  url: string;
  alt?: string;
  size?: number;
  width?: number;
  height?: number;
  blurHash?: string;
  fileHash: string;
  key: string;
  imageType: ImageType;
  type: string;
  customId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateImageDTO {
  filename: string;
  url: string;
  alt?: string;
  size?: number;
  width?: number;
  height?: number;
  blurHash?: string;
  fileHash: string;
  key: string;
  imageType: ImageType;
  type: string;
  customId?: string;
}

export interface UpdateImageDTO extends Partial<CreateImageDTO> {}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface Analytics {
  id: string;
  date: Date;
  visitors: number;
  pageViews: number;
  contacts: number;
  createdAt: Date;
}

export interface PageView {
  id: string;
  path: string;
  referrer?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// ============================================================================
// COMMON UTILITY TYPES
// ============================================================================

export interface PaginationParams {
  skip: number;
  take: number;
}



export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FilterParams {
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  status?: string;
  type?: string;
  skip: number;
  take: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ============================================================================
// COMBINED TYPES FOR RESPONSES
// ============================================================================

export type  ServiceWithImage =   ServiceType &  {
  image?: Image;
  type?: "service";
  _order?: number;
  customTitle?: string;
  customDesc?: string;
  isVisible?: boolean;
}

export interface ProjectWithRelations  {
  project : Project;
  image?: Image;
  technologies?: Technology[];
  type?: "project";
  _order?: number;
  customTitle?: string;
  customDesc?: string;
  isVisible?: boolean;
}
export interface ProjectWithRelationsSlide  extends  Project   {
  image?: Image;
  technologies?: Technology[];
  type?: "project";
  _order?: number;
  customTitle?: string;
  customDesc?: string;
  isVisible?: boolean;
}
export interface ClientWithRelationsSlide  extends  Client   {
  image?: Image;
  logo?: Image;
  type?: "client";
  _order?: number;
  customTitle?: string;
  customDesc?: string;
  isVisible?: boolean;
}
export interface TestimonialWithImageSlide  extends  Testimonial   {
  image?: Image;
  type?: "testimonial";
  _order?: number;
  customTitle?: string;
  customDesc?: string;
  isVisible?: boolean;
}
export interface TeamMemberWithImageSlide  extends  TeamMember   {
  image?: Image;
  type?: "team";
  _order?: number;
  customTitle?: string;
  customDesc?: string;
  isVisible?: boolean;
}

export interface BlogWithRelations extends Blog {
  image?: Image;
  author?: User;
  categories?: Category[];
}

export interface ClientWithImages   {
  client: Client
  image?: Image;
  logo?: Image;
  type?: "client";
  _order?: number;
  customTitle?: string;
  customDesc?: string;
  isVisible?: boolean;
}

export interface TeamMemberWithImage extends TeamMember {
  
  image: Image | null;
  type?: "teamMember";
  _order?: number;
  customTitle?: string;
  customDesc?: string;
  isVisible?: boolean;
}

export interface TestimonialWithImage extends Testimonial {
  avatar?: Image;
  type?: "testimonial";
  _order?: number;
  customTitle?: string;
  customDesc?: string;
  isVisible?: boolean;
}

export interface SlideShowWithRelations extends SlideShow {
  services?: ServiceSlideShow[];
  projects?: ProjectSlideShow[];
  clients?: ClientSlideShow[];
  testimonials?: TestimonialSlideShow[];
  team?: TeamSlideShow[];
}

export type slide =
  | ServiceWithImage
  | ClientWithRelationsSlide
  | ProjectWithRelationsSlide
  | TestimonialWithImageSlide
  | TeamMemberWithImageSlide;


  // addtional

  export type HeroVariant = "CENTERED" | "SPLIT" | "IMAGE_BACKGROUND" | "MINIMAL" | "VIDEO_BACKGROUND" | "FULL_SCREEN"
export type ButtonVariant = "PRIMARY" | "SECONDARY" | "GHOST" | "OUTLINE" | "DANGER"
export type TextAlign = "LEFT" | "CENTER" | "RIGHT"

export interface HeroData {
  id: string
  name: string
  title: string
  subtitle?: string
  description?: string
  backgroundImageId?: string
  backgroundColor?: string
  backgroundVideo?: string
  overlayColor?: string
  overlayOpacity?: number
  ctaText?: string
  ctaUrl?: string
  ctaVariant?: ButtonVariant
  secondaryCtaText?: string
  secondaryCtaUrl?: string
  secondaryCtaVariant?: ButtonVariant
  alignment?: TextAlign
  variant?: HeroVariant
  minHeight?: number
  titleSize?: string
  titleColor?: string
  subtitleColor?: string
  descriptionColor?: string
  showScrollIndicator?: boolean
  customCSS?: string
  styleOverrides?: Record<string, any>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HeroPreviewProps {
  hero: HeroData
  onEdit: (hero: HeroData) => void
  onDelete: (id: string) => void
  onDuplicate: (hero: HeroData) => void
}


export interface IHero {
  id: string;
  name: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  backgroundImageId?: string | null;
  backgroundColor?: string | null;
  backgroundVideo?: string | null;
  overlayColor?: string | null;
  overlayOpacity?: number | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  ctaVariant?: ButtonVariant | null;
  secondaryCtaText?: string | null;
  secondaryCtaUrl?: string | null;
  secondaryCtaVariant?: ButtonVariant | null;
  alignment?: TextAlign | null;
  variant: HeroVariant;
  minHeight?: number | null;
  titleSize?: string | null;
  titleColor?: string | null;
  subtitleColor?: string | null;
  descriptionColor?: string | null;
  showScrollIndicator: boolean;
  customCSS?: string | null;
  styleOverrides?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}