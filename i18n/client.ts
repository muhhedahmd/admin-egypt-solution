export interface ClientsPageI18n {
  title: string
  subtitle: string
  addButton: string
}

export const tClientsPage: Record<'en' | 'ar', ClientsPageI18n> = {
  en: {
    title: "Clients",
    subtitle: "Manage your client relationships and logos",
    addButton: "Add Client",
  },
  ar: {
    title: "العملاء",
    subtitle: "إدارة علاقات العملاء والشعارات الخاصة بهم",
    addButton: "إضافة عميل",
  },
} as const


// i18n/clients-table.ts
// i18n/clients-table.ts
export interface ClientsTableI18n {
  loading: string
  allLoaded: string
  failedToLoad: {
    title: string
    description: string
    retryButton: string
  }
  noClients: {
    title: string
    description: string
  }
  badges: {
    featured: string
    active: string
    inactive: string
  }
  dropdown: {
    view: string
    edit: string
    delete: string
  }
  deleteDialog: {
    title: string
    description: string
    confirm: string
  }
  imageMeta: {
    sizeLabel: string
    typeLabel: string
  }
  skeleton: {
    titlePlaceholder: string
    textPlaceholder: string
  }
  labels: {
      website: string,
      industry: string, // <-- added this
    },
}

export const tClientsTable: Record<'en' | 'ar', ClientsTableI18n> = {
  en: {
    loading: "Loading more clients...",
    allLoaded: "All clients loaded",
    failedToLoad: {
      title: "Failed to load clients",
      description: "There was an error loading your clients. Please try again.",
      retryButton: "Retry",
    },
    noClients: {
      title: "No clients found",
      description: "Get started by creating your first client.",
    },
    badges: {
      featured: "Featured",
      active: "Active",
      inactive: "Inactive",
    },
    dropdown: {
      view: "View Details",
      edit: "Edit client",
      delete: "Delete client",
    },
    deleteDialog: {
      title: "Delete Client",
      description: "Are you sure you want to delete this client? This action cannot be undone.",
      confirm: "Confirm",
    },
    imageMeta: {
      sizeLabel: "Size",
      typeLabel: "Type",
    },
    skeleton: {
      titlePlaceholder: "Loading title...",
      textPlaceholder: "Loading content...",
    },
     labels: {
      website: "Website",
      industry: "Industry", // <-- added this
    },
  },
  ar: {
    loading: "جاري تحميل المزيد من العملاء...",
    allLoaded: "تم تحميل جميع العملاء",
    failedToLoad: {
      title: "فشل تحميل العملاء",
      description: "حدث خطأ أثناء تحميل العملاء. حاول مرة أخرى.",
      retryButton: "إعادة المحاولة",
    },
    noClients: {
      title: "لا يوجد عملاء",
      description: "ابدأ بإنشاء عميلك الأول.",
    },
    badges: {
      featured: "مميز",
      active: "نشط",
      inactive: "غير نشط",
    },
    dropdown: {
      view: "عرض التفاصيل",
      edit: "تعديل العميل",
      delete: "حذف العميل",
    },
    deleteDialog: {
      title: "حذف العميل",
      description: "هل أنت متأكد أنك تريد حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.",
      confirm: "تأكيد",
    },
    imageMeta: {
      sizeLabel: "الحجم",
      typeLabel: "النوع",
    },
    skeleton: {
      titlePlaceholder: "جاري تحميل العنوان...",
      textPlaceholder: "جاري تحميل المحتوى...",
    },
    labels: {
      website: "الموقع الإلكتروني",
      industry: "الصناعة", // <-- added this
    },
  },
} as const








// i18n/client-form.ts

export interface ClientFormI18n {
  titles: {
    main: string
    images: string
  }
  labels: {
    name: string
    industry: string
    website: string
    description: string
    richDescription: string
    isActive: string
    isFeatured: string
    logo: string
    mainImage: string
  }
  placeholders: {
    name: string
    industry: string
    website: string
    description: string
    richDescription: string
  }
  buttons: {
    cancel: string
    submit: string
    saving: string
    add: string
    update: string
  }
  validation: {
    required: string
    maxLength: string
    invalidUrl: string
  }
  toast: {
    successAdd: string
    successUpdate: string
    error: string
  }
  imageActions: {
    remove: string
    upload: string
  }
}

export const tClientForm: Record<'en' | 'ar', ClientFormI18n> = {
  en: {
    titles: {
      main: "Client Information",
      images: "Images",
    },
    labels: {
      name: "Company Name",
      industry: "Industry",
      website: "Website",
      description: "Short Description",
      richDescription: "Full Description",
      isActive: "Active Client",
      isFeatured: "Featured Client",
      logo: "Company Logo",
      mainImage: "Main Image",
    },
    placeholders: {
      name: "TechCorp Inc",
      industry: "Technology",
      website: "https://techcorp.com",
      description: "Brief description of the client",
      richDescription: "Detailed description of the client and their business",
    },
    buttons: {
      cancel: "Cancel",
      submit: "Submit",
      saving: "Saving...",
      add: "Add Client",
      update: "Update Client",
    },
    validation: {
      required: "This field is required",
      maxLength: "Input is too long",
      invalidUrl: "Invalid website URL",
    },
    toast: {
      successAdd: "Client added successfully!",
      successUpdate: "Client updated successfully!",
      error: "Failed to save client. Please try again.",
    },
    imageActions: {
      remove: "Remove",
      upload: "Upload",
    },
  },
  ar: {
    titles: {
      main: "معلومات العميل",
      images: "الصور",
    },
    labels: {
      name: "اسم الشركة",
      industry: "الصناعة",
      website: "الموقع الإلكتروني",
      description: "وصف قصير",
      richDescription: "الوصف الكامل",
      isActive: "عميل نشط",
      isFeatured: "عميل مميز",
      logo: "شعار الشركة",
      mainImage: "الصورة الرئيسية",
    },
    placeholders: {
      name: "شركة تك كورب",
      industry: "تكنولوجيا",
      website: "https://techcorp.com",
      description: "وصف موجز عن العميل",
      richDescription: "وصف مفصل عن العميل ونشاطه التجاري",
    },
    buttons: {
      cancel: "إلغاء",
      submit: "حفظ",
      saving: "جاري الحفظ...",
      add: "إضافة عميل",
      update: "تحديث العميل",
    },
    validation: {
      required: "هذا الحقل مطلوب",
      maxLength: "النص طويل جدًا",
      invalidUrl: "رابط الموقع غير صالح",
    },
    toast: {
      successAdd: "تمت إضافة العميل بنجاح!",
      successUpdate: "تم تحديث العميل بنجاح!",
      error: "فشل حفظ العميل. حاول مرة أخرى.",
    },
    imageActions: {
      remove: "إزالة",
      upload: "رفع",
    },
  },
} as const
