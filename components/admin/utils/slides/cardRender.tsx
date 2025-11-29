
"use client"

import BlurredImage from "@/app/_comp/BlurredHashImage"
import type {
  ClientWithRelationsSlide,
  ProjectWithRelationsSlide,
  TeamMemberWithImage,
  TestimonialWithImage,
} from "@/types/schema"
import { motion } from "framer-motion"
import Image from "next/image"

export const ServiceCard = ({ data }: { data: any }) => {
  const DataToRender = data?.name ? data : data.data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2 }}
      className="group relative h-full overflow-hidden rounded-2xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300"
    >
      {DataToRender.image && (
        <div className="mb-5 h-60 overflow-hidden rounded-xl bg-muted">
          <BlurredImage
            imageUrl={DataToRender.image.url || ""}
            height={DataToRender.image.height || 400}
            width={DataToRender.image.width || 800}
            alt={DataToRender.image.alt || data.name}
            blurhash={DataToRender.image.blurHash || ""}
            quality={100}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {DataToRender.icon && DataToRender?.icon?.startsWith("http") ? (
            <div className="w-12 h-12 rounded-xl bg-primary/10 p-2.5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
              <Image
                src={DataToRender.icon || "/placeholder.svg"}
                width={24}
                height={24}
                alt={DataToRender.name + "-icon"}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <span>{DataToRender.icon}</span>
          )}
          <motion.h3
            className="text-xl font-bold font-sora text-foreground"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {DataToRender.name}
          </motion.h3>
        </div>

        {DataToRender.description && (
          <motion.p
            className="text-sm text-muted-foreground leading-relaxed font-inter"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {DataToRender.description}
          </motion.p>
        )}

        {DataToRender.richDescription && (
          <motion.div
            className="text-sm text-muted-foreground leading-relaxed font-inter"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p dangerouslySetInnerHTML={{ __html: DataToRender.richDescription }} />
          </motion.div>
        )}

        {DataToRender.price && (
          <motion.div
            className="pt-4 border-t border-border"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-base font-bold text-primary font-sora">{DataToRender.price}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export const ClientCard = ({ data }: { data: ClientWithRelationsSlide }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative h-full overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
    >
      {data.image && (
        <div className="relative h-60 bg-muted/50 border-b border-border overflow-hidden">
          <BlurredImage
            imageUrl={data.image.url}
            height={data.image.height || 400}
            width={data.image.width || 400}
            alt={data.image.alt || data.name}
            blurhash={data.image.blurHash || ""}
            quality={100}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* {data.tag && (
            <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase">
              {data.tag}
            </span>
          )} */}
          {data.isFeatured && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
      )}

      {data.logo && (
        <div className="bg-muted/30 flex items-center justify-start gap-4 p-4 border-b border-border">
          <BlurredImage
            imageUrl={data.logo.url}
            height={data.logo.height || 100}
            width={data.logo.width || 100}
            alt={data.logo.alt || `${data.name} logo`}
            blurhash={data.logo.blurHash || ""}
            quality={100}
            className="max-w-5 max-h-5 w-5 h-5 object-contain rounded-md"
          />
          <motion.h3
            className="text-lg font-bold text-foreground font-sora"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {data.name}
          </motion.h3>
        </div>
      )}

      <div className="p-6 space-y-3">
        {data.industry && (
          <motion.span
            className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full font-inter"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {data.industry}
          </motion.span>
        )}

        {data.description && (
          <motion.p
            className="text-sm text-muted-foreground leading-relaxed font-inter"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {data.description}
          </motion.p>
        )}

        {data.richDescription && data.richDescription !== data.description && (
          <motion.div
            className="text-sm text-muted-foreground leading-relaxed font-inter prose prose-sm dark:prose-invert"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            dangerouslySetInnerHTML={{ __html: data.richDescription }}
          />
        )}

        {data.website && (
          <motion.a
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors font-inter group/link"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Visit Website
            <span className="group-hover/link:translate-x-1 transition-transform duration-200">→</span>
          </motion.a>
        )}

        {(!data.isActive || data.type) && (
          <motion.div
            className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-inter"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <span>Type: {data.type}</span>
            {!data.isActive && <span className="text-destructive font-medium">Inactive</span>}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export const ProjectCard = ({ data }: { data: ProjectWithRelationsSlide }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative h-full overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        {data.image && (
          <BlurredImage
            imageUrl={data.image.url || ""}
            height={data.image.height || 400}
            width={data.image.width || 800}
            alt={data.image.alt || data.title}
            blurhash={data.image.blurHash || ""}
            quality={100}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        )}
      </div>

      <div className="p-6 space-y-3">
        <motion.h3
          className="text-lg font-bold text-foreground font-sora"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {data.title}
        </motion.h3>

        {data.clientName && (
          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground font-inter"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {data.clientName}
          </motion.div>
        )}

        {data.description && (
          <motion.p
            className="text-sm text-muted-foreground leading-relaxed font-inter"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {data.description}
          </motion.p>
        )}

        <motion.div
          className="flex gap-3 pt-3 border-t border-border"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {data.projectUrl && (
            <a
              href={data.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors font-inter"
            >
              View Project
            </a>
          )}
          {data.githubUrl && (
            <a
              href={data.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors font-inter"
            >
              GitHub
            </a>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export const TestimonialCard = ({ data }: { data: TestimonialWithImage }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative h-full rounded-2xl overflow-hidden bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300"
  >
    <div className="absolute top-4 right-4 text-5xl text-primary/10 font-serif select-none">"</div>

    <div className="relative space-y-5 h-full flex flex-col justify-between">
      <motion.p
        className="text-foreground text-sm leading-relaxed italic font-inter pr-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        {data.content}
      </motion.p>

      <div className="space-y-3">
        <motion.div
          className="flex gap-1"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {[...Array(data.rating)].map((_, i) => (
            <span key={i} className="text-primary text-lg">
              ★
            </span>
          ))}
        </motion.div>

        <motion.div
          className="flex items-center gap-3 pt-3 border-t border-border"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {data.avatar && (
            <img
              src={data.avatar.url || "/placeholder.svg"}
              alt={data.avatar.alt || data.clientName}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm font-sora">{data.clientName}</p>
            {data.clientPosition && <p className="text-xs text-muted-foreground font-inter">{data.clientPosition}</p>}
          </div>
        </motion.div>
      </div>
    </div>
  </motion.div>
)

export const TeamMemberCard = ({ data }: { data: TeamMemberWithImage }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative h-full overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
  >
    <div className="relative h-56 overflow-hidden bg-muted">
      {data.image && (
        <img
          src={data.image.url || "/placeholder.svg"}
          alt={data.image.alt || data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      )}
    </div>

    <div className="p-6 space-y-4">
      <div>
        <motion.h3
          className="text-lg font-bold text-foreground font-sora"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {data.name}
        </motion.h3>
        <motion.p
          className="text-sm font-semibold text-primary font-inter"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {data.position}
        </motion.p>
      </div>

      {data.bio && (
        <motion.p
          className="text-sm text-muted-foreground leading-relaxed font-inter"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {data.bio}
        </motion.p>
      )}

      <motion.div
        className="flex gap-2 pt-3 border-t border-border"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        {data.linkedin && (
          <a
            href={data.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            in
          </a>
        )}
        {data.github && (
          <a
            href={data.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            gh
          </a>
        )}
        {data.twitter && (
          <a
            href={data.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            𝕏
          </a>
        )}
        {data.email && (
          <a
            href={`mailto:${data.email}`}
            className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            ✉
          </a>
        )}
      </motion.div>
    </div>
  </motion.div>
)
