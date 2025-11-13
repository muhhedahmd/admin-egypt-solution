"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Mail, Trash2, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"

const mockContacts = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    subject: "Project Inquiry",
    message: "I'm interested in discussing a web development project for our startup...",
    status: "PENDING",
    priority: "HIGH",
    createdAt: "2024-01-16",
  },
  {
    id: 2,
    name: "Bob Williams",
    email: "bob@company.com",
    subject: "Partnership Opportunity",
    message: "We'd like to explore potential partnership opportunities with your team...",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    name: "Carol Martinez",
    email: "carol@business.com",
    subject: "Technical Support",
    message: "We're experiencing some issues with the application you developed...",
    status: "PENDING",
    priority: "HIGH",
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    name: "David Brown",
    email: "david@startup.io",
    subject: "Quote Request",
    message: "Could you provide a quote for a mobile app development project?",
    status: "RESOLVED",
    priority: "LOW",
    createdAt: "2024-01-14",
  },
  {
    id: 5,
    name: "Emma Davis",
    email: "emma@enterprise.com",
    subject: "General Inquiry",
    message: "I'd like to learn more about your cloud solutions services...",
    status: "RESOLVED",
    priority: "LOW",
    createdAt: "2024-01-13",
  },
]

export function ContactsTable() {
  const [contacts] = useState(mockContacts)

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-muted-foreground">{contact.email}</div>
                </div>
              </TableCell>
              <TableCell className="font-medium">{contact.subject}</TableCell>
              <TableCell>
                <div className="max-w-md line-clamp-2 text-sm text-muted-foreground">{contact.message}</div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    contact.priority === "HIGH"
                      ? "destructive"
                      : contact.priority === "MEDIUM"
                        ? "default"
                        : "secondary"
                  }
                >
                  {contact.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    contact.status === "RESOLVED"
                      ? "default"
                      : contact.status === "IN_PROGRESS"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {contact.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(contact.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Reply
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Resolved
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
