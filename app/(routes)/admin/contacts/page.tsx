import { ContactsTable } from "@/components/admin/contacts-table"
import { ContactsStats } from "@/components/admin/contacts-stats"

export default function ContactsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Inquiries</h1>
        <p className="text-muted-foreground">Manage and respond to customer inquiries</p>
      </div>

      <ContactsStats />

      <ContactsTable />
    </div>
  )
}
