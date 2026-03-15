'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type Member } from '@/lib/supabase';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/registry/dialog';
import { Button } from '@/registry/button';
import { Input } from '@/registry/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/select';
import { Checkbox } from '@/registry/checkbox';
import { Separator } from '@/registry/separator';
import { useCreateExpense } from '../hooks/use-expenses';

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

interface CreateExpenseDialogProps {
  groupId: string;
  members: Member[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateExpenseDialog({ groupId, members, open, onOpenChange }: CreateExpenseDialogProps) {
  const createExpense = useCreateExpense();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: '',
      currency: 'USD',
      payer_split_type: 'even',
      payerIds: [],
      payerPercentages: {},
      payerAmounts: {},
      split_type: 'even',
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

  // Initialize percentages and amounts when split type or share members change
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

  // Update amounts when total amount changes (for amount split)
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
    createExpense.mutate(
      {
        group_id: groupId,
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
          form.reset();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>Add a new expense and split it among members.</DialogDescription>
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
                disabled={createExpense.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createExpense.isPending}>
                {createExpense.isPending ? 'Creating...' : 'Create Expense'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
