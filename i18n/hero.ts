export interface LandingHeroI18n {
  loadingMore: string
  allLoaded: string
  header: {
    titleSkeleton: string
    buttonSkeleton: string
    inputSkeleton: string
  }
}

export const Translations_landingHero: Record<'en' | 'ar', LandingHeroI18n> = {
  en: {
    loadingMore: "Loading more services...",
    allLoaded: "All services loaded",
    header: {
      titleSkeleton: "Loading title...",
      buttonSkeleton: "Loading button...",
      inputSkeleton: "Loading input..."
    }
  },
  ar: {
    loadingMore: "جاري تحميل المزيد من الخدمات...",
    allLoaded: "تم تحميل جميع الخدمات",
    header: {
      titleSkeleton: "جاري تحميل العنوان...",
      buttonSkeleton: "جاري تحميل الزر...",
      inputSkeleton: "جاري تحميل الحقل..."
    }
  }
} as const

export const tHeroNew = {
  en: {
    editor: {
      title: "Hero Editor",
      editMode: "Edit Mode",
      preview: "Preview",
      hidePreview: "Hide Preview",
      save: "Save",
      update: "Update",
      saving: "Saving...",
      loadingControls: "Loading controls...",
      loadingPreview: "Loading preview...",
      createSuccess: "Hero section created successfully",
      updateSuccess: "Hero section updated successfully",
      errorSave: "Failed to save hero section",
      errorUpdate: "Failed to update hero section",
    },

    sections: {
      content: "Content",
      background: "Background",
      layout: "Layout",
      typography: "Typography",
      primaryButton: "Primary Button",
      secondaryButton: "Secondary Button",
      options: "Options",
    },

    fields: {
      name: "Section Name",
      title: "Title",
      subtitle: "Subtitle",
      description: "Description",

      backgroundImage: "Background Image",
      uploadImage: "Click to upload image",
      removeImage: "Remove image",

      backgroundColor: "Background Color",
      overlayColor: "Overlay Color",
      overlayOpacity: "Overlay Opacity",

      variant: "Variant",
      alignment: "Alignment",
      minHeight: "Min Height (px)",
      responsiveHeight: "Responsive height",

      titleSize: "Title Size",
      titleColor: "Title Color",
      subtitleColor: "Subtitle Color",
      descriptionColor: "Description Color",

      ctaText: "Button Text",
      ctaUrl: "Button URL",
      ctaVariant: "Button Variant",

      secondaryCtaText: "Secondary Button Text",
      secondaryCtaUrl: "Secondary Button URL",
      secondaryCtaVariant: "Secondary Button Variant",

      showScrollIndicator: "Show scroll indicator",
      isActive: "Is Active",
    },

    variants: {
      CENTERED: "Centered",
      SPLIT: "Split",
      IMAGE_BACKGROUND: "Image Background",
      MINIMAL: "Minimal",
      VIDEO_BACKGROUND: "Video Background",
      FULL_SCREEN: "Full Screen",
    },

    variantDescriptions: {
      FULL_SCREEN: "Full viewport height",
      MINIMAL: "Compact layout",
      DEFAULT: "Standard layout",
    },

    alignments: {
      LEFT: "Left",
      CENTER: "Center",
      RIGHT: "Right",
    },

    buttonVariants: {
      PRIMARY: "Primary",
      SECONDARY: "Secondary",
      GHOST: "Ghost",
      OUTLINE: "Outline",
      LINK: "Link",
    },

    preview: {
      scrollHint: "Scroll to explore",
    },
  },

  ar: {
    editor: {
      title: "محرر الهيرو",
      editMode: "وضع التعديل",
      preview: "معاينة",
      hidePreview: "إخفاء المعاينة",
      save: "حفظ",
      update: "تحديث",
      saving: "جاري الحفظ...",
      loadingControls: "جاري تحميل الإعدادات...",
      loadingPreview: "جاري تحميل المعاينة...",
      createSuccess: "تم إنشاء قسم الهيرو بنجاح",
      updateSuccess: "تم تحديث قسم الهيرو بنجاح",
      errorSave: "فشل حفظ قسم الهيرو",
      errorUpdate: "فشل تحديث قسم الهيرو",
    },

    sections: {
      content: "المحتوى",
      background: "الخلفية",
      layout: "التخطيط",
      typography: "الخطوط",
      primaryButton: "الزر الأساسي",
      secondaryButton: "الزر الثانوي",
      options: "الخيارات",
    },

    fields: {
      name: "اسم القسم",
      title: "العنوان",
      subtitle: "العنوان الفرعي",
      description: "الوصف",

      backgroundImage: "صورة الخلفية",
      uploadImage: "اضغط لرفع صورة",
      removeImage: "إزالة الصورة",

      backgroundColor: "لون الخلفية",
      overlayColor: "لون التراكب",
      overlayOpacity: "شفافية التراكب",

      variant: "النمط",
      alignment: "المحاذاة",
      minHeight: "الارتفاع الأدنى (بكسل)",
      responsiveHeight: "الارتفاع المتجاوب",

      titleSize: "حجم العنوان",
      titleColor: "لون العنوان",
      subtitleColor: "لون العنوان الفرعي",
      descriptionColor: "لون الوصف",

      ctaText: "نص الزر",
      ctaUrl: "رابط الزر",
      ctaVariant: "نمط الزر",

      secondaryCtaText: "نص الزر الثانوي",
      secondaryCtaUrl: "رابط الزر الثانوي",
      secondaryCtaVariant: "نمط الزر الثانوي",

      showScrollIndicator: "إظهار مؤشر التمرير",
      isActive: "مفعل",
    },

    variants: {
      CENTERED: "متمركز",
      SPLIT: "مقسم",
      IMAGE_BACKGROUND: "صورة كخلفية",
      MINIMAL: "بسيط",
      VIDEO_BACKGROUND: "فيديو كخلفية",
      FULL_SCREEN: "ملء الشاشة",
    },

    variantDescriptions: {
      FULL_SCREEN: "ارتفاع كامل للشاشة",
      MINIMAL: "تخطيط مدمج",
      DEFAULT: "تخطيط قياسي",
    },

    alignments: {
      LEFT: "يسار",
      CENTER: "منتصف",
      RIGHT: "يمين",
    },

    buttonVariants: {
      PRIMARY: "أساسي",
      SECONDARY: "ثانوي",
      GHOST: "شفاف",
      OUTLINE: "بإطار",
      LINK: "رابط",
    },

    preview: {
      scrollHint: "مرر للأسفل للاستكشاف",
    },
  },
} as const



export const heroGalleryI18n = {
  en: {
    title: "Hero Sections",
    newHero: "New Hero",

    searchPlaceholder: "Search heroes by name or title...",

    filters: {
      variant: "Filter by variant",
      variantLabel: "Filter by variant",
      statusLabel: "Filter by status",

      allVariants: "All Variants",
      allStatus: "All Status",

      variants: {
        CENTERED: "Centered",
        SPLIT: "Split",
        IMAGE_BACKGROUND: "Image Background",
        MINIMAL: "Minimal",
        VIDEO_BACKGROUND: "Video",
        FULL_SCREEN: "Full Screen",
      },

      status: {
        active: "Active",
        inactive: "Inactive",
      },
    },

    emptyState: {
      title: "No heroes found",
      filteredHint: "Try adjusting your filters or search term",
      emptyHint: "Create your first hero section to get started",
      createHero: "Create Hero",
    },

    loadingMore: "Loading more services...",
    allLoaded: (count: number) => `All ${count} services loaded`,
  },

  ar: {
    title: "أقسام الهيرو",
    newHero: "هيرو جديد",

    searchPlaceholder: "ابحث باسم الهيرو أو العنوان...",

    filters: {
      variant: "تصفية حسب النمط",
      variantLabel: "تصفية حسب النمط",
      statusLabel: "تصفية حسب الحالة",

      allVariants: "كل الأنماط",
      allStatus: "كل الحالات",

      variants: {
        CENTERED: "متمركز",
        SPLIT: "مقسم",
        IMAGE_BACKGROUND: "صورة كخلفية",
        MINIMAL: "بسيط",
        VIDEO_BACKGROUND: "فيديو",
        FULL_SCREEN: "ملء الشاشة",
      },

      status: {
        active: "مفعل",
        inactive: "غير مفعل",
      },
    },

    emptyState: {
      title: "لا يوجد أقسام هيرو",
      filteredHint: "جرّب تغيير البحث أو التصفية",
      emptyHint: "أنشئ أول قسم هيرو للبدء",
      createHero: "إنشاء هيرو",
    },

    loadingMore: "جاري تحميل المزيد...",
    allLoaded: (count: number) => `تم تحميل ${count} خدمة`,
  },
} as const
