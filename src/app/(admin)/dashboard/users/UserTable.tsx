import React from "react";

export default function UserTable({ users, onEdit, onDelete }) {
  return (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role_id}</td>
            <td>{user.phone}</td>
            <td>
              <button className="btn-edit" onClick={() => onEdit(user)}>Edit</button>
              <button className="btn-delete" onClick={() => onDelete(user)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}