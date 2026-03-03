// i18n/team.ts
export const tTeamPagei18n = {
  en: {
    title: "Team Members",
    description: "Manage your company's team members and their profiles",
    addMember: "Add Team Member",
  },
  ar: {
    title: "أعضاء الفريق",
    description: "إدارة أعضاء فريق الشركة وملفاتهم الشخصية",
    addMember: "إضافة عضو جديد",
  },
} as const;

// i18n/team-member-detail.ts
export const tTeamMemberDetail = {
  en: {
    notFound: {
      title: "Team Member Not Found",
      description: "The team member you're looking for doesn't exist.",
      back: "Back to Team",
    },

    toast: {
      deleteSuccess: "Member deleted successfully!",
      deleteError: "Failed to delete member. Please try again.",
      copied: "Copied to clipboard",
    },
    header: {
      team: "Team",
      edit: "Edit",
    },

    status: {
      active: "Active",
      inactive: "Inactive",
      featured: "Featured",
    },

    sections: {
      contact: "Contact",
      social: "Social Media",
      about: "About",
      biography: "Biography",
      imageDetails: "Image Details",
      imageDescription: "Profile photo information",
      memberInfo: "Member Info",
      quickDetails: "Quick details",
      metadata: "Metadata",
      systemInfo: "System info",
      quickActions: "Quick Actions",
    },

    labels: {
      email: "Email",
      phone: "Phone",
      dimensions: "Dimensions",
      fileSize: "File Size",
      format: "Format",
      type: "Type",
      filename: "Filename",
      fileHash: "File Hash",
      blurHash: "Blur Hash",
      storageKey: "Storage Key",
      status: "Status",
      featured: "Featured",
      displayOrder: "Display Order",
      memberId: "Member ID",
      created: "Created",
      lastUpdated: "Last Updated",
      imageId: "Image ID",
      yes: "Yes",
      no: "No",
    },

    actions: {
      editMember: "Edit Member",
      deleteMember: "Delete Member",
      deleteTitle: "Delete Member",
      deleteDescription:
        "Are you sure you want to delete this Member? This action cannot be undone.",
    },

    misc: {
      copied: "Copied to clipboard",
    },
  },

  ar: {
    notFound: {
      title: "عضو الفريق غير موجود",
      description: "عضو الفريق الذي تبحث عنه غير موجود.",
      back: "العودة إلى الفريق",
    },

    header: {
      team: "الفريق",
      edit: "تعديل",
    },

    toast: {
      deleteSuccess: "تم حذف العضو بنجاح",
      deleteError: "فشل حذف العضو. يرجى المحاولة مرة أخرى",
      copied: "تم النسخ إلى الحافظة",
    },
    status: {
      active: "نشط",
      inactive: "غير نشط",
      featured: "مميز",
    },

    sections: {
      contact: "التواصل",
      social: "وسائل التواصل",
      about: "نبذة",
      biography: "السيرة الذاتية",
      imageDetails: "تفاصيل الصورة",
      imageDescription: "معلومات الصورة الشخصية",
      memberInfo: "معلومات العضو",
      quickDetails: "تفاصيل سريعة",
      metadata: "البيانات الوصفية",
      systemInfo: "معلومات النظام",
      quickActions: "إجراءات سريعة",
    },

    labels: {
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      dimensions: "الأبعاد",
      fileSize: "حجم الملف",
      format: "الصيغة",
      type: "النوع",
      filename: "اسم الملف",
      fileHash: "بصمة الملف",
      blurHash: "Blur Hash",
      storageKey: "مفتاح التخزين",
      status: "الحالة",
      featured: "مميز",
      displayOrder: "ترتيب العرض",
      memberId: "معرّف العضو",
      created: "تاريخ الإنشاء",
      lastUpdated: "آخر تحديث",
      imageId: "معرّف الصورة",
      yes: "نعم",
      no: "لا",
    },

    actions: {
      editMember: "تعديل العضو",
      deleteMember: "حذف العضو",
      deleteTitle: "حذف العضو",
      deleteDescription:
        "هل أنت متأكد من حذف هذا العضو؟ لا يمكن التراجع عن هذا الإجراء.",
    },

    misc: {
      copied: "تم النسخ إلى الحافظة",
    },
  },
} as const;

export const tTeamMemberForm = {
  en: {
    titles: {
      basicInfo: "Basic Information",
      profileImage: "Profile Image",
      socialLinks: "Social Media Links",
    },

    labels: {
      fullName: "Full Name",
      position: "Position",
      biography: "Biography",
      email: "Email",
      phone: "Phone",
      teamMemberPhoto: "Team Member Photo",
      clickToUpload: "Click to upload photo",
      uploadFormats: "PNG, JPG, WebP up to 10MB",
      recommended: "Recommended: Square image (1:1 ratio) for best results",
      linkedin: "LinkedIn Profile",
      github: "GitHub Profile",
      twitter: "Twitter Profile",
      activeMember: "Active Team Member",
      activeNote: "Inactive members won't be displayed on the website",
      featuredMember: "Featured Team Member",
      featuredNote: "Featured members appear prominently on the team page",
      cancel: "Cancel",
      saving: "Saving...",
      addMember: "Add Team Member",
      updateMember: "Update Team Member",
    },

    placeholders: {
      name: "John Doe",
      position: "Senior Developer",
      bio: "Brief bio about the team member...",
      email: "john@example.com",
      phone: "+1 (555) 000-0000",
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      twitter: "https://twitter.com/johndoe",
    },

    fileErrors: {
      fileTooLargeTitle: "File too large",
      fileTooLargeDesc: "Please upload an image smaller than 10MB",
      invalidTypeTitle: "Invalid file type",
      invalidTypeDesc: "Please upload an image file",
    },

    validation: {
      nameRequired: "Name is required",
      nameTooLong: "Name is too long",
      positionRequired: "Position is required",
      positionTooLong: "Position is too long",
      invalidEmail: "Invalid email address",
      invalidLinkedIn: "Invalid LinkedIn URL",
      invalidGithub: "Invalid GitHub URL",
      invalidTwitter: "Invalid Twitter URL",
      fileTooLarge: "File too large",
      fileTooLargeDesc: "Please upload an image smaller than 10MB",
      invalidFileType: "Invalid file type",
      invalidFileTypeDesc: "Please upload an image file",
    },

    toast: {
      created: "Team member created successfully",
      updated: "Team member updated successfully",
      errorTitle: "Error",
      errorDescription: "Failed to save team member. Please try again.",
      successTitle: "Success",

      saveFailed: "Failed to save team member. Please try again.",
    },
  },

  ar: {
    titles: {
      basicInfo: "المعلومات الأساسية",
      profileImage: "الصورة الشخصية",
      socialLinks: "روابط وسائل التواصل",
    },

    labels: {
      fullName: "الاسم الكامل",
      position: "المنصب",
      biography: "السيرة الذاتية",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      teamMemberPhoto: "صورة عضو الفريق",
      clickToUpload: "اضغط لرفع الصورة",
      uploadFormats: "PNG, JPG, WebP حتى 5 ميغابايت",
      recommended: "مستحسن: صورة مربعة (نسبة 1:1) للحصول على أفضل نتيجة",
      linkedin: "حساب LinkedIn",
      github: "حساب GitHub",
      twitter: "حساب Twitter",
      activeMember: "عضو نشط",
      activeNote: "الأعضاء غير النشطين لن يظهروا على الموقع",
      featuredMember: "عضو مميز",
      featuredNote: "الأعضاء المميزون يظهرون بشكل بارز في صفحة الفريق",
      cancel: "إلغاء",
      saving: "جاري الحفظ...",
      addMember: "إضافة عضو",
      updateMember: "تحديث العضو",
    },

    placeholders: {
      name: "أحمد علي",
      position: "مطور أول",
      bio: "نبذة مختصرة عن العضو...",
      email: "ahmed@example.com",
      phone: "+20 10 0000 0000",
      linkedin: "https://linkedin.com/in/ahmed",
      github: "https://github.com/ahmed",
      twitter: "https://twitter.com/ahmed",
    },

    fileErrors: {
      fileTooLargeTitle: "حجم الملف كبير جدًا",
      fileTooLargeDesc: "يرجى رفع صورة أصغر من 5 ميغابايت",
      invalidTypeTitle: "نوع الملف غير صالح",
      invalidTypeDesc: "يرجى رفع ملف صورة",
    },

    validation: {
      nameRequired: "الاسم مطلوب",
      nameTooLong: "الاسم طويل جدًا",
      positionRequired: "المنصب مطلوب",
      positionTooLong: "المنصب طويل جدًا",
      invalidEmail: "بريد إلكتروني غير صالح",
      invalidLinkedIn: "رابط LinkedIn غير صالح",
      invalidGithub: "رابط GitHub غير صالح",
      invalidTwitter: "رابط Twitter غير صالح",
      fileTooLarge: "حجم الملف كبير",
      fileTooLargeDesc: "يرجى رفع صورة بحجم أقل من 5 ميجابايت",
      invalidFileType: "نوع الملف غير صالح",
      invalidFileTypeDesc: "يرجى رفع ملف صورة",
    },

    toast: {
      created: "تم إنشاء عضو الفريق بنجاح",
      updated: "تم تحديث عضو الفريق بنجاح",
      errorTitle: "خطأ",
      errorDescription: "فشل حفظ بيانات العضو. يرجى المحاولة مرة أخرى.",
      successTitle: "تم بنجاح",

      saveFailed: "فشل حفظ عضو الفريق. يرجى المحاولة مرة أخرى",
    },
  },
}  satisfies Record<"en" | "ar", TeamMemberFormI18n>



export interface TeamMemberFormI18n {
  titles: {
    basicInfo: string
    profileImage: string
    socialLinks: string
  }

  labels: {
    teamMemberPhoto: string
    fullName: string
    position: string
    biography: string
    email: string
    phone: string
    clickToUpload: string
    uploadFormats: string
    recommended: string
    linkedin: string
    github: string
    twitter: string
    activeMember: string
    activeNote: string
    featuredMember: string
    featuredNote: string
    cancel: string
    saving: string
    addMember: string
    updateMember: string
  }

  placeholders: {
    name: string
    position: string
    bio: string
    email: string
    phone: string
    linkedin: string
    github: string
    twitter: string
  }

  fileErrors: {
    fileTooLargeTitle: string
    fileTooLargeDesc: string
    invalidTypeTitle: string
    invalidTypeDesc: string
  }

  validation: {
    nameRequired: string
    nameTooLong: string
    positionRequired: string
    positionTooLong: string
    invalidEmail: string
    invalidLinkedIn: string
    invalidGithub: string
    invalidTwitter: string
    fileTooLarge: string
    fileTooLargeDesc: string
    invalidFileType: string
    invalidFileTypeDesc: string
  }

  toast: {
    created: string
    updated: string
    errorTitle: string
    errorDescription: string
    successTitle: string
    saveFailed: string
  }
}


export const tTeamPageHeaderNew = {
  en: {
    title: "Add Team Member",
    description: "Add a new member to your team",
  },
  ar: {
    title: "إضافة عضو جديد",
    description: "أضف عضوًا جديدًا إلى فريقك",
  },
} as const
