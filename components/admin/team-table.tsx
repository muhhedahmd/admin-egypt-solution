"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { DeleteDialog } from "@/components/admin/delete-dialog"

const mockTeam = [
  {
    id: 1,
    name: "John Smith",
    position: "CEO & Founder",
    email: "john@company.com",
    status: "ACTIVE",
    featured: true,
    order: 1,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "CTO",
    email: "sarah@company.com",
    status: "ACTIVE",
    featured: true,
    order: 2,
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "Lead Developer",
    email: "michael@company.com",
    status: "ACTIVE",
    featured: true,
    order: 3,
  },
  {
    id: 4,
    name: "Emily Davis",
    position: "UI/UX Designer",
    email: "emily@company.com",
    status: "ACTIVE",
    featured: false,
    order: 4,
  },
  {
    id: 5,
    name: "David Wilson",
    position: "Marketing Manager",
    email: "david@company.com",
    status: "INACTIVE",
    featured: false,
    order: 5,
  },
]

export function TeamTable() {
  const router = useRouter()
  const [team, setTeam] = useState(mockTeam)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    console.log("[v0] Deleting team member:", id)
    setTeam(team.filter((m) => m.id !== id))
    setDeleteId(null)
  }

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/.jpg?height=40&width=40&query=${member.name}`} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{member.name}</div>
                  </div>
                </TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                <TableCell>
                  <Badge variant={member.status === "ACTIVE" ? "default" : "secondary"}>{member.status}</Badge>
                </TableCell>
                <TableCell>{member.featured && <Badge variant="outline">Featured</Badge>}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/admin/team/${member.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/admin/team/${member.id}/edit`)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(member.id)}>
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

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Team Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
      />
    </>
  )
}
