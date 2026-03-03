export const projectFormI18n = {
  en: {
    page: {
      newProject: {
        title: "Create Project",
        subtitle: "Add a new project to your portfolio",
        back: "Back to Projects",
      },
      editProject: {
        title: "Edit",
        highlight: "Project",
        subtitle: "Update your project details, technologies, and services",
      },
    },
    sectionTitles: {
      projectInfo: "Project Information",
      clientInfo: "Client Information",
      linksTimeline: "Links & Timeline",
      technologies: "Technologies",
      services: "Services",
    },

    fields: {
      title: "Project Title",
      shortDescription: "Short Description",
      fullDescription: "Full Project Description",
      featured: "Featured Project",
      featuredHint: "Display this project prominently",

      clientName: "Client Name",
      clientCompany: "Client Company",

      projectUrl: "Project URL",
      githubUrl: "GitHub URL",
      status: "Status",
      startDate: "Start Date",
      endDate: "End Date",
      imageLabel: "Project Image",
    },
    validation: {
      titleMin: "Title must be at least 3 characters",
      titleMax: "Title must be less than 200 characters",
      descriptionMin: "Description must be at least 10 characters",
      descriptionMax: "Description must be less than 500 characters",
      richDescriptionMin: "Full description must be at least 10 characters",
      invalidUrl: "Invalid project URL",
      invalidGithubUrl: "Invalid GitHub URL",
    },

    placeholders: {
      title: "E-Commerce Platform",
      shortDescription: "Brief project overview",
      fullDescription: "Detailed project description...",
      clientName: "John Doe",
      clientCompany: "ABC Corporation",
      projectUrl: "https://example.com",
      githubUrl: "https://github.com/...",
      searchTech: "Search technologies...",
      searchServices: "Search Services...",
      selectCategory: "Select a category",
    },

    status: {
      PLANNING: "Planning",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
      ON_HOLD: "On Hold",
    },

    technologies: {
      addNew: "Add New Technology",
      selected: "Selected Technologies",
      browseSkills: "Browse Skills",
      byCategory: "By Category",
      recent: "Recent technologies",
      searchResults: (q: string) => `Search results for "${q}"`,
      addAll: "Add All",
      emptyCategory: (cat: string) => `No technologies in ${cat}`,
      clear: "Clear",
    },

    actions: {
      cancel: "Cancel",
      create: "Create Project",
      update: "Update Project",
      loading: "Loading...",
    },

    toast: {
      created: "Project created successfully!",
      failed: "Failed to create project",
    },
  },

  ar: {
    page: {
      newProject: {
        title: "إنشاء مشروع",
        subtitle: "إضافة مشروع جديد إلى معرض أعمالك",
        back: "العودة إلى المشاريع",
      },

      editProject: {
        title: "تعديل",
        highlight: "المشروع",
        subtitle: "تحديث تفاصيل المشروع والتقنيات والخدمات",
      },
    },

    sectionTitles: {
      projectInfo: "معلومات المشروع",
      clientInfo: "معلومات العميل",
      linksTimeline: "الروابط والمدة الزمنية",
      technologies: "التقنيات",
      services: "الخدمات",
    },

    fields: {
      title: "عنوان المشروع",
      shortDescription: "وصف مختصر",
      fullDescription: "الوصف الكامل للمشروع",
      featured: "مشروع مميز",
      featuredHint: "عرض هذا المشروع بشكل بارز",

      clientName: "اسم العميل",
      clientCompany: "شركة العميل",

      projectUrl: "رابط المشروع",
      githubUrl: "رابط GitHub",
      status: "الحالة",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      imageLabel: "صورة المشروع",
    },
    validation: {
      titleMin: "العنوان يجب أن يكون 3 أحرف على الأقل",
      titleMax: "العنوان يجب أن يكون أقل من 200 حرف",
      descriptionMin: "الوصف يجب أن يكون 10 أحرف على الأقل",
      descriptionMax: "الوصف يجب أن يكون أقل من 500 حرف",
      richDescriptionMin: "الوصف الكامل يجب أن يكون 10 أحرف على الأقل",
      invalidUrl: "رابط المشروع غير صالح",
      invalidGithubUrl: "رابط GitHub غير صالح",
    },

    placeholders: {
      title: "منصة تجارة إلكترونية",
      shortDescription: "نظرة عامة مختصرة",
      fullDescription: "وصف تفصيلي للمشروع...",
      clientName: "أحمد محمد",
      clientCompany: "شركة ABC",
      projectUrl: "https://example.com",
      githubUrl: "https://github.com/...",
      searchTech: "ابحث عن التقنيات...",
      searchServices: "ابحث عن الخدمات...",
      selectCategory: "اختر فئة",
    },

    status: {
      PLANNING: "تخطيط",
      IN_PROGRESS: "قيد التنفيذ",
      COMPLETED: "مكتمل",
      ON_HOLD: "متوقف",
    },

    technologies: {
      addNew: "إضافة تقنية جديدة",
      selected: "التقنيات المختارة",
      browseSkills: "تصفح المهارات",
      byCategory: "حسب الفئة",
      recent: "التقنيات الأخيرة",
      searchResults: (q: string) => `نتائج البحث عن "${q}"`,
      addAll: "إضافة الكل",
      emptyCategory: (cat: string) => `لا توجد تقنيات في ${cat}`,
      clear: "مسح",
    },

    actions: {
      cancel: "إلغاء",
      create: "إنشاء مشروع",
      update: "تحديث المشروع",
      loading: "جاري التحميل...",
    },

    toast: {
      created: "تم إنشاء المشروع بنجاح",
      failed: "فشل إنشاء المشروع",
    },
  },
} as const;

export const projectEditorI18n = {
  en: {
    editProject: {
      // header
      title: "Edit",
      highlight: "Project",
      subtitle: "Update your project details, technologies, and services",

      // steps
      steps: ["Main Info", "Technologies", "Services"],

      // section headings (same as the component layout)
      headings: {
        projectInfo: "Project Information",
        clientInfo: "Client Information",
        linksTimeline: "Links & Timeline",
        technologies: "Technologies",
        services: "Services",
        projectImage: "Project Image",
      },

      // field labels & hints
      fields: {
        title: "Project Title",
        shortDescription: "Short Description",
        fullDescription: "Full Description",
        featured: "Featured Project",
        featuredHint: "Display prominently",
        clientName: "Client Name",
        clientCompany: "Client Company",
        projectUrl: "Project URL",
        githubUrl: "GitHub URL",
        status: "Status",
        startDate: "Start Date",
        endDate: "End Date",
      },

      placeholders: {
        title: "E-Commerce Platform",
        shortDescription: "Brief overview",
        fullDescription: "Detailed description",
        clientName: "John Doe",
        clientCompany: "ABC Corp",
        projectUrl: "https://example.com",
        githubUrl: "https://github.com/...",
        searchTech: "Search technologies...",
        selectCategory: "Select category",
        searchServices: "Search Services...",
      },

      // status options (used in Select)
      status: {
        PLANNING: "Planning",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
        ON_HOLD: "On Hold",
      },

      // technologies UI strings
      technologiesUI: {
        addButton: "Add Technology",
        selectedCount: (n: number) => `Selected Technologies (${n})`,
        recent: "Recent technologies",
        resultsFor: (q: string) => `Results for "${q}"`,
        browseSkills: "Browse Skills",
        byCategory: "By Category",
        addAll: "Add All",
        clearAll: "Clear All",
        noTechsInCategory: (cat: string) => `No technologies in ${cat}`,
        addFromBrowser: "Add",
      },

      // services / slideshow area
      servicesUI: {
        titleForProject: (pTitle: string) => `Add services to this ${pTitle}`,
        searchPlaceholder: "Search Services...",
        empty: "No services selected",
      },

      // tech search dialog
      techDialog: {
        placeholder: "Search technologies...",
        resultsFor: (q: string) => `Results for "${q}"`,
        noResults: "No technologies found",
        addAll: "Add All",
        close: "Close",
      },

      // actions / buttons
      actions: {
        previous: "Previous",
        next: "Next",
        save: "Save Changes",
        saving: "Saving...",
        cancel: "Cancel",
        clearAll: "Clear All",
      },

      // toast messages
      toast: {
        updated: "Project updated successfully!",
        failed: "Failed to update project",
        loadFailed: "Failed to load project",
      },

      // loader/empty
      loading: "Loading...",
      empty: "Nothing to show",
    },
  },

  ar: {
    editProject: {
      // header
      title: "تعديل",
      highlight: "المشروع",
      subtitle: "تحديث تفاصيل المشروع والتقنيات والخدمات",

      // steps
      steps: ["المعلومات الرئيسية", "التقنيات", "الخدمات"],

      // section headings
      headings: {
        projectInfo: "معلومات المشروع",
        clientInfo: "معلومات العميل",
        linksTimeline: "الروابط والمدة الزمنية",
        technologies: "التقنيات",
        services: "الخدمات",
        projectImage: "صورة المشروع",
      },

      // field labels & hints
      fields: {
        title: "عنوان المشروع",
        shortDescription: "وصف مختصر",
        fullDescription: "الوصف الكامل",
        featured: "مشروع مميز",
        featuredHint: "عرض بشكل بارز",
        clientName: "اسم العميل",
        clientCompany: "شركة العميل",
        projectUrl: "رابط المشروع",
        githubUrl: "رابط GitHub",
        status: "الحالة",
        startDate: "تاريخ البداية",
        endDate: "تاريخ النهاية",
      },

      placeholders: {
        title: "منصة تجارة إلكترونية",
        shortDescription: "نظرة عامة مختصرة",
        fullDescription: "وصف تفصيلي",
        clientName: "أحمد محمد",
        clientCompany: "شركة ABC",
        projectUrl: "https://example.com",
        githubUrl: "https://github.com/...",
        searchTech: "ابحث عن التقنيات...",
        selectCategory: "اختر الفئة",
        searchServices: "ابحث في الخدمات...",
      },

      // status options
      status: {
        PLANNING: "تخطيط",
        IN_PROGRESS: "قيد التنفيذ",
        COMPLETED: "مكتمل",
        ON_HOLD: "متوقف",
      },

      // technologies UI strings
      technologiesUI: {
        addButton: "إضافة تقنية",
        selectedCount: (n: number) => `التقنيات المختارة (${n})`,
        recent: "التقنيات الأخيرة",
        resultsFor: (q: string) => `نتائج البحث عن "${q}"`,
        browseSkills: "تصفح المهارات",
        byCategory: "حسب الفئة",
        addAll: "إضافة الكل",
        clearAll: "مسح الكل",
        noTechsInCategory: (cat: string) => `لا توجد تقنيات في ${cat}`,
        addFromBrowser: "أضف",
      },

      // services / slideshow area
      servicesUI: {
        titleForProject: (pTitle: string) => `أضف خدمات لهذا ${pTitle}`,
        searchPlaceholder: "ابحث في الخدمات...",
        empty: "لا توجد خدمات مختارة",
      },

      // tech search dialog
      techDialog: {
        placeholder: "ابحث عن التقنيات...",
        resultsFor: (q: string) => `نتائج البحث عن "${q}"`,
        noResults: "لم يتم العثور على تقنيات",
        addAll: "إضافة الكل",
        close: "إغلاق",
      },

      // actions / buttons
      actions: {
        previous: "السابق",
        next: "التالي",
        save: "حفظ التغييرات",
        saving: "جاري الحفظ...",
        cancel: "إلغاء",
        clearAll: "مسح الكل",
      },

      // toast messages
      toast: {
        updated: "تم تحديث المشروع بنجاح!",
        failed: "فشل تحديث المشروع",
        loadFailed: "فشل تحميل المشروع",
      },

      // loader/empty
      loading: "جارٍ التحميل...",
      empty: "لا يوجد شيء للعرض",
    },
  },
} as const;

export const projectsTableI18n = {
  en: {
    header: {
      title: "Projects",
      subtitle: "Manage your portfolio projects and case studies",
      addButton: "Add Project",
    },
    table: {
      loading: "Loading projects...",
      loadingMore: "Loading more projects...",
      allLoaded: (n: number) => `All ${n} projects loaded`,

      empty: {
        title: "No projects found",
        description: "Get started by creating your first project.",
      },

      error: {
        title: "Failed to load projects",
        description:
          "There was an error loading your projects. Please try again later.",
      },

      // badges & labels
      badges: {
        featured: "Featured",
        technologies: "Technologies",
        client: "Client",
        updated: (date: string) => `Updated ${date}`,
      },

      // status labels (display only)
      status: {
        PLANNING: "Planning",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
        ON_HOLD: "On Hold",
      },

      // dropdown actions
      actions: {
        view: "View Details",
        edit: "Edit Project",
        visit: "Visit Website",
        github: "View on GitHub",
        delete: "Delete Project",
      },

      // delete dialog
      deleteDialog: {
        title: "Delete Project",
        description:
          "Are you sure you want to delete this project? This action cannot be undone.",
        success: "Project deleted successfully!",
        failed: "Failed to delete project. Please try again.",
      },

      // misc
      datesArrow: "→",
    },
  },

  ar: {
    header: {
      title: "المشاريع",
      subtitle: "إدارة مشاريع معرض الأعمال ودراسات الحالة",
      addButton: "إضافة مشروع",
    },
    table: {
      // empty & error states
      loading: "جارٍ تحميل المشاريع...",
      loadingMore: "جارٍ تحميل المزيد من المشاريع...",
      allLoaded: (n: number) => `تم تحميل جميع المشاريع (${n})`,

      empty: {
        title: "لا توجد مشاريع",
        description: "ابدأ بإنشاء أول مشروع لك.",
      },

      error: {
        title: "فشل تحميل المشاريع",
        description:
          "حدث خطأ أثناء تحميل المشاريع. يرجى المحاولة مرة أخرى لاحقًا.",
      },

      // badges & labels
      badges: {
        featured: "مميز",
        technologies: "التقنيات",
        client: "العميل",
        updated: (date: string) => `آخر تحديث ${date}`,
      },

      // status labels
      status: {
        PLANNING: "تخطيط",
        IN_PROGRESS: "قيد التنفيذ",
        COMPLETED: "مكتمل",
        ON_HOLD: "متوقف",
      },

      // dropdown actions
      actions: {
        view: "عرض التفاصيل",
        edit: "تعديل المشروع",
        visit: "زيارة الموقع",
        github: "عرض على GitHub",
        delete: "حذف المشروع",
      },

      // delete dialog
      deleteDialog: {
        title: "حذف المشروع",
        description:
          "هل أنت متأكد أنك تريد حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.",
        success: "تم حذف المشروع بنجاح!",
        failed: "فشل حذف المشروع. حاول مرة أخرى.",
      },

      // misc
      datesArrow: "→",
    },
  },
} as const;

export const projectDetailsI18n = {
  en: {
    breadcrumb: {
      projects: "Projects",
    },

    actions: {
      back: "Back to Projects",
      visitSite: "Visit Site",
      repository: "Repository",
      edit: "Edit",
      viewDetails: "View Details",
      delete: "Delete",
    },

    states: {
      notFound: {
        title: "Project Not Found",
        description: "The project you're looking for doesn't exist.",
      },
      noLinks: "No external links",
    },

    badges: {
      featured: "Featured",
      active: "Active",
      order: (n: number) => `Order #${n}`,
      clientCompany: "Client Company",


    },

    sections: {
      about: {
        title: "About This Project",
        subtitle: "Overview and details",
      },
      technologies: {
        title: "Technology Stack",
        used: (n: number) =>
          `${n} ${n === 1 ? "technology" : "technologies"} used`,
      },
      services: {
        title: "Related Services",
        associated: (n: number) =>
          `${n} ${n === 1 ? "service" : "services"} associated`,
      },
      client: "Client",
      timeline: {
        title: "Timeline",
        subtitle: "Project duration",
        start: "Start Date",
        end: "End Date",
      },
      links: {
        title: "Quick Links",
        subtitle: "External resources",
      },
      metadata: {
        title: "Metadata",
        subtitle: "System info",
        created: "Created",
        updated: "Last Updated",
        projectId: "Project ID",
        imageId: "Image ID",
      },
      image: {
        title: "Image Details",
        subtitle: "Asset information",
        dimensions: "Dimensions",
        size: "File Size",
        format: "Format",
        type: "Type",
        filename: "Filename",
        fileHash: "File Hash",
        blurHash: "Blur Hash",
        storageKey: "Storage Key",
      },
    },

    status: {
      PLANNING: "Planning",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
      ON_HOLD: "On Hold",
    },

    dialog: {
      delete: {
        title: "Delete Project",
        description:
          "Are you sure you want to delete this project? This action cannot be undone.",
        success: "Project deleted successfully!",
        failed: "Failed to delete project. Please try again.",
      },
    },

    clipboard: {
      copied: "Copied to clipboard",
    },
  },

  ar: {
    breadcrumb: {
      projects: "المشاريع",
    },

    actions: {
      back: "العودة إلى المشاريع",
      visitSite: "زيارة الموقع",
      repository: "المستودع",
      edit: "تعديل",
      viewDetails: "عرض التفاصيل",
      delete: "حذف",
    },

    states: {
      notFound: {
        title: "المشروع غير موجود",
        description: "المشروع الذي تبحث عنه غير موجود.",
      },
      noLinks: "لا توجد روابط خارجية",
    },

    status: {
      PLANNING: "تخطيط",
      IN_PROGRESS: "قيد التنفيذ",
      COMPLETED: "مكتمل",
      ON_HOLD: "متوقف",
    },
    badges: {
      featured: "مميز",
      active: "نشط",
      order: (n: number) => `الترتيب #${n}`,
     clientCompany: "شركة العميل",

    },

    sections: {
      about: {
        title: "عن المشروع",
        subtitle: "نظرة عامة وتفاصيل",
      },
      technologies: {
        title: "التقنيات المستخدمة",
        used: (n: number) => `${n} ${n === 1 ? "تقنية" : "تقنيات"} مستخدمة`,
      },
      services: {
        title: "الخدمات المرتبطة",
        associated: (n: number) => `${n} ${n === 1 ? "خدمة" : "خدمات"} مرتبطة`,
      },
      client: "العميل",
      timeline: {
        title: "المدة الزمنية",
        subtitle: "مدة تنفيذ المشروع",
        start: "تاريخ البداية",
        end: "تاريخ النهاية",
      },
      links: {
        title: "روابط سريعة",
        subtitle: "موارد خارجية",
      },
      metadata: {
        title: "البيانات",
        subtitle: "معلومات النظام",
        created: "تاريخ الإنشاء",
        updated: "آخر تحديث",
        projectId: "معرّف المشروع",
        imageId: "معرّف الصورة",
      },
      image: {
        title: "تفاصيل الصورة",
        subtitle: "معلومات الملف",
        dimensions: "الأبعاد",
        size: "حجم الملف",
        format: "الصيغة",
        type: "النوع",
        filename: "اسم الملف",
        fileHash: "بصمة الملف",
        blurHash: "Blur Hash",
        storageKey: "مفتاح التخزين",
      },
    },

    dialog: {
      delete: {
        title: "حذف المشروع",
        description:
          "هل أنت متأكد أنك تريد حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.",
        success: "تم حذف المشروع بنجاح!",
        failed: "فشل حذف المشروع. حاول مرة أخرى.",
      },
    },

    clipboard: {
      copied: "تم النسخ إلى الحافظة",
    },
  },
} as const;
