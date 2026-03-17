// export interface ContactsI18n {

//   title: string;
//   subtitle: string;
//   stats: {
//     totalInquiries: string;
//     pending: string;
//     resolved: string;
//     urgent: string;
//     thisWeek: string;
//     ofTotal: string;
//     resolutionRate: string;
//     requiresAttention: string;
//     allClear: string;
//   };
//   table: {
//     searchPlaceholder: string;
//     filters: string;
//     clearAll: string;
//     reset: string;
//     applyFilters: string;
//     headers: {
//       contact: string;
//       subject: string;
//       message: string;
//       priority: string;
//       status: string;
//       category: string;
//       date: string;
//       actions: string;
//     };
//     empty: {
//       noContacts: string;
//       noMatchingContacts: string;
//       clearFilters: string;
//     };
//     actions: {
//       viewDetails: string;
//       reply: string;
//       markResolved: string;
//       delete: string;
//     };
//     pagination: {
//       showing: string;
//       of: string;
//       items: string;
//     };
//     filterLabels: {
//       status: string;
//       priority: string;
//       category: string;
//     };
//     statuses: {
//       all: string;
//       pending: string;
//       inProgress: string;
//       resolved: string;
//     };
//     priorities: {
//       all: string;
//       low: string;
//       medium: string;
//       high: string;
//       urgent: string;
//     };
//     categories: {
//       all: string;
//       general: string;
//       support: string;
//       sales: string;
//       feedback: string;
//     };
//   };
// }

export const tContacts = {
  en: {
    title: "Contact Inquiries",
    subtitle: "Manage and respond to customer inquiries",
    stats: {
      totalInquiries: "Total Inquiries",
      pending: "Pending",
      resolved: "Resolved",
      urgent: "Urgent",
      thisWeek: "this week",
      ofTotal: "of total",
      resolutionRate: "resolution rate",
      requiresAttention: "Requires attention",
      allClear: "All clear",
    },
    table: {
      searchPlaceholder: "Search contacts by name, email, company, subject...",
      filters: "Filters",
      clearAll: "Clear All",
      reset: "Reset",
      applyFilters: "Apply Filters",
      headers: {
        contact: "Contact",
        subject: "Subject",
        message: "Message",
        priority: "Priority",
        status: "Status",
        category: "Category",
        date: "Date",
        actions: "Actions",
      },
      empty: {
        noContacts: "No contacts found",
        noMatchingContacts: "No contacts found matching your filters",
        clearFilters: "Clear filters to see all contacts",
      },
      actions: {
        viewDetails: "View Details",
        reply: "Reply",
        markResolved: "Mark Resolved",
        delete: "Delete",
      },
      pagination: {
        showing: "Showing page",
        of: "of",
        items: "total items",
      },
      filterLabels: {
        status: "Status",
        priority: "Priority",
        category: "Category",
      },
      statuses: {
        all: "All statuses",
        pending: "Pending",
        inProgress: "In Progress",
        resolved: "Resolved",
        new: "New",
        read: "Read",
        closed: "Closed",
      },
      priorities: {
        all: "All priorities",
        low: "Low",
        medium: "Medium",
        high: "High",
        urgent: "Urgent",
      },
      categories: {
        all: "All categories",
        general: "General",
        support: "Support",
        sales: "Sales",
        feedback: "Feedback",
      },
    },
    details: {
      header: "Contact Details",
      subheader: "View and manage contact inquiry",
      replySent: "Reply Sent",
      from: "From",
      sendReply: {
        title: "Send Reply",
        description: "Compose your response to",
        subject: "Subject",
        subjectPlaceholder: "Re: Your inquiry",
        message: "Message",
        messagePlaceholder: "Type your response here...",
        send: "Send Reply",
        sending: "Sending...",
        cancel: "Cancel",
        replyToContact: "Reply to Contact",
      },
      internalNotes: {
        title: "Internal Notes",
        description:
          "Add private notes about this contact (not visible to customer)",
        placeholder: "Add your notes here...",
        save: "Save Notes",
      },
      info: {
        title: "Contact Information",
        name: "Name",
        email: "Email",
        phone: "Phone",
        company: "Company",
      },
      manage: {
        title: "Manage Contact",
        status: "Status",
        priority: "Priority",
      },
      additional: {
        title: "Additional Details",
        category: "Category",
        budget: "Budget",
        timeline: "Timeline",
        views: "Views",
        source: "Source",
        ipAddress: "IP Address",
      },
      toasts: {
        successReply: "Reply sent successfully!",
        errorReply: "Failed to send reply. Please try again.",
        successStatus: "Status updated successfully! to ",
        errorStatus: "Failed to update status. Please try again.",
        successPriority: "Priority updated successfully! to ",
        errorPriority: "Failed to update priority. Please try again.",
        successNotes: "Notes saved successfully!",
        errorNotes: "Failed to save notes. Please try again.",
        confirmDelete: "Are you sure you want to delete this contact?",
        errorDelete: "Failed to delete contact. Please try again.",
      },
      notFound: {
        title: "Contact Not Found",
        description:
          "The contact you're looking for doesn't exist or has been deleted.",
        back: "Back to Contacts",
      },
    },
  },
  ar: {
    title: "استفسارات التواصل",
    subtitle: "إدارة والرد على استفسارات العملاء",
    stats: {
      totalInquiries: "إجمالي الاستفسارات",
      pending: "قيد الانتظار",
      resolved: "تم الحل",
      urgent: "عاجل",
      thisWeek: "هذا الأسبوع",
      ofTotal: "من الإجمالي",
      resolutionRate: "معدل الحل",
      requiresAttention: "يتطلب اهتمامًا",
      allClear: "كل شيء على ما يرام",
    },
    table: {
      searchPlaceholder: "ابحث بالاسم، البريد الإلكتروني، الشركة، الموضوع...",
      filters: "الفلاتر",
      clearAll: "مسح الكل",
      reset: "إعادة ضبط",
      applyFilters: "تطبيق الفلاتر",
      headers: {
        contact: "جهة الاتصال",
        subject: "الموضوع",
        message: "الرسالة",
        priority: "الأولوية",
        status: "الحالة",
        category: "الفئة",
        date: "التاريخ",
        actions: "الإجراءات",
      },
      empty: {
        noContacts: "لم يتم العثور على جهات اتصال",
        noMatchingContacts: "لا توجد جهات اتصال تطابق الفلاتر",
        clearFilters: "امسح الفلاتر لرؤية كل جهات الاتصال",
      },
      actions: {
        viewDetails: "عرض التفاصيل",
        reply: "رد",
        markResolved: "تحديد كمحلول",
        delete: "حذف",
      },
      pagination: {
        showing: "عرض الصفحة",
        of: "من",
        items: "إجمالي العناصر",
      },
      filterLabels: {
        status: "الحالة",
        priority: "الأولوية",
        category: "الفئة",
      },
      statuses: {
        all: "كل الحالات",
        pending: "قيد الانتظار",
        inProgress: "قيد التنفيذ",
        resolved: "تم الحل",
        new: "جديد",
        read: "تم القراءة",
        closed: "مغلق",
      },
      priorities: {
        all: "كل الأولويات",
        low: "منخفضة",
        medium: "متوسطة",
        high: "عالية",
        urgent: "عاجل",
      },
      categories: {
        all: "كل الفئات",
        general: "عام",
        support: "دعم",
        sales: "مبيعات",
        feedback: "تعليقات",
      },
    },
    details: {
      header: "تفاصيل جهة الاتصال",
      subheader: "عرض وإدارة استفسار جهة الاتصال",
      replySent: "تم إرسال الرد",
      from: "من",
      sendReply: {
        title: "إرسال رد",
        description: "اكتب ردك على",
        subject: "الموضوع",
        subjectPlaceholder: "رد على: استفسارك",
        message: "الرسالة",
        messagePlaceholder: "اكتب ردك هنا...",
        send: "إرسال الرد",
        sending: "جاري الإرسال...",
        cancel: "إلغاء",
        replyToContact: "الرد على جهة الاتصال",
      },
      internalNotes: {
        title: "ملاحظات داخلية",
        description:
          "إضافة ملاحظات خاصة حول جهة الاتصال هذه (غير مرئية للعميل)",
        placeholder: "أضف ملاحظاتك هنا...",
        save: "حفظ الملاحظات",
      },
      info: {
        title: "معلومات الاتصال",
        name: "الاسم",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        company: "الشركة",
      },
      manage: {
        title: "إدارة جهة الاتصال",
        status: "الحالة",
        priority: "الأولوية",
      },
      additional: {
        title: "تفاصيل إضافية",
        category: "الفئة",
        budget: "الميزانية",
        timeline: "الجدول الزمني",
        views: "المشاهدات",
        source: "المصدر",
        ipAddress: "عنوان IP",
      },
      toasts: {
        successReply: "تم إرسال الرد بنجاح!",
        errorReply: "فشل إرسال الرد. حاول مرة أخرى.",
        successStatus: "تم تحديث الحالة بنجاح إلى ",
        errorStatus: "فشل تحديث الحالة. حاول مرة أخرى.",
        successPriority: "تم تحديث الأولوية بنجاح إلى ",
        errorPriority: "فشل تحديث الأولوية. حاول مرة أخرى.",
        successNotes: "تم حفظ الملاحظات بنجاح!",
        errorNotes: "فشل حفظ الملاحظات. حاول مرة أخرى.",
        confirmDelete: "هل أنت متأكد أنك تريد حذف جهة الاتصال هذه؟",
        errorDelete: "فشل حذف جهة الاتصال. حاول مرة أخرى.",
      },
      notFound: {
        title: "جهة الاتصال غير موجودة",
        description: "جهة الاتصال التي تبحث عنها غير موجودة أو تم حذفها.",
        back: "الرجوع إلى جهات الاتصال",
      },
    },
  },
} as const;
