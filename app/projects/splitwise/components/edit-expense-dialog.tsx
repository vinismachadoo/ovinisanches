'use client';

import { Button } from '@/registry/button';
import { Checkbox } from '@/registry/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/registry/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/registry/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/select';
import { Separator } from '@/registry/separator';
import { supabase, type Expense, type Member } from '@/lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useUpdateExpense } from '../hooks/use-expenses';

const expenseSchema = z
  .object({
    description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
    amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    }),
    currency: z.string(),
    payer_split_type: z.enum(['even', 'percentage', 'amount']),
    payerIds: z.array(z.string()).min(1, 'At least one payer is required'),
    payerPercentages: z.record(z.string(), z.string()).optional(),
    payerAmounts: z.record(z.string(), z.string()).optional(),
    split_type: z.enum(['even', 'percentage', 'amount']),
    shareMemberIds: z.array(z.string()).min(1, 'At least one member must share the expense'),
    percentages: z.record(z.string(), z.string()).optional(),
    amounts: z.record(z.string(), z.string()).optional(),
  })
  .refine(
    (data) => {
      // Validate payer split
      if (data.payer_split_type === 'percentage') {
        if (!data.payerPercentages) return false;
        const total = Object.values(data.payerPercentages).reduce(
          (sum, p) => sum + (isNaN(parseFloat(p)) ? 0 : parseFloat(p)),
          0,
        );
        return Math.abs(total - 100) < 0.01;
      }
      if (data.payer_split_type === 'amount') {
        if (!data.payerAmounts) return false;
        const totalAmount = parseFloat(data.amount);
        const payerTotal = Object.values(data.payerAmounts).reduce(
          (sum, a) => sum + (isNaN(parseFloat(a)) ? 0 : parseFloat(a)),
          0,
        );
        return Math.abs(payerTotal - totalAmount) < 0.01;
      }
      return true;
    },
    {
      message: 'Payer split totals must match the expense amount',
      path: ['amount'],
    },
  )
  .refine(
    (data) => {
      // Validate share split
      if (data.split_type === 'percentage') {
        if (!data.percentages) return false;
        const total = Object.values(data.percentages).reduce(
          (sum, p) => sum + (isNaN(parseFloat(p)) ? 0 : parseFloat(p)),
          0,
        );
        return Math.abs(total - 100) < 0.01;
      }
      if (data.split_type === 'amount') {
        if (!data.amounts) return false;
        const totalAmount = parseFloat(data.amount);
        const splitTotal = Object.values(data.amounts).reduce(
          (sum, a) => sum + (isNaN(parseFloat(a)) ? 0 : parseFloat(a)),
          0,
        );
        return Math.abs(splitTotal - totalAmount) < 0.01;
      }
      return true;
    },
    {
      message: 'Split totals must match the expense amount',
      path: ['amount'],
    },
  );

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface EditExpenseDialogProps {
  expense: Expense;
  members: Member[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditExpenseDialog({ expense, members, open, onOpenChange }: EditExpenseDialogProps) {
  const updateExpense = useUpdateExpense();
  const [loadingData, setLoadingData] = useState(true);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: expense.description,
      amount: expense.amount.toString(),
      currency: expense.currency,
      payer_split_type: 'even',
      payerIds: [],
      payerPercentages: {},
      payerAmounts: {},
      split_type: expense.split_type as 'even' | 'percentage' | 'amount',
      shareMemberIds: [],
      percentages: {},
      amounts: {},
    },
  });

  const payerSplitType = form.watch('payer_split_type');
  const payerIds = form.watch('payerIds');
  const splitType = form.watch('split_type');
  const shareMemberIds = form.watch('shareMemberIds');
  const amount = form.watch('amount');
  const percentages = form.watch('percentages');
  const amounts = form.watch('amounts');
  const payerPercentages = form.watch('payerPercentages');
  const payerAmounts = form.watch('payerAmounts');

  useEffect(() => {
    if (open) {
      loadExpenseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expense.id, open]);

  const loadExpenseData = async () => {
    setLoadingData(true);
    try {
      const [payersResult, sharesResult] = await Promise.all([
        supabase.from('expense_payers').select('*').eq('expense_id', expense.id),
        supabase.from('expense_shares').select('*').eq('expense_id', expense.id),
      ]);

      const payers = payersResult.data || [];
      const shares = sharesResult.data || [];

      const payerIds = payers.map((p) => p.member_id);
      const shareMemberIds = shares.map((s) => s.member_id);

      // Use paid_type from expense if available, otherwise determine from payers
      const totalAmount = parseFloat(expense.amount.toString());
      let payerSplitType: 'even' | 'percentage' | 'amount' =
        (expense as Expense & { paid_type: 'even' | 'percentage' | 'amount' }).paid_type || 'even';
      const payerPercentages: Record<string, string> = {};
      const payerAmounts: Record<string, string> = {};

      // If paid_type is not set, determine it from payer amounts
      if (!(expense as Expense & { paid_type?: string }).paid_type && payers.length > 0) {
        const payerAmountsList = payers.map((p) => parseFloat(p.amount.toString()));
        const firstAmount = payerAmountsList[0];
        const allEqual = payerAmountsList.every((a) => Math.abs(a - firstAmount) < 0.01);

        if (allEqual) {
          payerSplitType = 'even' as const;
        } else {
          // Check if amounts are proportional to percentages
          const percentages = payerAmountsList.map((a) => (a / totalAmount) * 100);
          const roundedPercentages = percentages.map((p) => Math.round(p * 100) / 100);
          const sumPercentages = roundedPercentages.reduce((sum, p) => sum + p, 0);

          if (Math.abs(sumPercentages - 100) < 0.01) {
            payerSplitType = 'percentage' as const;
            payers.forEach((p, idx) => {
              payerPercentages[p.member_id] = roundedPercentages[idx].toFixed(2);
            });
          } else {
            payerSplitType = 'amount' as const;
            payers.forEach((p) => {
              payerAmounts[p.member_id] = p.amount.toString();
            });
          }
        }
      } else if (payers.length > 0) {
        // If paid_type is set, calculate percentages/amounts based on it
        if (payerSplitType === 'percentage') {
          payers.forEach((p) => {
            const percentage = (parseFloat(p.amount.toString()) / totalAmount) * 100;
            payerPercentages[p.member_id] = percentage.toFixed(2);
          });
        } else if (payerSplitType === 'amount') {
          payers.forEach((p) => {
            payerAmounts[p.member_id] = p.amount.toString();
          });
        }
      }

      const percentages: Record<string, string> = {};
      const amounts: Record<string, string> = {};

      if (expense.split_type === 'percentage') {
        shares.forEach((share) => {
          const percentage = (parseFloat(share.amount.toString()) / totalAmount) * 100;
          percentages[share.member_id] = percentage.toFixed(2);
        });
      } else if (expense.split_type === 'amount') {
        shares.forEach((share) => {
          amounts[share.member_id] = share.amount.toString();
        });
      }

      form.reset({
        description: expense.description,
        amount: expense.amount.toString(),
        currency: expense.currency,
        payer_split_type: payerSplitType,
        payerIds,
        payerPercentages,
        payerAmounts,
        split_type: expense.split_type as 'even' | 'percentage' | 'amount',
        shareMemberIds,
        percentages,
        amounts,
      });
    } catch (error) {
      console.error('Error loading expense data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Initialize payer percentages and amounts when payer split type or payers change
  const handlePayerIdsChange = (memberIds: string[]) => {
    form.setValue('payerIds', memberIds);
    if (payerSplitType === 'percentage') {
      const evenPercent = (100 / memberIds.length).toFixed(2);
      const newPercentages: Record<string, string> = {};
      memberIds.forEach((id) => {
        newPercentages[id] = memberIds.includes(id) ? payerPercentages?.[id] || evenPercent : '';
      });
      form.setValue('payerPercentages', newPercentages);
    } else if (payerSplitType === 'amount') {
      const totalAmount = parseFloat(amount) || 0;
      const evenAmount = (totalAmount / memberIds.length).toFixed(2);
      const newAmounts: Record<string, string> = {};
      memberIds.forEach((id) => {
        newAmounts[id] = memberIds.includes(id) ? payerAmounts?.[id] || evenAmount : '';
      });
      form.setValue('payerAmounts', newAmounts);
    }
  };

  const handleShareMemberIdsChange = (memberIds: string[]) => {
    form.setValue('shareMemberIds', memberIds);
    if (splitType === 'percentage') {
      const evenPercent = (100 / memberIds.length).toFixed(2);
      const newPercentages: Record<string, string> = {};
      memberIds.forEach((id) => {
        newPercentages[id] = memberIds.includes(id) ? percentages?.[id] || evenPercent : '';
      });
      form.setValue('percentages', newPercentages);
    } else if (splitType === 'amount') {
      const totalAmount = parseFloat(amount) || 0;
      const evenAmount = (totalAmount / memberIds.length).toFixed(2);
      const newAmounts: Record<string, string> = {};
      memberIds.forEach((id) => {
        newAmounts[id] = memberIds.includes(id) ? amounts?.[id] || evenAmount : '';
      });
      form.setValue('amounts', newAmounts);
    }
  };

  const handleAmountChange = (newAmount: string) => {
    form.setValue('amount', newAmount);
    if (payerSplitType === 'amount' && payerIds.length > 0) {
      const totalAmount = parseFloat(newAmount) || 0;
      const evenAmount = (totalAmount / payerIds.length).toFixed(2);
      const newPayerAmounts: Record<string, string> = {};
      payerIds.forEach((id) => {
        newPayerAmounts[id] = payerAmounts?.[id] || evenAmount;
      });
      form.setValue('payerAmounts', newPayerAmounts);
    }
    if (splitType === 'amount' && shareMemberIds.length > 0) {
      const totalAmount = parseFloat(newAmount) || 0;
      const evenAmount = (totalAmount / shareMemberIds.length).toFixed(2);
      const newAmounts: Record<string, string> = {};
      shareMemberIds.forEach((id) => {
        newAmounts[id] = amounts?.[id] || evenAmount;
      });
      form.setValue('amounts', newAmounts);
    }
  };

  const onSubmit = async (values: ExpenseFormValues) => {
    updateExpense.mutate(
      {
        id: expense.id,
        group_id: expense.group_id,
        description: values.description,
        amount: parseFloat(values.amount),
        currency: values.currency,
        paid_type: values.payer_split_type,
        split_type: values.split_type,
        payerIds: values.payerIds,
        payerPercentages: values.payerPercentages,
        payerAmounts: values.payerAmounts,
        shareMemberIds: values.shareMemberIds,
        percentages: values.percentages,
        amounts: values.amounts,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loadingData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="text-center py-4">Loading expense data...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>Update expense details and split.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Groceries, Dinner, Hotel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleAmountChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="BRL">BRL</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="payerIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid By</FormLabel>
                    <FormDescription>Select who paid for this expense (can be multiple)</FormDescription>
                    <div className="space-y-2 mt-2">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value?.includes(member.id)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              let newValue: string[];
                              if (checked) {
                                newValue = [...currentValue, member.id];
                              } else {
                                newValue = currentValue.filter((id) => id !== member.id);
                              }
                              field.onChange(newValue);
                              handlePayerIdsChange(newValue);
                            }}
                          />
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {member.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {payerIds.length > 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="payer_split_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How was it paid?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="even">Paid equally</SelectItem>
                            <SelectItem value="percentage">Paid by percentage</SelectItem>
                            <SelectItem value="amount">Paid by amount</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {payerSplitType === 'even' && 'Each payer paid an equal share'}
                          {payerSplitType === 'percentage' && 'Enter percentage for each payer (must total 100%)'}
                          {payerSplitType === 'amount' &&
                            'Enter exact amount each payer paid (must total expense amount)'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {payerSplitType === 'percentage' && payerIds.length > 0 && (
                    <div className="space-y-3 border rounded-sm p-4">
                      <FormLabel>Payer Percentage Split</FormLabel>
                      <FormDescription className="mb-3">Total must equal 100%</FormDescription>
                      {payerIds.map((payerId) => {
                        const member = members.find((m) => m.id === payerId);
                        if (!member) return null;

                        const currentPercent = payerPercentages?.[payerId] || '';
                        const totalAmount = parseFloat(amount) || 0;
                        const percentValue = parseFloat(currentPercent) || 0;
                        const payerAmount = (totalAmount * percentValue) / 100;

                        return (
                          <div key={payerId} className="flex items-center gap-3">
                            <div className="flex-1">
                              <label className="text-sm font-medium">{member.name}</label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={currentPercent}
                                onChange={(e) => {
                                  const newPercentages = { ...payerPercentages, [payerId]: e.target.value };
                                  form.setValue('payerPercentages', newPercentages);
                                }}
                              />
                            </div>
                            <div className="text-sm text-muted-foreground pt-6">
                              {!isNaN(percentValue) && totalAmount > 0
                                ? formatCurrency(payerAmount, form.watch('currency'))
                                : '-'}
                            </div>
                          </div>
                        );
                      })}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center text-sm font-medium">
                          <span>Total:</span>
                          <span>
                            {Object.values(payerPercentages || {})
                              .reduce((sum, p) => sum + (isNaN(parseFloat(p)) ? 0 : parseFloat(p)), 0)
                              .toFixed(2)}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {payerSplitType === 'amount' && payerIds.length > 0 && (
                    <div className="space-y-3 border rounded-sm p-4">
                      <FormLabel>Payer Amount Split</FormLabel>
                      <FormDescription className="mb-3">Total must equal expense amount</FormDescription>
                      {payerIds.map((payerId) => {
                        const member = members.find((m) => m.id === payerId);
                        if (!member) return null;

                        const currentAmount = payerAmounts?.[payerId] || '';

                        return (
                          <div key={payerId} className="flex items-center gap-3">
                            <div className="flex-1">
                              <label className="text-sm font-medium">{member.name}</label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={currentAmount}
                                onChange={(e) => {
                                  const newAmounts = { ...payerAmounts, [payerId]: e.target.value };
                                  form.setValue('payerAmounts', newAmounts);
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center text-sm font-medium">
                          <span>Total:</span>
                          <span>
                            {formatCurrency(
                              Object.values(payerAmounts || {}).reduce(
                                (sum, a) => sum + (isNaN(parseFloat(a)) ? 0 : parseFloat(a)),
                                0,
                              ),
                              form.watch('currency'),
                            )}
                            {' / '}
                            {formatCurrency(parseFloat(amount) || 0, form.watch('currency'))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="shareMemberIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split With</FormLabel>
                  <FormDescription>Select who should share this expense (can be multiple)</FormDescription>
                  <div className="space-y-2 mt-2">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value?.includes(member.id)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            let newValue: string[];
                            if (checked) {
                              newValue = [...currentValue, member.id];
                            } else {
                              newValue = currentValue.filter((id) => id !== member.id);
                            }
                            field.onChange(newValue);
                            handleShareMemberIdsChange(newValue);
                          }}
                        />
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {member.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="split_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="even">Split equally</SelectItem>
                      <SelectItem value="percentage">Split by percentage</SelectItem>
                      <SelectItem value="amount">Split by amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {splitType === 'even' && 'The expense will be split equally among selected members'}
                    {splitType === 'percentage' && 'Enter percentage for each member (must total 100%)'}
                    {splitType === 'amount' && 'Enter exact amount for each member (must total expense amount)'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {splitType === 'percentage' && shareMemberIds.length > 0 && (
              <div className="space-y-3 border rounded-sm p-4">
                <FormLabel>Percentage Split</FormLabel>
                <FormDescription className="mb-3">Total must equal 100%</FormDescription>
                {shareMemberIds.map((memberId) => {
                  const member = members.find((m) => m.id === memberId);
                  if (!member) return null;

                  const currentPercent = percentages?.[memberId] || '';
                  const totalAmount = parseFloat(amount) || 0;
                  const percentValue = parseFloat(currentPercent) || 0;
                  const shareAmount = (totalAmount * percentValue) / 100;

                  return (
                    <div key={memberId} className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-sm font-medium">{member.name}</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={currentPercent}
                          onChange={(e) => {
                            const newPercentages = { ...percentages, [memberId]: e.target.value };
                            form.setValue('percentages', newPercentages);
                          }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground pt-6">
                        {!isNaN(percentValue) && totalAmount > 0
                          ? formatCurrency(shareAmount, form.watch('currency'))
                          : '-'}
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span>Total:</span>
                    <span>
                      {Object.values(percentages || {})
                        .reduce((sum, p) => sum + (isNaN(parseFloat(p)) ? 0 : parseFloat(p)), 0)
                        .toFixed(2)}
                      %
                    </span>
                  </div>
                </div>
              </div>
            )}

            {splitType === 'amount' && shareMemberIds.length > 0 && (
              <div className="space-y-3 border rounded-sm p-4">
                <FormLabel>Amount Split</FormLabel>
                <FormDescription className="mb-3">Total must equal expense amount</FormDescription>
                {shareMemberIds.map((memberId) => {
                  const member = members.find((m) => m.id === memberId);
                  if (!member) return null;

                  const currentAmount = amounts?.[memberId] || '';

                  return (
                    <div key={memberId} className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-sm font-medium">{member.name}</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={currentAmount}
                          onChange={(e) => {
                            const newAmounts = { ...amounts, [memberId]: e.target.value };
                            form.setValue('amounts', newAmounts);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span>Total:</span>
                    <span>
                      {formatCurrency(
                        Object.values(amounts || {}).reduce(
                          (sum, a) => sum + (isNaN(parseFloat(a)) ? 0 : parseFloat(a)),
                          0,
                        ),
                        form.watch('currency'),
                      )}
                      {' / '}
                      {formatCurrency(parseFloat(amount) || 0, form.watch('currency'))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateExpense.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateExpense.isPending}>
                {updateExpense.isPending ? 'Updating...' : 'Update Expense'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
