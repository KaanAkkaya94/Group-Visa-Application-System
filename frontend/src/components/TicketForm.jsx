import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const TicketForm = ({
  tickets,
  setTickets,
  editingTicket,
  setEditingTicket,
}) => {
  const TICKET_STATUS = ["In Progress", "Completion"];
  const today = new Date().toISOString().split("T")[0];
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    ticketNo: "",
    username: user.name,
    subject: "",
    email: user.email,
    message: "",
    createdAt: today,
    status: "In Progress",
  });

  useEffect(() => {
    if (editingTicket) {
      // Ensure date strings are formatted as yyyy-MM-dd for date inputs
      const formatDate = (d) => {
        if (!d) return "";
        const dateObj = new Date(d);
        if (isNaN(dateObj.getTime())) return "";
        return dateObj.toISOString().split("T")[0];
      };
      setFormData({
        ticketNo: editingTicket.ticketNo || "",
        username: editingTicket.username || user.name,
        subject: editingTicket.subject || "",
        email: editingTicket.email || user.email,
        message: editingTicket.message || "",
        createdAt:
          editingTicket.createdAt || formatDate(editingTicket.createdAt),
        status: editingTicket.status || "In Progress",
      });
    } else {
      setFormData({
        ticketNo: "",
        username: user.name,
        subject: "",
        email: user.email,
        message: "",
        createdAt: today,
        status: "In Progress",
      });
    }
  }, [editingTicket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTicket) {
        const response = await axiosInstance.put(
          `/api/tickets/${editingTicket._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setTickets(
          tickets.map((ticket) =>
            ticket._id === response.data._id ? response.data : ticket
          )
        );
      } else {
        const response = await axiosInstance.post("/api/tickets", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTickets([...tickets, response.data]);
      }
      setEditingTicket(null);
      setFormData({
        ticketNo: "",
        username: user.name,
        subject: "",
        email: user.email,
        message: "",
        createdAt: today,
        status: "In Progress",
      });
    } catch (error) {
      console.error(
        "Failed to save ticket",
        error?.response?.data || error.message
      );
      alert("Failed to save ticket.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded mb-6"
    >
      <h1 className="text-2xl font-bold mb-4">
        {editingTicket ? "Update Ticket" : "Create New Ticket"}
      </h1>
      <input
        type="text"
        placeholder="User Name"
        value={formData.username}
        readOnly
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <textarea
        type="text"
        placeholder="Message with 300 characters only"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        maxLength={300}
      />
      {user.admin && editingTicket && (
        <select
          value={formData.status || ""}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">-- Choose Status --</option>
          {TICKET_STATUS.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {editingTicket ? "Update Ticket" : "Submit Ticket"}
      </button>
    </form>
  );
};

export default TicketForm;
