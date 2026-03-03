export const tTestimonialsPagei18n = {
  en: {
    title: "Testimonials",
    description: "Manage client testimonials and reviews",
    addButton: "Add Testimonial",
  },

  ar: {
    title: "آراء العملاء",
    description: "إدارة آراء وتقييمات العملاء",
    addButton: "إضافة رأي عميل",
  },
} as const


export const tTestimonialsTable = {
  en: {
    loadingMore: "Loading more testimonials...",
    allLoaded: (total: number) => `All ${total} testimonials loaded`,
    emptyTitle: "No testimonial found",
    emptyDescription: "Get started by adding your first testimonial member.",
    errorTitle: "Failed to load testimonial",
     retry: "Retry",  
    errorDescription: "There was an error loading your testimonial. Please try again.",
    deleteDialog: {
      title: "Delete testimonial",
      description: "Are you sure you want to delete this testimonial? This action cannot be undone.",
      confirm: "Delete",
      cancel: "Cancel",
    },
    toast: {
      deleteSuccess: "Testimonial deleted successfully!",
      deleteError: "Failed to delete testimonial. Please try again.",
    },
    card: {
      featured: "Featured",
      edit: "Edit testimonial",
      view: "View testimonial",
      delete: "Delete Member",
      ratingStars: "Rating",
    },
  },

  ar: {
    loadingMore: "جارٍ تحميل المزيد من آراء العملاء...",
    allLoaded: (total: number) => `تم تحميل جميع ${total} آراء العملاء`,
    emptyTitle: "لا توجد آراء للعملاء",
    emptyDescription: "ابدأ بإضافة أول عضو للفريق.",
    errorTitle: "فشل تحميل الآراء",
    retry: "إعادة المحاولة",

    errorDescription: "حدث خطأ أثناء تحميل آرائك. يرجى المحاولة مرة أخرى.",
    deleteDialog: {
      title: "حذف الرأي",
      description: "هل أنت متأكد أنك تريد حذف هذا الرأي؟ هذا الإجراء لا يمكن التراجع عنه.",
      confirm: "حذف",
      cancel: "إلغاء",
    },
    toast: {
      deleteSuccess: "تم حذف الرأي بنجاح!",
      deleteError: "فشل حذف الرأي. يرجى المحاولة مرة أخرى.",
    },
    card: {
      featured: "مميز",
      edit: "تعديل الرأي",
      view: "عرض الرأي",
      delete: "حذف العضو",
      ratingStars: "التقييم",
    },
  },
} as const


// i18n/testimonial-form.ts
export const tTestimonialForm = {
  en: {
    preview: {
      title: "Preview",
      featured: "Featured",
      active: "Active",
      inactive: "Inactive",
      contentFallback: "Your testimonial content will appear here...",
      clientNameFallback: "Client Name",
      positionFallback: "Position",
    },

    titles: {
      clientInformation: "Client Information",
      avatar: "Avatar",
    },

    labels: {
      clientName: "Client Name",
      clientPosition: "Position",
      clientCompany: "Company",
      content: "Content",
      rating: "Rating",
      activeStatus: "Active Status",
      activeNote: "Display this testimonial on the website",
      featuredTestimonial: "Featured Testimonial",
      featuredNote: "Display prominently on your site",
      avatarSection: "Avatar",
      remove: "Remove",
    },

    placeholders: {
      clientName: "John Smith",
      clientPosition: "CEO",
      clientCompany: "TechCorp Inc",
      content: "Write the testimonial content here...",
    },

    upload: {
      clickOrDrag: "Click or drag to upload",
      formats: "PNG, JPG up to 5MB",
      dragHint: "Drop image here",
    },

    buttons: {
      cancel: "Cancel",
      create: "Create",
      update: "Update",
      saving: "Saving...",
    },

    form: {
      characters: "characters",
      ratingSuffix: "/ 5",
    },

    toast: {
      createSuccess: "Testimonial created successfully",
      updateSuccess: "Testimonial updated successfully",
      errorTitle: "Error",
      saveFailed: "Failed to save testimonial. Please try again.",
      fileTooLargeTitle: "File too large",
      fileTooLargeDesc: "Please upload an image smaller than 5MB",
      invalidFileTypeTitle: "Invalid file type",
      invalidFileTypeDesc: "Please upload an image file",
    },

    validation: {
      clientNameRequired: "Client name is required",
      contentMin: "Content must be at least 5 characters",
      ratingRange: "Rating must be between 1 and 5",
    },
  },

  ar: {
    preview: {
      title: "المعاينة",
      featured: "مميز",
      active: "نشط",
      inactive: "غير نشط",
      contentFallback: "سيظهر محتوى التوصية هنا...",
      clientNameFallback: "اسم العميل",
      positionFallback: "المنصب",
    },

    titles: {
      clientInformation: "معلومات العميل",
      avatar: "الصورة",
    },

    labels: {
      clientName: "اسم العميل",
      clientPosition: "المنصب",
      clientCompany: "الشركة",
      content: "المحتوى",
      rating: "التقييم",
      activeStatus: "حالة الظهور",
      activeNote: "عرض هذه التوصية على الموقع",
      featuredTestimonial: "توصية مميزة",
      featuredNote: "الظهور بشكل بارز على موقعك",
      avatarSection: "الصورة الشخصية",
      remove: "إزالة",
    },

    placeholders: {
      clientName: "أحمد علي",
      clientPosition: "المدير التنفيذي",
      clientCompany: "شركة التقنية",
      content: "اكتب محتوى التوصية هنا...",
    },

    upload: {
      clickOrDrag: "اضغط أو اسحب لإرفاق الصورة",
      formats: "PNG, JPG حتى 5 ميغابايت",
      dragHint: "أسقط الصورة هنا",
    },

    buttons: {
      cancel: "إلغاء",
      create: "إنشاء",
      update: "تحديث",
      saving: "جاري الحفظ...",
    },

    form: {
      characters: "حرف",
      ratingSuffix: "/ 5",
    },

    toast: {
      createSuccess: "تم إنشاء التوصية بنجاح",
      updateSuccess: "تم تحديث التوصية بنجاح",
      errorTitle: "خطأ",
      saveFailed: "فشل حفظ التوصية. يرجى المحاولة مرة أخرى.",
      fileTooLargeTitle: "حجم الملف كبير جدًا",
      fileTooLargeDesc: "يرجى رفع صورة أصغر من 5 ميغابايت",
      invalidFileTypeTitle: "نوع الملف غير صالح",
      invalidFileTypeDesc: "يرجى رفع ملف صورة",
    },

    validation: {
      clientNameRequired: "اسم العميل مطلوب",
      contentMin: "يجب أن يكون المحتوى على الأقل 5 أحرف",
      ratingRange: "يجب أن يكون التقييم بين 1 و 5",
    },
  },
}  satisfies Record<"en" | "ar", TestimonialFormI18n>



export interface TestimonialFormI18n {
  preview: {
    title: string
    featured: string
    active: string
    inactive: string
    contentFallback: string
    clientNameFallback: string
    positionFallback: string
  }
  titles: {
    clientInformation: string
    avatar: string
  }
  labels: {
    clientName: string
    clientPosition: string
    clientCompany: string
    content: string
    rating: string
    activeStatus: string
    activeNote: string
    featuredTestimonial: string
    featuredNote: string
    avatarSection: string
    remove: string
  }
  placeholders: {
    clientName: string
    clientPosition: string
    clientCompany: string
    content: string
  }
  upload: {
    clickOrDrag: string
    formats: string
    dragHint: string
  }
  buttons: {
    cancel: string
    create: string
    update: string
    saving: string
  }
  form: {
    characters: string
    ratingSuffix: string
  }
  toast: {
    createSuccess: string
    updateSuccess: string
    errorTitle: string
    saveFailed: string
    fileTooLargeTitle: string
    fileTooLargeDesc: string
    invalidFileTypeTitle: string
    invalidFileTypeDesc: string
  }
  validation: {
    clientNameRequired: string
    contentMin: string
    ratingRange: string
  }
}