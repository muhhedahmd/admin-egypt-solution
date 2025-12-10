"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@uidotdev/usehooks"
import { X, ImageIcon } from "lucide-react"
import { memo, useEffect, useMemo, useRef, useState } from "react"

export const HeroControls = memo(({ heroData, updateField, handleImageUpload, removeImage, uploadingImage }) => {
  const heroVariants = ["CENTERED", "SPLIT", "IMAGE_BACKGROUND", "MINIMAL", "VIDEO_BACKGROUND", "FULL_SCREEN"]
  const alignments = ["LEFT", "CENTER", "RIGHT"]
  const buttonVariants = ["PRIMARY", "SECONDARY", "GHOST", "LINK", "OUTLINE"]
  const titleSizes = ["2xl", "3xl", "4xl", "5xl", "6xl", "7xl"]

  const responsiveHeightSuggestion = useMemo(() => {
    if (heroData.variant === "FULL_SCREEN") return "100vh"
    if (heroData.variant === "MINIMAL") return `${Math.max(400, heroData.minHeight * 0.7)}px`
    return `${heroData.minHeight}px`
  }, [heroData.variant, heroData.minHeight])

  return (
    <div className="space-y-6 p-4">
      {/* Basic Info */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">Content</h3>
        <div className="space-y-3">
          <InputField label="Section Name" value={heroData.name} onChange={(value) => updateField("name", value)} />
          <InputField label="Title *" value={heroData.title} onChange={(value) => updateField("title", value)} />
          <InputField label="Subtitle" value={heroData.subtitle} onChange={(value) => updateField("subtitle", value)} />
          <TextAreaField
            label="Description"
            value={heroData.description}
            onChange={(value) => updateField("description", value)}
          />
        </div>
      </section>

      {/* Background */}
      <section className="pt-4 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Background</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Background Image</label>
            {heroData.backgroundImageUrl ? (
              <div className="relative rounded-lg overflow-hidden h-32 bg-muted flex items-center justify-center">
                <img
                  src={heroData.backgroundImageUrl || "/placeholder.svg"}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition text-center">
                <ImageIcon className="mx-auto mb-2 text-muted-foreground" size={24} />
                <span className="text-sm text-muted-foreground">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            )}

          </div>



          <ColorField
            label="Background Color"
            value={heroData.backgroundColor}
            onChange={(value) => updateField("backgroundColor", value)}
          />

          <ColorField
            label="Overlay Color"
            value={heroData.overlayColor}
            onChange={(value) => updateField("overlayColor", value)}
          />

          <SliderField
            label={`Overlay Opacity: ${heroData.overlayOpacity.toFixed(1)}`}
            value={heroData.overlayOpacity}
            onChange={(value) => updateField("overlayOpacity", value)}
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      </section>

      {/* Layout */}
      <section className="pt-4 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Layout</h3>
        <div className="space-y-3">
          <SelectField
            label="Variant"
            value={heroData.variant}
            options={heroVariants}
            onChange={(value: any) => updateField("variant", value)}
            description={`${heroData.variant === "FULL_SCREEN" ? "Full viewport height" : heroData.variant === "MINIMAL" ? "Compact layout" : "Standard layout"}`}
          />
          <SelectField
            label="Alignment"
            value={heroData.alignment}
            options={alignments}
            onChange={(value: any) => updateField("alignment", value)}
          />
          <InputField
            label="Min Height (px)"
            type="number"
            value={heroData.minHeight}
            onChange={(value) => updateField("minHeight", Number.parseInt(value))}
          />
          <div className="text-xs text-muted-foreground mt-1">
            Responsive height: <code className="bg-muted px-2 py-1 rounded">{responsiveHeightSuggestion}</code>
          </div>
        </div>
      </section>

      {/* Content Styling */}
      <section className="pt-4 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Typography</h3>
        <div className="space-y-3">
          <SelectField
            label="Title Size"
            value={heroData.titleSize}
            options={titleSizes}
            onChange={(value) => updateField("titleSize", value)}
            description={heroData.titleSize === "7xl" ? "Extra large (recommended for hero)" : ""}
          />
          <ColorField
            label="Title Color"
            value={heroData.titleColor}
            onChange={(value) => updateField("titleColor", value)}
          />
          <ColorField
            label="Subtitle Color"
            value={heroData.subtitleColor}
            onChange={(value) => updateField("subtitleColor", value)}
          />
          <ColorField
            label="Description Color"
            value={heroData.descriptionColor}
            onChange={(value) => updateField("descriptionColor", value)}
          />
        </div>
      </section>

      {/* CTAs */}
      <section className="pt-4 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Primary Button</h3>
        <div className="space-y-3">
          <InputField
            label="Button Text"
            value={heroData.ctaText}
            onChange={(value) => updateField("ctaText", value)}
          />
          <InputField label="Button URL" value={heroData.ctaUrl} onChange={(value) => updateField("ctaUrl", value)} />
          <SelectField
            label="Button Variant"
            value={heroData.ctaVariant}
            options={buttonVariants}
            onChange={(value) => updateField("ctaVariant", value)}
          />
        </div>
      </section>

      <section className="pt-4 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Secondary Button</h3>
        <div className="space-y-3">
          <InputField
            label="Button Text"
            value={heroData.secondaryCtaText}
            onChange={(value) => updateField("secondaryCtaText", value)}
          />
          <InputField
            label="Button URL"
            value={heroData.secondaryCtaUrl}
            onChange={(value) => updateField("secondaryCtaUrl", value)}
          />
          <SelectField
            label="Button Variant"
            value={heroData.secondaryCtaVariant}
            options={buttonVariants}
            onChange={(value) => updateField("secondaryCtaVariant", value)}
          />
        </div>
      </section>

      {/* Options */}
      <section className="pt-4 border-t border-border space-y-3">
        <div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={heroData.showScrollIndicator}
              onChange={(e) => updateField("showScrollIndicator", e.target.checked)}
              className="w-4 h-4 rounded border border-border"
            />
            <span className="text-sm font-medium">Show scroll indicator</span>
          </label>
        </div>
        <div>
          
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={heroData.isActive}
            onChange={(e) => updateField("isActive", e.target.checked)}
            className="w-4 h-4 rounded border border-border"
            />
          <span className="text-sm font-medium">Is Active</span>
        </label>
        </div>
      </section>
    </div>
  )
})

HeroControls.displayName = "HeroControls"

const InputField = ({ label, value, onChange, type = "text", placeholder = "", description = "" }: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  description?: string
}) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-background text-foreground"
    />
    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
  </div>
)

const TextAreaField = ({ label, value, onChange, placeholder = "" }) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-background text-foreground resize-none"
    />
  </div>
)


const ColorField = ({ label = "", value = "", onChange = ()=>{} }) => {
  const [temp, setTemp] = useState(value);

  const debounced  = useDebounce(temp, 100);
 
  useEffect(()=>{

    onChange(debounced)

  } , [debounced])

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <div className="max-w-16 max-h16 overflow-clip rounded-full">

        <Input
          type="color"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          className="w-7 h-7 p-0 scale-200 rounded-full border-transparent cursor-pointer border-none outline-none "
          />
          </div>

        <input
          type="text"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground font-mono text-xs"
        />
      </div>
    </div>
  );
};

export default ColorField;

const SelectField = ({ label, value, options, onChange, description = "" }) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-background text-foreground"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.replace(/_/g, " ")}
        </option>
      ))}
    </select>
    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
  </div>
)

const SliderField = ({ label, value, onChange, min, max, step }) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number.parseFloat(e.target.value))}
      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
    />
  </div>
)
