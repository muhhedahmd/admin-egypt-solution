
export const slideshowsPageI18n = {
  en: {
    header: {
      title: "Slideshows",
      subtitle: "Manage homepage and content slideshows",
    },
    actions: {
      add: "Add Slideshow",
      reorder: "Reorder",
    },
  },

  ar: {
    header: {
      title: "عروض الشرائح",
      subtitle: "إدارة عروض الشرائح للصفحة الرئيسية والمحتوى",
    },
    actions: {
      add: "إضافة عرض شرائح",
      reorder: "إعادة الترتيب",
    },
  },
} as const




export const slideshowsTableI18n = {
  en: {
    states: {
      loadingMore: "Loading more slideshows...",
      allLoaded: (count: number) => `All ${count} slideshows loaded`,
      emptyTitle: "No slideshows found",
      emptyDescription: "Get started by creating your first slideshow.",
      errorTitle: "Failed to load slideshows",
      errorDescription: "There was an error loading your slideshows. Please try again.",
      retry: "Retry",
    },

    badges: {
      active: "Active",
      inactive: "Inactive",
      autoplay: "Autoplay",
      manual: "Manual",
    },

    actions: {
      view: "View",
      edit: "Edit",
      delete: "Delete",
    },

    deleteDialog: {
      title: (name?: string) => `Delete Slideshow${name ? ` ( ${name} )` : ""}`,
      description:
        "Are you sure you want to delete this Slideshow? This action cannot be undone.",
      success: "Slideshow deleted successfully!",
      error: "Failed to delete slideshow. Please try again.",
    },
  },

  ar: {
    states: {
      loadingMore: "جاري تحميل المزيد من عروض الشرائح...",
      allLoaded: (count: number) => `تم تحميل ${count} عرض شرائح`,
      emptyTitle: "لا توجد عروض شرائح",
      emptyDescription: "ابدأ بإنشاء أول عرض شرائح لك.",
      errorTitle: "فشل تحميل عروض الشرائح",
      errorDescription: "حدث خطأ أثناء تحميل عروض الشرائح. حاول مرة أخرى.",
      retry: "إعادة المحاولة",
    },

    badges: {
      active: "نشط",
      inactive: "غير نشط",
      autoplay: "تشغيل تلقائي",
      manual: "يدوي",
    },

    actions: {
      view: "عرض",
      edit: "تعديل",
      delete: "حذف",
    },

    deleteDialog: {
      title: (name?: string) => `حذف عرض الشرائح${name ? ` ( ${name} )` : ""}`,
      description: "هل أنت متأكد من حذف عرض الشرائح؟ لا يمكن التراجع عن هذا الإجراء.",
      success: "تم حذف عرض الشرائح بنجاح",
      error: "فشل حذف عرض الشرائح. حاول مرة أخرى.",
    },
  },
} as const




export const slideshowsFormI18n = {
  en: {
    form: {
      headers: {
        basicSettings: "Basic Settings",
        autoplaySettings: "Autoplay Settings",
        slidesManagement: "Slides Management",
        actionButtons: "Actions",
        configuration: "Configuration",
      },

      labels: {
        title: "Slideshow Title",
        description: "Slideshow Description",
        type: "Type",
        status: "Status",
        autoplayEnabled: "Enable Autoplay",
        autoplayInterval: "Autoplay Interval (ms)",
        selectSlides: "Select slides to add",
        totalSlides: "Total Slides",
      },

      placeholders: {
        title: "e.g., Homepage Hero",
        description: "Short description of this slideshow",
        searchSlides: "Search services, projects, clients...",
      },

      // Select / enum options
      types: {
        HERO: "Hero Banner",
        SERVICES: "Services Showcase",
        PROJECTS: "Project Showcase",
        CLIENTS: "Client Logos",
        TEAM: "Team Members",
        TESTIMONIALS: "Testimonials",
        CUSTOM: "Custom",
        // helper to generate array for Select components if you prefer
        optionsArray: () =>
          [
            { value: "HERO", label: "Hero Banner" },
            { value: "SERVICES", label: "Services Showcase" },
            { value: "PROJECTS", label: "Project Showcase" },
            { value: "CLIENTS", label: "Client Logos" },
            { value: "TEAM", label: "Team Members" },
            { value: "TESTIMONIALS", label: "Testimonials" },
            { value: "CUSTOM", label: "Custom" },
          ] as const,
      },

      statuses: {
        ACTIVE: "Active",
        INACTIVE: "Inactive",
        DRAFT: "Draft",
      },

      composition: {
        title: "Composition",
        arrange: "Arrange",
      },

      buttons: {
        save: "Save Slideshow",
        saving: "Saving...",
        previewShow: "Show Preview",
        previewHide: "Hide Preview",
        arrange: "Arrange",
        cancel: "Cancel",
      },

      previews: {
        loading: "Saving...",
        saved: "Slideshow saved successfully",
      },

      validation: {
        requiredTitle: "Slideshow title is required",
        titleLength: "Title must be at least 3 characters",
        requiredDescription:
          "Description is required and must be between 10 and 500 characters",
        minSlides: "Please add at least one slide",
        minInterval: "Autoplay interval must be at least 1000ms",
      },

      toasts: {
        validationError: (msg: string) => `Validation Error: ${msg}`,
        savedSuccess: "Slideshow saved successfully",
        saveFailed: "Failed to save slideshow",
      },

      previewDialog: {
        title: "Preview",
        close: "Close",
      },
          badges: {
      active: "Active",
      inactive: "Inactive",
      autoplay: "Autoplay",
      manual: "Manual",
    },


      empty: {
        noSlides: "No slides selected",
      },

      misc: {
        secondsLabel: (ms: number) => `${(ms / 1000).toFixed(1)} seconds`,
        totalSlidesLabel: (n: number) => `${n} ${n === 1 ? "slide" : "slides"}`,
      },
    },
  },

  ar: {
    form: {
      headers: {
        basicSettings: "الإعدادات الأساسية",
        autoplaySettings: "إعدادات التشغيل التلقائي",
        slidesManagement: "إدارة الشرائح",
        actionButtons: "الإجراءات",
        configuration: "التكوين",
      },

      labels: {
        title: "عنوان عرض الشرائح",
        description: "وصف عرض الشرائح",
        type: "النوع",
        status: "الحالة",
        autoplayEnabled: "تفعيل التشغيل التلقائي",
        autoplayInterval: "فاصل التشغيل التلقائي (مللي ثانية)",
        selectSlides: "اختر الشرائح للإضافة",
        totalSlides: "إجمالي الشرائح",
      },

      placeholders: {
        title: "مثال: بانر الصفحة الرئيسية",
        description: "وصف مختصر لعرض الشرائح",
        searchSlides: "ابحث عن الخدمات، المشاريع، العملاء...",
      },

      // Select / enum options
      types: {
        HERO: "بانر رئيسي",
        SERVICES: "عرض خدمات",
        PROJECTS: "عرض مشاريع",
        CLIENTS: "شعارات العملاء",
        TEAM: "أعضاء الفريق",
        TESTIMONIALS: "شهادات العملاء",
        CUSTOM: "مخصص",
        optionsArray: () =>
          [
            { value: "HERO", label: "بانر رئيسي" },
            { value: "SERVICES", label: "عرض خدمات" },
            { value: "PROJECTS", label: "عرض مشاريع" },
            { value: "CLIENTS", label: "شعارات العملاء" },
            { value: "TEAM", label: "أعضاء الفريق" },
            { value: "TESTIMONIALS", label: "شهادات العملاء" },
            { value: "CUSTOM", label: "مخصص" },
          ] as const,
      },

      statuses: {
        ACTIVE: "نشط",
        INACTIVE: "غير نشط",
        DRAFT: "مسودة",
      },

      composition: {
        title: "التركيب",
        arrange: "ترتيب",
      },

      buttons: {
        save: "حفظ عرض الشرائح",
        saving: "جاري الحفظ...",
        previewShow: "عرض المعاينة",
        previewHide: "إخفاء المعاينة",
        arrange: "ترتيب",
        cancel: "إلغاء",
      },

      previews: {
        loading: "جارٍ الحفظ...",
        saved: "تم حفظ عرض الشرائح بنجاح",
      },

      validation: {
        requiredTitle: "يجب إدخال عنوان عرض الشرائح",
        titleLength: "يجب أن يكون العنوان 3 أحرف على الأقل",
        requiredDescription:
          "الوصف مطلوب ويجب أن يكون بين 10 و500 حرفًا",
        minSlides: "الرجاء إضافة شريحة واحدة على الأقل",
        minInterval: "يجب أن يكون فاصل التشغيل التلقائي 1000 مللي ثانية على الأقل",
      },

      toasts: {
        validationError: (msg: string) => `خطأ في التحقق: ${msg}`,
        savedSuccess: "تم حفظ عرض الشرائح بنجاح",
        saveFailed: "فشل حفظ عرض الشرائح",
      },
        badges: {
      active: "نشط",
      inactive: "غير نشط",
      autoplay: "تشغيل تلقائي",
      manual: "يدوي",
    },

      previewDialog: {
        title: "المعاينة",
        close: "إغلاق",
      },

      empty: {
        noSlides: "لا توجد شرائح محددة",
      },

      misc: {
        secondsLabel: (ms: number) => `${(ms / 1000).toFixed(1)} ثانية`,
        totalSlidesLabel: (n: number) => `${n} شريحة${n === 1 ? "" : "ـ"}`,
      },
    },
  },
} as const


export const newSlideshowPageI18n = {
  en: {
    header: {
      title: "Create Slideshow",
      subtitle: "Add a new slideshow to your website",
      back: "Back to Slideshows",
    },
  },

  ar: {
    header: {
      title: "إنشاء عرض شرائح",
      subtitle: "إضافة عرض شرائح جديد إلى موقعك",
      back: "العودة إلى عروض الشرائح",
    },
  },
} as const
