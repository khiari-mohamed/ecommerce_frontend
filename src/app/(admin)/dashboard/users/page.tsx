"use client";
import { useEffect, useState } from "react";
import { fetchUsers, addUser, updateUser, deleteUser } from "../utils/users";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import "../styles/dashboard.css";

interface User {
  _id: string;
  // ...other properties you use
}
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = user => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async user => {
    if (window.confirm("Delete this user?")) {
      await deleteUser(user._id);
      setUsers(users => users.filter(u => u._id !== user._id));
    }
  };

  const handleSave = async data => {
    if (editingUser) {
      await updateUser(editingUser._id, data);
    } else {
      await addUser(data);
    }
    setModalOpen(false);
    fetchUsers().then(setUsers);
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-section-header">
        <h1 className="dashboard-section-title">Users</h1>
        <button className="dashboard-btn" onClick={handleAdd}>Add User</button>
      </div>
      <div className="dashboard-table-wrapper">
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        user={editingUser}
      />
    </div>
  );
}