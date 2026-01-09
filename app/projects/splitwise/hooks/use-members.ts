import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Member } from '@/lib/supabase';
import { toast } from 'sonner';

export function useMembers(groupId: string | null) {
  return useQuery({
    queryKey: ['members', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('group_id', groupId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!groupId,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (member: { group_id: string; name: string; email?: string }) => {
      const { data, error } = await supabase
        .from('members')
        .insert({
          group_id: member.group_id,
          name: member.name,
          email: member.email || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members', variables.group_id] });
      toast.success('Member added successfully');
    },
    onError: (error) => {
      console.error('Error creating member:', error);
      toast.error('Failed to add member');
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, group_id, ...updates }: { id: string; group_id: string; name: string; email?: string }) => {
      const { data, error } = await supabase
        .from('members')
        .update({
          name: updates.name,
          email: updates.email || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, group_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['members', data.group_id] });
      toast.success('Member updated successfully');
    },
    onError: (error) => {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, group_id }: { id: string; group_id: string }) => {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) throw error;
      return { id, group_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['members', data.group_id] });
      toast.success('Member deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    },
  });
}
