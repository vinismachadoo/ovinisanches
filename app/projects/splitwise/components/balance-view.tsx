'use client';

import { useMemo } from 'react';
import { type Member, type ExpensePayer, type ExpenseShare } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowDown, ArrowUp, TrendingUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useMembers } from '../hooks/use-members';
import { useExpenses } from '../hooks/use-expenses';
import { useExpenseDetails } from '../hooks/use-expense-details';

interface BalanceViewProps {
  groupId: string | null;
}

interface MemberBalance {
  member: Member;
  paid: number;
  owed: number;
  balance: number; // positive = they are owed money, negative = they owe money
}

export function BalanceView({ groupId }: BalanceViewProps) {
  const { data: members = [] } = useMembers(groupId);
  const { data: expenses = [] } = useExpenses(groupId);
  const { data: expensesWithDetails = [], isLoading } = useExpenseDetails(groupId, expenses);

  const { balances, currency } = useMemo(() => {
    const balancesMap = new Map<string, MemberBalance>();
    let currency = 'USD';

    // Initialize balances for all members
    members.forEach((member) => {
      balancesMap.set(member.id, {
        member,
        paid: 0,
        owed: 0,
        balance: 0,
      });
    });

    // Process each expense
    expensesWithDetails.forEach((expense) => {
      if (expense.currency) {
        currency = expense.currency;
      }

      // Add to paid amount for each payer
      expense.payers.forEach((payer) => {
        const balance = balancesMap.get(payer.member_id);
        if (balance) {
          balance.paid += parseFloat(payer.amount.toString());
        }
      });

      // Add to owed amount for each share
      expense.shares.forEach((share) => {
        const balance = balancesMap.get(share.member_id);
        if (balance) {
          balance.owed += parseFloat(share.amount.toString());
        }
      });
    });

    // Calculate final balances (paid - owed)
    balancesMap.forEach((balance) => {
      balance.balance = balance.paid - balance.owed;
    });

    // Convert to array and sort by balance
    const balancesArray = Array.from(balancesMap.values()).sort((a, b) => b.balance - a.balance);

    return { balances: balancesArray, currency };
  }, [members, expensesWithDetails]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(Math.abs(amount));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate simplified settlements (who should pay whom)
  const calculateSettlements = (): Array<{ from: Member; to: Member; amount: number }> => {
    const settlements: Array<{ from: Member; to: Member; amount: number }> = [];
    const balancesCopy = balances.map((b) => ({ ...b }));

    // Sort: debtors first (negative balance), then creditors (positive balance)
    const debtors = balancesCopy.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance);
    const creditors = balancesCopy.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance);

    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];

      const debtAmount = Math.abs(debtor.balance);
      const creditAmount = creditor.balance;

      if (debtAmount <= creditAmount) {
        // Debtor can fully pay creditor
        settlements.push({
          from: debtor.member,
          to: creditor.member,
          amount: debtAmount,
        });
        creditor.balance -= debtAmount;
        debtor.balance = 0;
        debtorIndex++;

        if (creditor.balance < 0.01) {
          creditorIndex++;
        }
      } else {
        // Debtor partially pays creditor
        settlements.push({
          from: debtor.member,
          to: creditor.member,
          amount: creditAmount,
        });
        debtor.balance += creditAmount;
        creditor.balance = 0;
        creditorIndex++;
      }
    }

    return settlements.filter((s) => s.amount >= 0.01); // Filter out negligible amounts
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Calculating balances...</p>
        </CardContent>
      </Card>
    );
  }

  if (members.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Add members and expenses to see balances.</p>
        </CardContent>
      </Card>
    );
  }

  const settlements = calculateSettlements();
  const totalPaid = balances.reduce((sum, b) => sum + b.paid, 0);
  const totalOwed = balances.reduce((sum, b) => sum + b.owed, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Summary
          </CardTitle>
          <CardDescription>Total amounts paid and owed by all members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(totalPaid)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Owed</p>
              <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
                {formatCurrency(totalOwed)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Individual Balances</CardTitle>
          <CardDescription>What each member has paid, owes, and their net balance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {balances.map((balance) => (
            <div key={balance.member.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(balance.member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{balance.member.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Paid</p>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(balance.paid)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Owed</p>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      {formatCurrency(balance.owed)}
                    </p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="text-xs text-muted-foreground">Balance</p>
                    {balance.balance > 0.01 ? (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <ArrowUp className="h-4 w-4" />
                        <p className="text-sm font-semibold">Gets {formatCurrency(balance.balance)}</p>
                      </div>
                    ) : balance.balance < -0.01 ? (
                      <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                        <ArrowDown className="h-4 w-4" />
                        <p className="text-sm font-semibold">Owes {formatCurrency(balance.balance)}</p>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-muted-foreground">Settled up</p>
                    )}
                  </div>
                </div>
              </div>
              {balance !== balances[balances.length - 1] && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {settlements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Settlements</CardTitle>
            <CardDescription>Simplified list of who should pay whom to settle all debts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {settlements.map((settlement, index) => (
              <div key={`${settlement.from.id}-${settlement.to.id}-${index}`}>
                <div className="flex items-center justify-between p-3 rounded-sm border bg-accent/50">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(settlement.from.name)}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{settlement.from.name}</p>
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    <Avatar>
                      <AvatarFallback>{getInitials(settlement.to.name)}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{settlement.to.name}</p>
                  </div>
                  <Badge variant="outline" className="text-base font-semibold">
                    {formatCurrency(settlement.amount)}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {settlements.length === 0 && balances.some((b) => Math.abs(b.balance) > 0.01) === false && (
        <Card>
          <CardHeader>
            <CardTitle>Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-4">
              All members are settled up! No payments needed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

