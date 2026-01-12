"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminMenuManager } from "@/components/admin-menu-manager"
import { AdminFeedbackView } from "@/components/admin-feedback-view"
import { AdminStats } from "@/components/admin-stats"

export function AdminDashboard() {
  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-md">
        <TabsTrigger value="stats">Statistics</TabsTrigger>
        <TabsTrigger value="menu">Menu</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
      </TabsList>

      <TabsContent value="stats" className="mt-6">
        <AdminStats />
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
