"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  MessageSquare,
  Users,
  DollarSign,
  Download,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
// CHANGED: Imported ComposedChart and Line
import {
  ComposedChart,
  Line,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function AdminStats() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalFeedback: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState("weekly");

  const fetchStats = async () => {
    try {
      const statsRes = await fetch("/api/admin/stats");
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchGraphData = async () => {
    try {
      const graphRes = await fetch(`/api/admin/analytics?range=${chartRange}`);
      const data = await graphRes.json();
      setGraphData(data);
    } catch (error) {
      console.error("Failed to fetch graph:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchGraphData()]).finally(() =>
      setLoading(false),
    );
  }, [chartRange]);

  const handleRefresh = () => {
    setLoading(true);
    Promise.all([fetchStats(), fetchGraphData()]).finally(() =>
      setLoading(false),
    );
  };

  const handleDownloadReport = async () => {
    try {
      const res = await fetch("/api/orders");
      const orders = await res.json();
      const headers = ["Order Number,Date,Status,Total Amount (RM),Items\n"];
      const rows = orders.map((order: any) => {
        const date = new Date(order.createdAt).toLocaleDateString();
        const items = order.items
          .map((i: any) => `${i.quantity}x ${i.name}`)
          .join(" | ");
        return `${order.orderNumber},${date},${order.status},${order.totalAmount.toFixed(2)},"${items}"`;
      });
      const csvContent = headers.concat(rows).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `sales_report_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate report");
    }
  };

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "All time orders",
    },
    {
      title: "Total Revenue",
      value: `RM${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "Paid orders only",
    },
    {
      title: "Feedback",
      value: stats.totalFeedback,
      icon: MessageSquare,
      description: "Customer reviews",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered accounts",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* REVENUE & ORDERS CHART */}
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Analytics
              </CardTitle>
              <CardDescription>Revenue vs Orders (Completed)</CardDescription>
            </div>

            <Select value={chartRange} onValueChange={setChartRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Last 7 Days</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>

          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {/* CHANGED: ComposedChart to support Bars and Lines */}
                  <ComposedChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    {/* LEFT Y-AXIS: REVENUE */}
                    <YAxis
                      yAxisId="left"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `RM${value}`}
                    />
                    {/* RIGHT Y-AXIS: ORDER COUNT */}
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#ff7300"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === "total")
                          return [`RM${value.toFixed(2)}`, "Revenue"];
                        if (name === "count") return [`${value}`, "Orders"];
                        return [value, name];
                      }}
                    />
                    {/* BAR FOR REVENUE */}
                    <Bar
                      yAxisId="left"
                      dataKey="total"
                      fill="currentColor"
                      radius={[4, 4, 0, 0]}
                      className="fill-primary"
                      barSize={40}
                    />
                    {/* LINE FOR ORDER COUNT */}
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="count"
                      stroke="#ff7300"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ACTIONS CARD */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your reports and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">Sales Report</p>
                <p className="text-sm text-muted-foreground">
                  Export all orders to CSV
                </p>
              </div>
              <Button onClick={handleDownloadReport} className="gap-2">
                <Download className="w-4 h-4" /> Download
              </Button>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">System Status</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                Live Database Connection
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Charts update automatically when orders are marked as
                "Completed".
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
