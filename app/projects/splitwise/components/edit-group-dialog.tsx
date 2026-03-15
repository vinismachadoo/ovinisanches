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
import { Textarea } from "@/registry/default/ui/textarea"
import { type Group } from "@/lib/supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useUpdateGroup } from "../hooks/use-groups"
import { EmojiPickerField } from "./emoji-picker-field"

const groupSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .max(255, "Group name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  icon: z.string().optional(),
})

type GroupFormValues = z.infer<typeof groupSchema>

interface EditGroupDialogProps {
  group: Group
  open: boolean
  onOpenChange: (open: boolean) => void
  onGroupUpdated: () => void
}

export function EditGroupDialog({
  group,
  open,
  onOpenChange,
  onGroupUpdated,
}: EditGroupDialogProps) {
  const updateGroup = useUpdateGroup()

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: group.name,
      description: group.description || "",
      icon: group.icon || "",
    },
  })

  const onSubmit = async (values: GroupFormValues) => {
    updateGroup.mutate(
      {
        id: group.id,
        name: values.name,
        description: values.description,
        icon: values.icon,
      },
      {
        onSuccess: () => {
          onGroupUpdated()
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
            name: group.name,
            description: group.description || "",
            icon: group.icon || "",
          })
          onOpenChange(false)
        }
      }}
    >
      <DialogContent className="max-w-[50%]">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>Update the group details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex w-full items-center gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <EmojiPickerField
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Roommates, Trip to Europe"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a description for this group..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description to help identify this group.
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
                disabled={updateGroup.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateGroup.isPending}>
                {updateGroup.isPending ? "Updating..." : "Update Group"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
