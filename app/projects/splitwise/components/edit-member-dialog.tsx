"use client"

import { Button } from "@/registry/default/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/default/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/registry/default/ui/input"
import { type Member } from "@/lib/supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useUpdateMember } from "../hooks/use-members"

const memberSchema = z.object({
  name: z
    .string()
    .min(1, "Member name is required")
    .max(255, "Member name is too long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
})

type MemberFormValues = z.infer<typeof memberSchema>

interface EditMemberDialogProps {
  member: Member
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMemberDialog({
  member,
  open,
  onOpenChange,
}: EditMemberDialogProps) {
  const updateMember = useUpdateMember()

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: member.name,
      email: member.email || "",
    },
  })

  const onSubmit = async (values: MemberFormValues) => {
    updateMember.mutate(
      {
        id: member.id,
        group_id: member.group_id,
        name: values.name,
        email: values.email,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset({
            name: member.name,
            email: member.email || "",
          })
        }
        onOpenChange(open)
      }}
    >
      <DialogContent className="max-w-[50%]">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>Update member information.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g., john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional email address for this member.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMember.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMember.isPending}>
                {updateMember.isPending ? "Updating..." : "Update Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
