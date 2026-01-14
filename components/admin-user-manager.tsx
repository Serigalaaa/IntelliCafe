"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Trash2,
  Mail,
  Calendar,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { useGlobalModal } from "@/components/providers/modal-provider";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
}

export function AdminUserManager() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. Destructure showConfirm
  const { showSuccess, showError, showConfirm } = useGlobalModal();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Updated Delete Handler
  const handleDeleteClick = (id: string, role: string) => {
    // Replaced alert() with consistent showError()
    if (role === "admin") {
      showError("Action Denied", "You cannot delete an Admin account for security reasons.");
      return;
    }

    // Replaced confirm() with consistent showConfirm()
    showConfirm(
      "Delete User?",
      "Are you sure you want to delete this user? This account will be permanently removed.",
      () => performDelete(id)
    );
  };

  const performDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showSuccess("User Deleted", "The account has been removed.");
        setUsers(users.filter((u) => u._id !== id));
      } else {
        showError("Error", "Failed to delete user.");
      }
    } catch (error) {
      showError("System Error", "Could not connect to server.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Registered Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage accounts and permissions ({users.length} total)
          </p>
        </div>
        <Button variant="outline" onClick={fetchUsers}>
          Refresh List
        </Button>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback
                  className={
                    user.role === "admin" ? "bg-primary/10 text-primary" : ""
                  }
                >
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{user.name}</h4>
                  {user.role === "admin" && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      Admin
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {user.email}
                  </span>
                  {user.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Joined{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user.role !== "admin" ? (
              // 3. Use new handler
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteClick(user._id, user.role)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            ) : (
              <ShieldAlert className="w-4 h-4 text-muted-foreground/30" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}