"use client";

import { useEffect, useState } from "react";
import { useAuth, type AdminUser } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit2, Trash2, X, UserPlus, Save } from "lucide-react";
import AddOwnerModal from "./AddOwnerModal";

const ROLE_STYLES: Record<string, string> = {
  customer: "bg-blue-100 text-blue-700 border-blue-200",
  owner: "bg-[#C4622D]/10 text-[#C4622D] border-[#dabcac]",
  admin: "bg-purple-100 text-purple-700 border-purple-200",
};

export default function AdminUsers() {
  const { getAdminUsers, deleteAdminUser, updateAdminUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOwnerModalOpen, setIsAddOwnerModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState<{ email: string; role: string; name: string }>({
    email: "",
    role: "customer",
    name: "",
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(query) ||
      (user.customer_name && user.customer_name.toLowerCase().includes(query)) ||
      user.role.toLowerCase().includes(query)
    );
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteAdminUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (user: AdminUser) => {
    setEditingUser(user);
    setEditForm({
      email: user.email,
      role: user.role,
      name: user.customer_name || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    if (!editForm.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      await updateAdminUser(editingUser.id, {
        email: editForm.email,
        role: editForm.role,
        name: editForm.name,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                email: editForm.email,
                role: editForm.role,
                customer_name: editForm.name,
              }
            : u
        )
      );
      setEditingUser(null);
      toast.success("User updated successfully");
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-dm-serif)" }}>
              Users
            </h2>
            <p className="text-sm text-[#7A6150] pb-2">Manage all platform users and their roles.</p>
          </div>
          <Button
            onClick={() => setIsAddOwnerModalOpen(true)}
            className="bg-[#C4622D] hover:bg-[#A8501F] text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Owner
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-[#7A6150]">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AddOwnerModal
        isOpen={isAddOwnerModalOpen}
        onClose={() => setIsAddOwnerModalOpen(false)}
        onSuccess={() => {
          setIsAddOwnerModalOpen(false);
          fetchUsers();
        }}
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-dm-serif)" }}>
            Users
          </h2>
          <p className="text-sm text-[#7A6150] pb-2">Manage all platform users and their roles.</p>
        </div>
        <Button
          onClick={() => setIsAddOwnerModalOpen(true)}
          className="bg-[#C4622D] hover:bg-[#A8501F] text-white"
        >
          <UserPlus className="w-4 h-4 mr-1" />
          Add Owner
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6150]/60" />
        <Input
          type="text"
          placeholder="Search by email, name, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#dabcac] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-[#7A6150]">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    {editingUser?.id === user.id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="max-w-xs"
                            placeholder="User name"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="max-w-xs"
                            placeholder="Email"
                          />
                        </TableCell>
                        <TableCell>
                          <select
                            value={editForm.role}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            className="px-3 py-1.5 rounded-lg border border-[#dabcac] bg-[#F2E8DB] text-sm text-[#7A6150] focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 cursor-pointer"
                          >
                            <option value="customer">Customer</option>
                            <option value="owner">Owner</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-[#7A6150]/60">{user.has_customer_profile ? "Completed" : "Incomplete"}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-[#7A6150]/60">{formatDate(user.created_at)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="bg-[#4A7C59] hover:bg-[#3D6A4A] text-white"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#C4622D]/10 flex items-center justify-center">
                              <span className="text-[#C4622D] font-bold text-xs">
                                {user.customer_name
                                  ? user.customer_name.charAt(0).toUpperCase()
                                  : user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {user.customer_name || "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#7A6150]">{user.email}</TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${ROLE_STYLES[user.role] || ROLE_STYLES.customer}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${user.has_customer_profile ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                            {user.has_customer_profile ? "Completed" : "Incomplete"}
                          </span>
                        </TableCell>
                        <TableCell className="text-[#7A6150] text-sm">{formatDate(user.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartEdit(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(user.id)}
                              disabled={deletingId === user.id}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
