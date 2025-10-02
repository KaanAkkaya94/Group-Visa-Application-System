import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import UsersList from "../components/UsersList";
import { useAuth } from "../context/AuthContext";

const UsersManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState({});
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/auth", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(response.data);
      } catch (error) {}
    };

    if (user.admin) {
      fetchAllUsers();
    }
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <UsersList
        users={users}
        setUsers={setUsers}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
      />
    </div>
  );
};

export default UsersManagement;
