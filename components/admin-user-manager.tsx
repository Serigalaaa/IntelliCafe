"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Trash2,
  Mail,
  Calendar,
  Loader2,
  ShieldAlert,
  Phone,
  Eye,
  Users,
} from "lucide-react";
import { useGlobalModal } from "@/components/providers/modal-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  createdAt?: string;
}

export function AdminUserManager() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  const handleDeleteClick = (id: string, role: string) => {
    if (role === "admin") {
      showError("Action Denied", "You cannot delete an Admin account.");
      return;
    }

    showConfirm(
      "Delete User?",
      "Are you sure you want to delete this user? This account will be permanently removed.",
      () => performDelete(id),
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
        if (selectedUser?._id === id) setIsDetailOpen(false);
      } else {
        showError("Error", "Failed to delete user.");
      }
    } catch (error) {
      showError("System Error", "Could not connect to server.");
    }
  };

  const handleViewDetails = (user: UserData) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Registered Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage accounts ({users.length} total)
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchUsers}>
          Refresh List
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/20 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No users found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user._id} className="overflow-hidden">
              <div className="flex items-center justify-between p-4">
                {/* Left: Info */}
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback
                      className={
                        user.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : ""
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

                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </span>
                      {user.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {user.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleViewDetails(user)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-blue-500" />
                  </Button>

                  {user.role !== "admin" ? (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(user._id, user.role)}
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  ) : (
                    /* FIX: Moved 'title' prop to the wrapper div */
                    <div
                      className="w-10 flex justify-center cursor-help"
                      title="Admin Protected"
                    >
                      <ShieldAlert className="w-4 h-4 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Account Information</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <Badge variant="outline" className="capitalize">
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedUser.email}</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedUser.phone || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                {selectedUser.role !== "admin" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() =>
                      handleDeleteClick(selectedUser._id, selectedUser.role)
                    }
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
