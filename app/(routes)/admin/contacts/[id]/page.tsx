"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ArrowLeft,
    Mail,
    Phone,
    Building2,
    User,
    Send,
    CheckCircle,
    Trash2,
    CircleAlert,

} from "lucide-react"
import { useGetContactByIdQuery, useUpdateContactMutation, useReplayContactMutation } from "@/lib/store/api/contact-api"
import { toast } from "sonner"
import { ContactPriority, ContactStatus } from "@/types/schema"
import { useLanguage } from "@/providers/lang"
import { tContacts } from "@/i18n/contacts"

export default function ContactDetailPage() {
    const { currentLang } = useLanguage();
    const t = tContacts[(currentLang?.toLowerCase() as "en" | "ar") || "en"];
    const params = useParams()
    const router = useRouter()
    const contactId = params?.id as string


    const [isReplying, setIsReplying] = useState(false)
    const [replyMessage, setReplyMessage] = useState("")
    const [replySubject, setReplySubject] = useState("")
    const [notes, setNotes] = useState("")
    const [status, setStatus] = useState("")
    const [priority, setPriority] = useState("")

    // Fetch contact data
    const { data: contactData, isLoading } = useGetContactByIdQuery(contactId)
    const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation()
    const [replayContact, { isLoading: isReplaing }] = useReplayContactMutation()

    const contact = contactData?.data

    const handleBack = () => {
        router.push("/admin/contacts")
    }

    const handleSendReply = async () => {
        if (!replyMessage.trim()) return

        try {
            await replayContact({
                contactId: contactId,
                response: replyMessage,
            }).unwrap()

            setIsReplying(false)
            setReplyMessage("")
            setReplySubject("")
            toast.success(t.details.toasts.successReply)
        } catch (error) {
            console.error("Failed to send reply:", error)
            toast.error(t.details.toasts.errorReply)
        }
    }

    const handleUpdateStatus = async (newStatus: string) => {
        try {
            await updateContact({
                contactId: contactId,
                data: {
                    status: newStatus as ContactStatus,
                }
            }).unwrap()
            toast.success(t.details.toasts.successStatus + newStatus)
        } catch (error) {
            toast.error(t.details.toasts.errorStatus)
            console.error("Failed to update status:", error)
        }
    }

    const handleUpdatePriority = async (newPriority: string) => {
        try {
            await updateContact({
                contactId: contactId,
                data: {
                    priority: newPriority as ContactPriority,

                }
            }).unwrap()
            toast.success(t.details.toasts.successPriority + newPriority)
        } catch (error) {
            toast.error(t.details.toasts.errorPriority)
            console.error("Failed to update priority:", error)
        }
    }

    const handleSaveNotes = async () => {
        try {
            await updateContact({
                contactId: contactId,
                data: {
                    notes: notes,
                }
            }).unwrap()
            toast.success(t.details.toasts.successNotes)
        } catch (error) {
            toast.error(t.details.toasts.errorNotes)
            console.error("Failed to save notes:", error)
        }
    }

    const handleDelete = async () => {
        if (confirm(t.details.toasts.confirmDelete)) {
            try {
                // Add delete mutation here

                router.push("/admin/contacts")
            } catch (error) {
                toast.error(t.details.toasts.errorDelete)
                console.error("Failed to delete contact:", error)
            }
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'urgent': return 'destructive'
            case 'high': return 'destructive'
            case 'medium': return 'default'
            case 'low': return 'secondary'
            default: return 'outline'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'resolved': return 'default'
            case 'closed': return 'secondary'
            case 'in_progress': return 'outline'
            case 'read': return 'secondary'
            case 'new': return 'destructive'
            default: return 'outline'
        }
    }

    if (isLoading) {
        return (
            <div className="flex-1 space-y-6 p-8 pt-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-48" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-32 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    if (!contact) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <CircleAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{t.details.notFound.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {t.details.notFound.description}
                        </p>
                        <Button onClick={handleBack}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t.details.notFound.back}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{t.details.header}</h2>
                        <p className="text-muted-foreground">
                            {t.details.subheader}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleUpdateStatus("RESOLVED")}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t.table.actions.markResolved}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t.table.actions.delete}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Contact Message */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle>{contact.subject}</CardTitle>
                                    <CardDescription>
                                        {t.details.from} {contact.name} • {new Date(contact.createdAt).toLocaleString()}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant={getPriorityColor(contact.priority)}>
                                        {t.table.priorities[contact.priority?.toLowerCase() as keyof typeof t.table.priorities] || contact.priority}
                                    </Badge>
                                    <Badge variant={getStatusColor(contact.status)}>
                                        {t.table.statuses[contact.status?.toLowerCase() as keyof typeof t.table.statuses] || contact.status}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="prose max-w-none">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {contact.message}
                                </p>
                            </div>

                            {contact.response && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Mail className="h-4 w-4" />
                                            {t.details.replySent}
                                            {contact.respondedAt && (
                                                <span className="text-muted-foreground font-normal">
                                                    • {new Date(contact.respondedAt).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="bg-muted p-4 rounded-lg">
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                {contact.response}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Reply Section */}
                    {!isReplying && !contact.response && (
                        <Button onClick={() => setIsReplying(true)} className="w-full">
                            <Mail className="mr-2 h-4 w-4" />
                            {t.details.sendReply.replyToContact}
                        </Button>
                    )}

                    {isReplying && (
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.details.sendReply.title}</CardTitle>
                                <CardDescription>
                                    {t.details.sendReply.description} {contact.name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reply-subject">{t.details.sendReply.subject}</Label>
                                    <Input
                                        disabled
                                        id="reply-subject"
                                        placeholder={t.details.sendReply.subjectPlaceholder}
                                        value={replySubject || "Re:" + " " + contact.subject}
                                        onChange={(e) => setReplySubject(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reply-message">{t.details.sendReply.message}</Label>
                                    <Textarea
                                        id="reply-message"
                                        placeholder={t.details.sendReply.messagePlaceholder}
                                        rows={8}
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleSendReply}
                                        disabled={!replyMessage.trim() || isReplaing}
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        {isReplaing ? t.details.sendReply.sending : t.details.sendReply.send}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsReplying(false)
                                            setReplyMessage("")
                                            setReplySubject("")
                                        }}
                                    >
                                        {t.details.sendReply.cancel}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Internal Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.details.internalNotes.title}</CardTitle>
                            <CardDescription>
                                {t.details.internalNotes.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder={t.details.internalNotes.placeholder}
                                rows={4}
                                value={notes || contact.notes || ""}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                            <Button onClick={handleSaveNotes} disabled={isUpdating}>
                                {t.details.internalNotes.save}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t.details.info.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">{t.details.info.name}</p>
                                        <p className="text-sm text-muted-foreground">{contact.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">{t.details.info.email}</p>
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            {contact.email}
                                        </a>
                                    </div>
                                </div>

                                {contact.phone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">{t.details.info.phone}</p>
                                            <a
                                                href={`tel:${contact.phone}`}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {contact.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {contact.company && (
                                    <div className="flex items-start gap-3">
                                        <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">{t.details.info.company}</p>
                                            <p className="text-sm text-muted-foreground">{contact.company}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status & Priority */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t.details.manage.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t.details.manage.status}</Label>
                                <Select
                                    value={status || contact.status}
                                    onValueChange={(value) => {
                                        setStatus(value)
                                        handleUpdateStatus(value)
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NEW">{t.table.statuses.pending}</SelectItem>
                                        <SelectItem value="READ">{t.table.statuses.pending}</SelectItem>
                                        <SelectItem value="IN_PROGRESS">{t.table.statuses.inProgress}</SelectItem>
                                        <SelectItem value="RESOLVED">{t.table.statuses.resolved}</SelectItem>
                                        <SelectItem value="CLOSED">{t.table.statuses.resolved}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>{t.details.manage.priority}</Label>
                                <Select
                                    value={priority || contact.priority}
                                    onValueChange={(value) => {
                                        setPriority(value)
                                        handleUpdatePriority(value)
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">{t.table.priorities.low}</SelectItem>
                                        <SelectItem value="MEDIUM">{t.table.priorities.medium}</SelectItem>
                                        <SelectItem value="HIGH">{t.table.priorities.high}</SelectItem>
                                        <SelectItem value="URGENT">{t.table.priorities.urgent}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t.details.additional.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">{t.details.additional.category}</span>
                                <Badge variant="outline">
                                    {t.table.categories[contact.category?.toLowerCase() as keyof typeof t.table.categories] || contact.category}
                                </Badge>
                            </div>

                            {contact.budget && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{t.details.additional.budget}</span>
                                    <span className="font-medium">{contact.budget}</span>
                                </div>
                            )}

                            {contact.timeline && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{t.details.additional.timeline}</span>
                                    <span className="font-medium">{contact.timeline}</span>
                                </div>
                            )}

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">{t.details.additional.views}</span>
                                <span className="font-medium">{contact.viewCount || 0}</span>
                            </div>

                            {contact.source && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{t.details.additional.source}</span>
                                    <span className="font-medium">{contact.source}</span>
                                </div>
                            )}

                            {contact.ipAddress && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{t.details.additional.ipAddress}</span>
                                    <span className="font-mono text-xs">{contact.ipAddress}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}