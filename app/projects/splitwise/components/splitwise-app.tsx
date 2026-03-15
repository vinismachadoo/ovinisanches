"use client"

import { parseAsString, useQueryState } from "nuqs"
import { MembersList } from "./members-list"
import { ExpensesList } from "./expenses-list"
import { BalanceView } from "./balance-view"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/default/ui/tabs"
import { SidebarTrigger } from "@/registry/default/ui/sidebar"
import { Users, Receipt, TrendingUp } from "lucide-react"
import { useGroup } from "@/app/projects/splitwise/hooks/use-groups"

export function SplitwiseApp() {
  const [selectedGroupId] = useQueryState("group_id", parseAsString)

  const { data: group } = useGroup(selectedGroupId)

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-(--header-height) items-center gap-4 border-b px-6">
        <SidebarTrigger />
        <span className="text-lg font-medium">{group?.name}</span>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {selectedGroupId ? (
          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="members">
                <Users className="mr-2 h-4 w-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="expenses">
                <Receipt className="mr-2 h-4 w-4" />
                Expenses
              </TabsTrigger>
              <TabsTrigger value="balance">
                <TrendingUp className="mr-2 h-4 w-4" />
                Balance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="mt-6">
              <MembersList groupId={selectedGroupId} />
            </TabsContent>

            <TabsContent value="expenses" className="mt-6">
              <ExpensesList groupId={selectedGroupId} />
            </TabsContent>

            <TabsContent value="balance" className="mt-6">
              <BalanceView groupId={selectedGroupId} />
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Group Selected</CardTitle>
              <CardDescription>
                Create a new group or select an existing one to get started
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}
