"use client"

import { type Member } from "@/lib/supabase"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/registry/default/ui/card"
import { Button } from "@/registry/default/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/registry/default/ui/avatar"
import { MoreVertical, Pencil, Plus, Trash2, User } from "lucide-react"
import { CreateMemberDialog } from "./create-member-dialog"
import { EditMemberDialog } from "./edit-member-dialog"
import { useState } from "react"
import { useMembers, useDeleteMember } from "../hooks/use-members"

interface MembersListProps {
  groupId: string | null
}

export function MembersList({ groupId }: MembersListProps) {
  const { data: members = [] } = useMembers(groupId)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const deleteMember = useDeleteMember()

  const handleDelete = (memberId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this member? This will remove them from all expenses."
      )
    ) {
      return
    }

    if (!groupId) return

    deleteMember.mutate({ id: memberId, group_id: groupId })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
          </div>
          <CardAction>
            <Button onClick={() => setCreateDialogOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {members.length === 0 ? (
          <div className="py-8 text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-sm text-muted-foreground">
              No members yet. Add members to start splitting expenses!
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add First Member
            </Button>
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="group flex items-center justify-between rounded-sm border p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{member.name}</p>
                  {member.email && (
                    <p className="truncate text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100"
                    />
                  }
                >
                  <MoreVertical className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingMember(member)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleDelete(member.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </CardContent>

      {groupId && (
        <>
          <CreateMemberDialog
            groupId={groupId}
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
          />

          {editingMember && (
            <EditMemberDialog
              member={editingMember}
              open={!!editingMember}
              onOpenChange={(open) => !open && setEditingMember(null)}
            />
          )}
        </>
      )}
    </Card>
  )
}
