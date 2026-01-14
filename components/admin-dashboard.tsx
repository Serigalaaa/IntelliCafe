"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminMenuManager } from "@/components/admin-menu-manager";
import { AdminFeedbackView } from "@/components/admin-feedback-view";
import { AdminStats } from "@/components/admin-stats";
import { AdminOrderManager } from "@/components/admin-order-manager";
import { AdminUserManager } from "@/components/admin-user-manager";
// Import the Voucher Manager
import { AdminVoucherManager } from "@/components/admin-voucher-manager";

export function AdminDashboard() {
  return (
    <Tabs defaultValue="stats" className="w-full">
      {/* FIX 1: Changed grid-cols-5 to grid-cols-6 to fit the new button */}
      <TabsList className="grid w-full grid-cols-6 max-w-4xl">
        <TabsTrigger value="stats">Statistics</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="menu">Menu</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        {/* FIX 2: Added the Vouchers Trigger */}
        <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
      </TabsList>

      <TabsContent value="stats" className="mt-6">
        <AdminStats />
      </TabsContent>

      <TabsContent value="orders" className="mt-6">
        <AdminOrderManager />
      </TabsContent>

      <TabsContent value="menu" className="mt-6">
        <AdminMenuManager />
      </TabsContent>

      <TabsContent value="users" className="mt-6">
        <AdminUserManager />
      </TabsContent>

      {/* Content for Vouchers */}
      <TabsContent value="vouchers" className="mt-6">
        <AdminVoucherManager />
      </TabsContent>

      <TabsContent value="feedback" className="mt-6">
        <AdminFeedbackView />
      </TabsContent>
    </Tabs>
  );
}