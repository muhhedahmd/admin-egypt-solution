import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';

export interface Media {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  quality?: number;
}

export interface BaseSlide {
  id?: string;
  type: "service" | "client" | "project" | "testimonial" | "teamMember" | string;
  name?: string;
}

export interface ServiceData extends BaseSlide {
  type: "service";
  name: string;
  description?: string;
  image?: Media;
  tag?: "existing" | "new" | string;
}

export interface ClientData extends BaseSlide {
  type: "client";
  name: string;
  logo?: Media;
  industry?: string;
}

export interface ProjectData extends BaseSlide {
  type: "project";
  title: string;
  clientName?: string;
  image?: Media;
}

export interface TestimonialData extends BaseSlide {
  type: "testimonial";
  clientName?: string;
  content: string;
  rating?: number;
  avatar?: Media;
}

export interface TeamMemberData extends BaseSlide {
  type: "team";
  name: string;
  position?: string;
  image?: Media;
}

/* Union of all possible slide payloads */
export type slideArrangeMinmal = ServiceData | ClientData | ProjectData | TestimonialData | TeamMemberData;

/* ---------------------------
   Component Prop Types
   --------------------------- */
interface CardProps<T> {
  data: T;
  index: number;
}


// Minimal Square Service Card
const ServiceSquareCard = ({ data, index }: { data: ServiceData; index: number }) => (
  <div className=" border-1 border-muted relative aspect-square w-full bg-gradient-to-br rounded-lg border-2 border-border overflow-hidden group hover:border-primary/50 transition-all">
    <div className="absolute top-2 left-[75%] z-10 w-7 h-7 bg-primary text-primary-foreground rounded-full font-bold text-xs flex items-center justify-center shadow-md">
      {index + 1}
    </div>
    
    <div className="absolute inset-0 p-3 flex flex-col">
      {data.image && (
        <div className="w-full h-16 rounded-md overflow-hidden bg-muted mb-2 flex-shrink-0">
          <Image
            src={data.image.url || ""}
            alt={data.image.alt || data.name}
            className="w-full h-full object-cover"
            height={50 }
            width={50 }
            quality={10}
          />
        </div>
      )}
      
      <div className="flex-1 min-h-0 flex flex-col justify-center">
        <h3 className="text-xs font-bold text-foreground line-clamp-2 mb-1">{data.name}</h3>
        {data.description && (
          <p className="text-[10px] text-muted-foreground line-clamp-2">{data.description}</p>
        )}
      </div>

      {data?.tag === "existing" && (
        <Badge variant="outline" className="text-[9px] py-0 h-4 absolute bottom-2 left-[75%]">Existing</Badge>
      )}
    </div>
    
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <GripVertical className="w-4 h-4 text-muted-foreground" />
    </div>
  </div>
);

// Minimal Square Client Card
const ClientSquareCard = ({ data, index }: { data: any; index: number }) => (
  <div className="relative aspect-square w-full bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg border-2 border-border overflow-hidden group hover:border-primary/50 transition-all">
    <div className="absolute top-2 left-[75%] z-10 w-7 h-7 bg-primary text-primary-foreground rounded-full font-bold text-xs flex items-center justify-center shadow-md">
      {index + 1}
    </div>
    
    <div className="absolute inset-0 p-3 flex flex-col items-center justify-center">
      {data.logo && (
        <div className="w-full h-[5rem] flex items-center justify-center mb-2 bg-white/50 dark:bg-black/20 rounded-md p-2">
          <Image
            src={data.image.url}
            alt={data.image.alt || data.name}
            className="max-h-full max-w-full w-[10rem] h-[10rem] object-contain"
            height={20 }
            width={20 }
            sizes='sm'
            quality={10}
          />
        </div>
      )}
      
      <h3 className="text-xs font-bold text-foreground line-clamp-2 text-center mb-1">{data.name}</h3>
      {data.industry && (
        <Badge variant="secondary" className="text-[9px] py-0 h-4">{data.industry}</Badge>
      )}
    </div>
    
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <GripVertical className="w-4 h-4 text-muted-foreground" />
    </div>
  </div>
);

// Minimal Square Project Card
const ProjectSquareCard = ({ data, index }: { data: ProjectData; index: number }) => (
  <div className="relative aspect-square w-full bg-card rounded-lg border-2 border-border overflow-hidden group hover:border-primary/50 transition-all">
    <div className="absolute top-2 left-[75%] z-10 w-7 h-7 bg-primary text-primary-foreground rounded-full font-bold text-xs flex items-center justify-center shadow-md">
      {index + 1}
    </div>
    
    {data.image && (
      <div className="absolute inset-0">
        <Image
          src={data.image.url}
          alt={data.image.alt || data.title}
          className="w-full h-full object-cover"
          height={50 }
          width={50 }
          quality={30}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
    )}
    
    <div className="absolute inset-x-0 bottom-0 p-3">
      <h3 className="text-xs font-bold text-white line-clamp-2 mb-1">{data.title}</h3>
      {data.clientName && (
        <p className="text-[10px] text-white/80 line-clamp-1">{data.clientName}</p>
      )}
    </div>
    
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <GripVertical className="w-4 h-4 text-white drop-shadow-lg" />
    </div>
  </div>
);

// Minimal Square Testimonial Card
const TestimonialSquareCard = ({ data, index }: { data: TestimonialData; index: number }) => (

  <div className="relative aspect-square w-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-lg border-2 border-border overflow-hidden group hover:border-primary/50 transition-all">
    <div className="absolute top-2 left-[75%] z-10 w-7 h-7 bg-primary text-primary-foreground rounded-full font-bold text-xs flex items-center justify-center shadow-md">
      {index + 1}
    </div>
    
    <div className="absolute inset-0 p-3 flex flex-col justify-between">
      <p className="text-[10px] leading-relaxed italic text-foreground line-clamp-4">
        "{data.content}"
      </p>
      
      <div className="space-y-1">
        <div className="flex gap-0.5">
          {[...Array(data.rating || 5)].map((_, i) => (
            <span key={i} className="text-amber-500 text-xs">★</span>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          {data.avatar && (
            <Image
              src={data.avatar.url}
              alt={data.avatar.alt || data.clientName || ""}
              className="w-6 h-6 rounded-full object-cover border border-primary/20"
              height={data.avatar.height || 50}
              width={data.avatar.width || 50}
              quality={30}
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-[10px] line-clamp-1">{data.clientName}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <GripVertical className="w-4 h-4 text-muted-foreground" />
    </div>
  </div>
);

// Minimal Square Team Member Card
const TeamMemberSquareCard = ({ data, index }: { data: TeamMemberData; index: number }) => (
  <div className="relative aspect-square w-full bg-card rounded-lg border-2 border-border overflow-hidden group hover:border-primary/50 transition-all">
    <div className="absolute top-2 left-[75%] z-10 w-7 h-7 bg-primary text-primary-foreground rounded-full font-bold text-xs flex items-center justify-center shadow-md">
      {index + 1}
    </div>
    
    {data.image && (
      <div className="absolute inset-0">
        <Image
          src={data.image.url}
          alt={data.image.alt || data.name}
          className="w-full h-full object-cover"
          height={50 }
          width={50 }
          quality={30}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>
    )}
    
    <div className="absolute inset-x-0 bottom-0 p-3">
      <h3 className="text-xs font-bold text-white line-clamp-1 mb-0.5">{data.name}</h3>
      <p className="text-[10px] font-semibold text-primary-foreground/80 line-clamp-1">{data.position}</p>
    </div>
    
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <GripVertical className="w-4 h-4 text-white drop-shadow-lg" />
    </div>
  </div>
);

interface TypeToSquareRenderProps {
  slide: slideArrangeMinmal;
  index: number;
}

const TypeToSquareRender: React.FC<TypeToSquareRenderProps> = ({ slide, index }) => {
  switch (slide.type) {
    case "service":
      return <ServiceSquareCard data={slide as ServiceData} index={index} />;
    case "client":
      return <ClientSquareCard data={slide as ClientData} index={index} />;
    case "project":
      return <ProjectSquareCard data={slide as ProjectData} index={index} />;
    case "testimonial":
      return <TestimonialSquareCard data={slide as TestimonialData} index={index} />;
    case "team":
      return <TeamMemberSquareCard data={slide as TeamMemberData} index={index} />;
    default:
      return <div className="aspect-square w-full bg-muted rounded-lg" />;
  }
};

export default TypeToSquareRender;