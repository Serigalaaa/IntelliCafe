"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminMenuManager } from "@/components/admin-menu-manager";
import { AdminFeedbackView } from "@/components/admin-feedback-view";
import { AdminStats } from "@/components/admin-stats";
import { AdminOrderManager } from "@/components/admin-order-manager";
import { AdminUserManager } from "@/components/admin-user-manager";
import { AdminVoucherManager } from "@/components/admin-voucher-manager";

// Standardize Icons using Lucide React
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Users,
  Ticket,
  MessageSquare,
} from "lucide-react";

export function AdminDashboard() {
  return (
    <Tabs defaultValue="stats" className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <TabsList className="grid w-full grid-cols-6 max-w-5xl h-auto p-1 bg-muted/50">
        <TabsTrigger
          value="stats"
          className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>

        <TabsTrigger
          value="orders"
          className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Orders</span>
        </TabsTrigger>

        <TabsTrigger
          value="menu"
          className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span className="hidden sm:inline">Menu</span>
        </TabsTrigger>

        <TabsTrigger
          value="users"
          className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Users</span>
        </TabsTrigger>

        <TabsTrigger
          value="vouchers"
          className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Ticket className="w-4 h-4" />
          <span className="hidden sm:inline">Vouchers</span>
        </TabsTrigger>

        <TabsTrigger
          value="feedback"
          className="flex items-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Feedback</span>
        </TabsTrigger>
      </TabsList>

      {/* Content Sections */}
      <TabsContent value="stats" className="space-y-4">
        <AdminStats />
      </TabsContent>

      <TabsContent value="orders" className="space-y-4">
        <AdminOrderManager />
      </TabsContent>

      <TabsContent value="menu" className="space-y-4">
        <AdminMenuManager />
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        <AdminUserManager />
      </TabsContent>

      <TabsContent value="vouchers" className="space-y-4">
        <AdminVoucherManager />
      </TabsContent>

      <TabsContent value="feedback" className="space-y-4">
        <AdminFeedbackView />
      </TabsContent>
    </Tabs>
  );
}
