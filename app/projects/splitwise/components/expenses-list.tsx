"use client"

import { Badge } from "@/registry/default/ui/badge"
import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu"
import { type Expense } from "@/lib/supabase"
import { format } from "date-fns"
import {
  DollarSign,
  MoreVertical,
  Pencil,
  Plus,
  Receipt,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { useExpenseDetails } from "../hooks/use-expense-details"
import { useDeleteExpense, useExpenses } from "../hooks/use-expenses"
import { useMembers } from "../hooks/use-members"
import { CreateExpenseDialog } from "./create-expense-dialog"
import { EditExpenseDialog } from "./edit-expense-dialog"

interface ExpensesListProps {
  groupId: string | null
}

export function ExpensesList({ groupId }: ExpensesListProps) {
  const { data: expenses = [] } = useExpenses(groupId)
  const { data: members = [] } = useMembers(groupId)
  const { data: expensesWithDetails = [], isLoading } = useExpenseDetails(
    groupId,
    expenses
  )
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const deleteExpense = useDeleteExpense()

  const handleDelete = (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return
    }

    if (!groupId) return

    deleteExpense.mutate({ id: expenseId, group_id: groupId })
  }

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const getSplitTypeLabel = (type: string) => {
    switch (type) {
      case "even":
        return "Even"
      case "percentage":
        return "Percentage"
      case "amount":
        return "Custom"
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading expenses...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Expenses</CardTitle>
          </div>
          <CardAction>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="sm"
              disabled={members.length === 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.length === 0 ? (
          <div className="py-8 text-center">
            <Receipt className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              Add members first before creating expenses
            </p>
          </div>
        ) : expensesWithDetails.length === 0 ? (
          <div className="py-8 text-center">
            <Receipt className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-sm text-muted-foreground">
              No expenses yet. Add your first expense!
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add First Expense
            </Button>
          </div>
        ) : (
          expensesWithDetails.map((expense) => (
            <div
              key={expense.id}
              className="group space-y-3 rounded-sm border p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-medium">{expense.description}</h3>
                    <Badge variant="outline">
                      {getSplitTypeLabel(expense.split_type)}
                    </Badge>
                  </div>
                  <p className="flex items-center gap-1 text-lg font-semibold text-primary">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(expense.amount, expense.currency)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(expense.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100"
                      />
                    }
                  >
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingExpense(expense)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Paid by: </span>
                  <span className="font-medium">
                    {expense.payers.map((p) => p.member.name).join(", ")} (
                    {formatCurrency(
                      expense.payers.reduce(
                        (sum, p) => sum + parseFloat(p.amount.toString()),
                        0
                      ),
                      expense.currency
                    )}
                    )
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Split with: </span>
                  <span className="font-medium">
                    {expense.shares
                      .map(
                        (s) =>
                          `${s.member.name} (${formatCurrency(parseFloat(s.amount.toString()), expense.currency)})`
                      )
                      .join(", ")}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>

      {groupId && (
        <>
          <CreateExpenseDialog
            groupId={groupId}
            members={members}
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
          />

          {editingExpense && (
            <EditExpenseDialog
              expense={editingExpense}
              members={members}
              open={!!editingExpense}
              onOpenChange={(open) => !open && setEditingExpense(null)}
            />
          )}
        </>
      )}
    </Card>
  )
}
