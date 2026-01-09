import { supabase } from '@/lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useExpenses(groupId: string | null) {
  return useQuery({
    queryKey: ['expenses', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!groupId,
  });
}

interface CreateExpenseParams {
  group_id: string;
  description: string;
  amount: number;
  currency: string;
  paid_type: 'even' | 'percentage' | 'amount';
  split_type: 'even' | 'percentage' | 'amount';
  payerIds: string[];
  payerPercentages?: Record<string, string>;
  payerAmounts?: Record<string, string>;
  shareMemberIds: string[];
  percentages?: Record<string, string>;
  amounts?: Record<string, string>;
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateExpenseParams) => {
      const totalAmount = params.amount;
      const expenseId = crypto.randomUUID();

      // Create expense
      const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          id: expenseId,
          group_id: params.group_id,
          description: params.description,
          amount: totalAmount,
          currency: params.currency,
          paid_type: params.paid_type,
          split_type: params.split_type,
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      // Create expense payers
      let payerInserts: { expense_id: string; member_id: string; amount: number }[] = [];

      if (params.paid_type === 'even') {
        const payerAmount = totalAmount / params.payerIds.length;
        payerInserts = params.payerIds.map((payerId) => ({
          expense_id: expenseId,
          member_id: payerId,
          amount: payerAmount,
        }));
      } else if (params.paid_type === 'percentage') {
        payerInserts = params.payerIds.map((payerId) => {
          const percentage = parseFloat(params.payerPercentages?.[payerId] || '0');
          const payerAmount = (totalAmount * percentage) / 100;
          return {
            expense_id: expenseId,
            member_id: payerId,
            amount: payerAmount,
          };
        });
      } else if (params.paid_type === 'amount') {
        payerInserts = params.payerIds.map((payerId) => ({
          expense_id: expenseId,
          member_id: payerId,
          amount: parseFloat(params.payerAmounts?.[payerId] || '0'),
        }));
      }

      const { error: payersError } = await supabase.from('expense_payers').insert(payerInserts);
      if (payersError) throw payersError;

      // Create expense shares
      let shareInserts: { expense_id: string; member_id: string; amount: number }[] = [];

      if (params.split_type === 'even') {
        const shareAmount = totalAmount / params.shareMemberIds.length;
        shareInserts = params.shareMemberIds.map((memberId) => ({
          expense_id: expenseId,
          member_id: memberId,
          amount: shareAmount,
        }));
      } else if (params.split_type === 'percentage') {
        shareInserts = params.shareMemberIds.map((memberId) => {
          const percentage = parseFloat(params.percentages?.[memberId] || '0');
          const shareAmount = (totalAmount * percentage) / 100;
          return {
            expense_id: expenseId,
            member_id: memberId,
            amount: shareAmount,
          };
        });
      } else if (params.split_type === 'amount') {
        shareInserts = params.shareMemberIds.map((memberId) => ({
          expense_id: expenseId,
          member_id: memberId,
          amount: parseFloat(params.amounts?.[memberId] || '0'),
        }));
      }

      const { error: sharesError } = await supabase.from('expense_shares').insert(shareInserts);
      if (sharesError) throw sharesError;

      return expense;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.group_id] });
      toast.success('Expense created successfully');
    },
    onError: (error) => {
      console.error('Error creating expense:', error);
      toast.error('Failed to create expense');
    },
  });
}

interface UpdateExpenseParams {
  id: string;
  group_id: string;
  description: string;
  amount: number;
  currency: string;
  paid_type: 'even' | 'percentage' | 'amount';
  split_type: 'even' | 'percentage' | 'amount';
  payerIds: string[];
  payerPercentages?: Record<string, string>;
  payerAmounts?: Record<string, string>;
  shareMemberIds: string[];
  percentages?: Record<string, string>;
  amounts?: Record<string, string>;
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateExpenseParams) => {
      const totalAmount = params.amount;

      // Update expense
      const { error: expenseError } = await supabase
        .from('expenses')
        .update({
          description: params.description,
          amount: totalAmount,
          currency: params.currency,
          paid_type: params.paid_type,
          split_type: params.split_type,
        })
        .eq('id', params.id);

      if (expenseError) throw expenseError;

      // Delete existing payers and shares
      await Promise.all([
        supabase.from('expense_payers').delete().eq('expense_id', params.id),
        supabase.from('expense_shares').delete().eq('expense_id', params.id),
      ]);

      // Create new expense payers
      let payerInserts: { expense_id: string; member_id: string; amount: number }[] = [];

      if (params.paid_type === 'even') {
        const payerAmount = totalAmount / params.payerIds.length;
        payerInserts = params.payerIds.map((payerId) => ({
          expense_id: params.id,
          member_id: payerId,
          amount: payerAmount,
        }));
      } else if (params.paid_type === 'percentage') {
        payerInserts = params.payerIds.map((payerId) => {
          const percentage = parseFloat(params.payerPercentages?.[payerId] || '0');
          const payerAmount = (totalAmount * percentage) / 100;
          return {
            expense_id: params.id,
            member_id: payerId,
            amount: payerAmount,
          };
        });
      } else if (params.paid_type === 'amount') {
        payerInserts = params.payerIds.map((payerId) => ({
          expense_id: params.id,
          member_id: payerId,
          amount: parseFloat(params.payerAmounts?.[payerId] || '0'),
        }));
      }

      const { error: payersError } = await supabase.from('expense_payers').insert(payerInserts);
      if (payersError) throw payersError;

      // Create new expense shares
      let shareInserts: { expense_id: string; member_id: string; amount: number }[] = [];

      if (params.split_type === 'even') {
        const shareAmount = totalAmount / params.shareMemberIds.length;
        shareInserts = params.shareMemberIds.map((memberId) => ({
          expense_id: params.id,
          member_id: memberId,
          amount: shareAmount,
        }));
      } else if (params.split_type === 'percentage') {
        shareInserts = params.shareMemberIds.map((memberId) => {
          const percentage = parseFloat(params.percentages?.[memberId] || '0');
          const shareAmount = (totalAmount * percentage) / 100;
          return {
            expense_id: params.id,
            member_id: memberId,
            amount: shareAmount,
          };
        });
      } else if (params.split_type === 'amount') {
        shareInserts = params.shareMemberIds.map((memberId) => ({
          expense_id: params.id,
          member_id: memberId,
          amount: parseFloat(params.amounts?.[memberId] || '0'),
        }));
      }

      const { error: sharesError } = await supabase.from('expense_shares').insert(shareInserts);
      if (sharesError) throw sharesError;

      return { id: params.id, group_id: params.group_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', data.group_id] });
      toast.success('Expense updated successfully');
    },
    onError: (error) => {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, group_id }: { id: string; group_id: string }) => {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
      return { id, group_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', data.group_id] });
      toast.success('Expense deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    },
  });
}
