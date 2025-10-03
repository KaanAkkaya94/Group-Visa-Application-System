import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import UsersList from "../components/UsersList";
import { useAuth } from "../context/AuthContext";

const UsersManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/user", {
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
      <UsersList users={users} setUsers={setUsers} />
    </div>
  );
};

export default UsersManagement;
