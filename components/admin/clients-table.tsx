"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Eye, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockClients = [
  {
    id: 1,
    name: "TechCorp Inc.",
    website: "https://techcorp.com",
    industry: "Technology",
    status: "ACTIVE",
    featured: true,
  },
  {
    id: 2,
    name: "FinanceBank",
    website: "https://financebank.com",
    industry: "Finance",
    status: "ACTIVE",
    featured: true,
  },
  {
    id: 3,
    name: "MediCare Systems",
    website: "https://medicare.com",
    industry: "Healthcare",
    status: "ACTIVE",
    featured: true,
  },
  {
    id: 4,
    name: "ShipFast Co.",
    website: "https://shipfast.com",
    industry: "Logistics",
    status: "ACTIVE",
    featured: false,
  },
  {
    id: 5,
    name: "EduLearn Platform",
    website: "https://edulearn.com",
    industry: "Education",
    status: "INACTIVE",
    featured: false,
  },
]

export function ClientsTable() {
  const [clients] = useState(mockClients)

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-md">
                    <AvatarImage src={`/.jpg?height=40&width=40&query=${client.name} logo`} />
                    <AvatarFallback>{client.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{client.name}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{client.industry}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{client.website}</TableCell>
              <TableCell>
                <Badge variant={client.status === "ACTIVE" ? "default" : "secondary"}>{client.status}</Badge>
              </TableCell>
              <TableCell>{client.featured && <Badge variant="outline">Featured</Badge>}</TableCell>
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
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
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
