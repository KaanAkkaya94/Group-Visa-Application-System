import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import { Link } from "react-router-dom";

const UsersList = ({ users, setUsers }) => {
  const { user } = useAuth();

  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(`/api/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      alert("Failed to delete users.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      {users
        .filter((user) => user.admin !== true)
        .map((user) => (
          <div key={user._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            <h2 className="font-bold">User Name: {user.name}</h2>
            <p className="font-bold">Email: {user.email}</p>
            <div className="mt-2">
              <Link
                to="/profile"
                state={{ selectedUser: user || {} }}
                className="btn-link mr-2 bg-red-500 text-white rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(user._id)}
                className="mr-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default UsersList;
