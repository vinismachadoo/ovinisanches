import { useQuery } from '@tanstack/react-query';
import { supabase, type Expense, type Member, type ExpensePayer, type ExpenseShare } from '@/lib/supabase';

export interface ExpenseWithDetails extends Expense {
  payers: (ExpensePayer & { member: Member })[];
  shares: (ExpenseShare & { member: Member })[];
}

export function useExpenseDetails(groupId: string | null, expenses: Expense[]) {
  return useQuery({
    queryKey: ['expense-details', groupId, expenses.map((e) => e.id)],
    queryFn: async (): Promise<ExpenseWithDetails[]> => {
      if (!groupId || expenses.length === 0) return [];

      const expensesData: ExpenseWithDetails[] = await Promise.all(
        expenses.map(async (expense) => {
          const [payersResult, sharesResult] = await Promise.all([
            supabase.from('expense_payers').select('*').eq('expense_id', expense.id),
            supabase.from('expense_shares').select('*').eq('expense_id', expense.id),
          ]);

          const payers = payersResult.data || [];
          const shares = sharesResult.data || [];

          // Get unique member IDs
          const memberIds = [
            ...new Set([...payers.map((p) => p.member_id), ...shares.map((s) => s.member_id)]),
          ];

          // Fetch all members at once
          const { data: memberData } = await supabase
            .from('members')
            .select('*')
            .in('id', memberIds);

          const memberMap = new Map((memberData || []).map((m) => [m.id, m]));

          return {
            ...expense,
            payers: payers.map((p) => ({
              ...p,
              member: memberMap.get(p.member_id)!,
            })) as (ExpensePayer & { member: Member })[],
            shares: shares.map((s) => ({
              ...s,
              member: memberMap.get(s.member_id)!,
            })) as (ExpenseShare & { member: Member })[],
          };
        })
      );

      return expensesData;
    },
    enabled: !!groupId && expenses.length > 0,
  });
}
