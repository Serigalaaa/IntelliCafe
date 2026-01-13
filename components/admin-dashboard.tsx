"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminMenuManager } from "@/components/admin-menu-manager"
import { AdminFeedbackView } from "@/components/admin-feedback-view"
import { AdminStats } from "@/components/admin-stats"
// Import the new Order Manager component
import { AdminOrderManager } from "@/components/admin-order-manager" 

export function AdminDashboard() {
  return (
    <Tabs defaultValue="stats" className="w-full">
      {/* Updated grid cols to 4 to fit the new tab */}
      <TabsList className="grid w-full grid-cols-4 max-w-xl">
        <TabsTrigger value="stats">Statistics</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger> {/* New Tab Trigger */}
        <TabsTrigger value="menu">Menu</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
      </TabsList>

      <TabsContent value="stats" className="mt-6">
        <AdminStats />
      </TabsContent>

      {/* New Tab Content for Orders */}
      <TabsContent value="orders" className="mt-6">
        <AdminOrderManager />
      </TabsContent>

      <TabsContent value="menu" className="mt-6">
        <AdminMenuManager />
      </TabsContent>

      <TabsContent value="feedback" className="mt-6">
        <AdminFeedbackView />
      </TabsContent>
    </Tabs>
  )
}