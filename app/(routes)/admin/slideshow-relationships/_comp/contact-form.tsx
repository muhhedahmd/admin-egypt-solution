"use client"

import { motion } from "framer-motion"
import { Form, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { ServiceAutocomplete } from "@/app/_comp/AutoCompleteServiceInput"
import { useCreateContactMutation } from "@/lib/store/api/contact-api"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  company: z.string().max(255).optional().or(z.literal("")),
  subject: z.string().min(1, "Subject is required").max(255),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  category: z.enum([
    "GENERAL_INQUIRY",
    "SUPPORT",
    "SALES",
    "PARTNERSHIP",
    "FEEDBACK",
    "COMPLAINT",
    "SERVICE_INQUIRY",
    "OTHER",
  ]).default("GENERAL_INQUIRY"),
  serviceId: z.string().optional().or(z.literal("")),
  budget: z.string().max(255).optional().or(z.literal("")),
  timeline: z.string().max(255).optional().or(z.literal("")),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {


  const [ create, { isLoading  , isSuccess ,  } ] = useCreateContactMutation( )

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: "GENERAL_INQUIRY",
      timeline: "flexible",
      budget: "Not sure yet",
    },
    disabled : isLoading
  })
  
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  const onSubmit = async (data: ContactFormData) => {


    try {
      const payload = {
        ...data,
        phone: data.phone || null,
        company: data.company || null,
        serviceId: selectedServiceId || null,
        budget: data.budget || null,
        timeline: data.timeline || null,
      
        source: null,
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
      }


      // setSubmitted(true)
      const  res = await create(payload)

      console.log("res", res)

      if ("error" in res) {
        console.error("Submission error:", res.error)
        return
      }
    
    } catch (error) {
      console.error("Submission error:", error)
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card text-card-foreground rounded-2xl shadow-lg p-8 border"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3">Ready to Work Together?</h2>
            <p className="text-muted-foreground text-lg">
              Have a project in mind? Let's discuss how we can help transform your ideas into exceptional software solutions.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("name")}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Work Email <span className="text-destructive">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                  placeholder="john@company.com"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  {...register("phone")}
                  type="tel"
                  className="w-full px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input
                  {...register("company")}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                  placeholder="Your Company Inc."
                />
                {errors.company && (
                  <p className="text-destructive text-sm mt-1">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("category")}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                >
                  <option value="GENERAL_INQUIRY">General Inquiry</option>
                  <option value="SUPPORT">Support</option>
                  <option value="SALES">Sales</option>
                  <option value="PARTNERSHIP">Partnership</option>
                  <option value="FEEDBACK">Feedback</option>
                  <option value="COMPLAINT">Complaint</option>
                  <option value="SERVICE_INQUIRY">Service Inquiry</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {
                watch("category") === "SERVICE_INQUIRY" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Service ID</label>
                    <ServiceAutocomplete
                      value={selectedServiceId}
                      onSelect={setSelectedServiceId}
                      placeholder="Choose a service..."
                    />
                  </div>)
              }

            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Subject <span className="text-destructive">*</span>
              </label>
              <input
                {...register("subject")}
                className="w-full px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                placeholder="What's this about?"
              />
              {errors.subject && (
                <p className="text-destructive text-sm mt-1">{errors.subject.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Budget Range</label>
                <select
                  {...register("budget")}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select budget range</option>
                  <option value="< $10,000">Less than $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                  <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                  <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                  <option value="> $250,000">More than $250,000</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Timeline</label>
                <select
                  {...register("timeline")}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP">ASAP (Less than 1 month)</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="12+ months">More than 12 months</option>
                  <option value="Flexible">Flexible / Not decided</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Project Details <span className="text-destructive">*</span>
              </label>
              <textarea
                {...register("message")}
                rows={6}
                className="w-full px-4 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all resize-none"
                placeholder="Tell us about your project..."
              />
              {errors.message && (
                <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all hover:shadow-lg"
            >
              {isSubmitting ? "Thank you! We'll be in touch soon." : isSubmitting ? "Sending..." : "Send Inquiry"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}