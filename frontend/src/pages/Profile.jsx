import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  let { user } = useAuth(); // Access user token from context
  let { selectedUser } = location.state || {};
  const hasSelectedUser =
    selectedUser &&
    typeof selectedUser === "object" &&
    Object.keys(selectedUser).length > 0;
  const [formData, setFormData] = useState({
    name: selectedUser?.name || "",
    email: selectedUser?.email || "",
    city: selectedUser?.city || "",
    address: selectedUser?.address || "",
    phone: selectedUser?.phone || "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch profile data from the backend
    if (user.admin && hasSelectedUser) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setFormData({
          name: response.data.name,
          email: response.data.email,
          city: response.data.city || "",
          postalcode: response.data.postalcode || "",
          address: response.data.address || "",
          phone: response.data.phone || "",
        });
      } catch (error) {
        alert("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, hasSelectedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const api =
        user.admin && hasSelectedUser
          ? `/api/auth/profile/${selectedUser._id}`
          : "/api/auth/profile";
      await axiosInstance.put(api, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Phone number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
