'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { parseAsString, useQueryState } from 'nuqs';
import { type Group } from '@/lib/supabase';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/registry/dialog';
import { Button } from '@/registry/button';
import { Input } from '@/registry/input';
import { Textarea } from '@/registry/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateGroup } from '../hooks/use-groups';
import { EmojiPickerField } from './emoji-picker-field';

const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(255, 'Group name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  icon: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupSchema>;

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated: (group: Group) => void;
}

export function CreateGroupDialog({ open, onOpenChange, onGroupCreated }: CreateGroupDialogProps) {
  const [, setSelectedGroupId] = useQueryState('group_id', parseAsString);
  const createGroup = useCreateGroup();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '',
    },
  });

  const onSubmit = async (values: GroupFormValues) => {
    createGroup.mutate(
      {
        name: values.name,
        description: values.description,
        icon: values.icon,
      },
      {
        onSuccess: async (data) => {
          await setSelectedGroupId(data.id);
          onGroupCreated(data);
          form.reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[50%]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>Create a new group to start splitting expenses with friends.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-4 w-full">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <EmojiPickerField value={field.value} onChange={field.onChange} />
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
                      <Input placeholder="e.g., Roommates, Trip to Europe" {...field} className="w-full" />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a description for this group..." {...field} />
                  </FormControl>
                  <FormDescription>Optional description to help identify this group.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createGroup.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createGroup.isPending}>
                {createGroup.isPending ? 'Creating...' : 'Create Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
