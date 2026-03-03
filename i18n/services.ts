export const Translations_landingService = {
  ar: {
    mainHeading: "خدماتنا",
    pageTitle: "الخدمات",
    pageDescription: "إدارة خدمات الشركة",
    addService: "إضافة خدمة",
  },
  en: {
    mainHeading: "Our Services",
    pageTitle: "Services",
    pageDescription: "Manage your company's service offerings",
    addService: "Add Service",
  },
} as const;

export const serviceFormI18n = {
  en: {
    header: {
      createTitle: "Create Service",
      createSubtitle: "Add a new service to your offerings",
      editTitle: "Edit Service",
      editSubtitle: "Update your service details",
    },
    page: {
      basicInfo: "Basic Information",
      settings: "Settings",
      serviceImage: "Service Image",
      serviceIcon: "Service Icon",
      fullContent: "Full Content",
    },
    fields: {
      title: "Title",
      shortDescription: "Short Description",
      fullDescription: "Full Description",
      price: "Price",
    },
    actions: {
      create: "Create Service",
      update: "Update Service",
      cancel: "Cancel",
      saving: "Saving...",
    },
    states: {
      featured: "Featured Service",
      active: "Active Service",
    },
    messages: {
      validationError: "Please fix all errors before submitting",
      successCreate: "Service created successfully",
      successUpdate: "Service updated successfully",
    },
    toast: {
      createSuccess: "Service created successfully",
      updateSuccess: "Service updated successfully",
      validationError: "Please fix all errors before submitting",
      saveError: "Failed to save service",
    },
  },

  ar: {
    header: {
      createTitle: "إنشاء خدمة",
      createSubtitle: "أضف خدمة جديدة إلى عروضك",
      editTitle: "تعديل الخدمة",
      editSubtitle: "تحديث بيانات الخدمة",
    },

    toast: {
      createSuccess: "تم إنشاء الخدمة بنجاح",
      updateSuccess: "تم تحديث الخدمة بنجاح",
      validationError: "يرجى تصحيح جميع الأخطاء قبل الإرسال",
      saveError: "فشل حفظ الخدمة",
    },
    page: {
      basicInfo: "المعلومات الأساسية",
      settings: "الإعدادات",
      serviceImage: "صورة الخدمة",
      serviceIcon: "أيقونة الخدمة",
      fullContent: "المحتوى الكامل",
    },
    fields: {
      title: "العنوان",
      shortDescription: "وصف مختصر",
      fullDescription: "الوصف الكامل",
      price: "السعر",
    },
    actions: {
      create: "إنشاء خدمة",
      update: "تحديث الخدمة",
      cancel: "إلغاء",
      saving: "جارٍ الحفظ...",
    },
    states: {
      featured: "خدمة مميزة",
      active: "خدمة نشطة",
    },
    messages: {
      validationError: "يرجى تصحيح الأخطاء قبل الإرسال",
      successCreate: "تم إنشاء الخدمة بنجاح",
      successUpdate: "تم تحديث الخدمة بنجاح",
    },
  },
} as const;



export const Translations_serviceDetails = {
  ar: {
    // Header / breadcrumb
    servicesLabel: "الخدمات",
    pageTitle: "تفاصيل الخدمة",

    // Header actions
    editService: "تعديل الخدمة",
    deleteService: "حذف الخدمة",
    backToServices: "العودة للخدمات",

    // Hero badges / labels
    featured: "مميزة",
    statusActive: "نشط",
    statusInactive: "غير نشط",

    // Pricing block
    pricingLabel: "السعر",
    purchaseButton: "شراء الخدمة",

    // Description card
    aboutHeading: "حول هذه الخدمة",
    aboutSubtitle: "نظرة عامة والتفاصيل",

    // Tabs / translation missing
    noTranslation: "لا توجد ترجمة لهذه اللغة بعد.",

    // Related projects
    relatedProjectsHeading: "المشاريع المرتبطة",
    relatedProjectsCount_one: "{{count}} مشروع يستخدم هذه الخدمة",
    relatedProjectsCount_other: "{{count}} مشاريع تستخدم هذه الخدمة",
    viewProjectButton: "عرض التفاصيل",

    // Image details / asset labels
    imageDetailsHeading: "تفاصيل الصورة",
    imageDetailsSubtitle: "معلومات المورد",
    dimensionsLabel: "الأبعاد",
    fileSizeLabel: "حجم الملف",
    formatLabel: "الصيغة",
    typeLabel: "النوع",
    filenameLabel: "اسم الملف",
    fileHashLabel: "تجزئة الملف",
    blurHashLabel: "Blur Hash",
    storageKeyLabel: "مفتاح التخزين",

    // Sidebar / service info
    serviceInfoHeading: "معلومات الخدمة",
    serviceInfoSubtitle: "تفاصيل سريعة",
    labelStatus: "الحالة",
    labelFeatured: "مميزة",
    labelDisplayOrder: "ترتيب العرض",

    // Metadata labels
    metadataHeading: "بيانات النظام",
    labelServiceId: "معرّف الخدمة",
    labelCreated: "تاريخ الإنشاء",
    labelLastUpdated: "آخر تحديث",
    labelImageId: "معرّف الصورة",

    // Delete dialog & toasts
    deleteDialogTitle: "حذف الخدمة",
    deleteDialogDescription: "هل أنت متأكد أنك تريد حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء.",
    toastDeleteSuccess: "تم حذف الخدمة بنجاح.",
    toastDeleteFailed: "فشل حذف الخدمة. حاول مرة أخرى.",

    // Clipboard toast
    toastCopied: "تم النسخ إلى الحافظة.",
        yes : "نعم" ,
    no : "لا" ,

    // Generic
    projectsWord_singular: "مشروع",
    projectsWord_plural: "مشاريع",
    serviceNotFoundTitle: "الخدمة غير موجودة",
    serviceNotFoundDesc: "الخدمة التي تبحث عنها غير موجودة.",
  },

  en: {
    // Header / breadcrumb
    servicesLabel: "Services",
    pageTitle: "Service Details",

    // Header actions
    editService: "Edit Service",
    deleteService: "Delete Service",
    backToServices: "Back to Services",

    // Hero badges / labels
    featured: "Featured",
    statusActive: "Active",
    statusInactive: "Inactive",

    // Pricing block
    pricingLabel: "Pricing",
    purchaseButton: "Purchase Service",

    // Description card
    aboutHeading: "About This Service",
    aboutSubtitle: "Overview and details",

    // Tabs / translation missing
    noTranslation: "No translation available for this language.",

    // Related projects
    relatedProjectsHeading: "Related Projects",
    relatedProjectsCount_one: "project using this service",
    relatedProjectsCount_other: "{{count}} projects using this service",
    viewProjectButton: "View Details",

    // Image details / asset labels
    imageDetailsHeading: "Image Details",
    imageDetailsSubtitle: "Asset information",
    dimensionsLabel: "Dimensions",
    fileSizeLabel: "File Size",
    formatLabel: "Format",
    typeLabel: "Type",
    filenameLabel: "Filename",
    fileHashLabel: "File Hash",
    blurHashLabel: "Blur Hash",
    storageKeyLabel: "Storage Key",

    // Sidebar / service info
    serviceInfoHeading: "Service Info",
    serviceInfoSubtitle: "Quick details",
    labelStatus: "Status",
    labelFeatured: "Featured",
    labelDisplayOrder: "Display Order",

    // Metadata labels
    metadataHeading: "Metadata",
    labelServiceId: "Service ID",
    labelCreated: "Created",
    labelLastUpdated: "Last Updated",
    labelImageId: "Image ID",

    // Delete dialog & toasts
    deleteDialogTitle: "Delete Service",
    deleteDialogDescription: "Are you sure you want to delete this service? This action cannot be undone.",
    toastDeleteSuccess: "Service deleted successfully.",
    toastDeleteFailed: "Failed to delete service. Please try again.",

    // Clipboard toast
    toastCopied: "Copied to clipboard.",
    yes : "yes" ,
    no : "no" ,
    // Generic
    projectsWord_singular: "project",
    projectsWord_plural: "projects",
    serviceNotFoundTitle: "Service Not Found",
    serviceNotFoundDesc: "The service you're looking for doesn't exist.",
  },
} as const;
