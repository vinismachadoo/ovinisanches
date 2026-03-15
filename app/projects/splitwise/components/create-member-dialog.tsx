"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/default/ui/dialog"
import { Button } from "@/registry/default/ui/button"
import { Input } from "@/registry/default/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useCreateMember } from "../hooks/use-members"

const memberSchema = z.object({
  name: z
    .string()
    .min(1, "Member name is required")
    .max(255, "Member name is too long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
})

type MemberFormValues = z.infer<typeof memberSchema>

interface CreateMemberDialogProps {
  groupId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateMemberDialog({
  groupId,
  open,
  onOpenChange,
}: CreateMemberDialogProps) {
  const createMember = useCreateMember()

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = async (values: MemberFormValues) => {
    createMember.mutate(
      {
        group_id: groupId,
        name: values.name,
        email: values.email,
      },
      {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[50%]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>Add a new member to this group.</DialogDescription>
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
                disabled={createMember.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMember.isPending}>
                {createMember.isPending ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
