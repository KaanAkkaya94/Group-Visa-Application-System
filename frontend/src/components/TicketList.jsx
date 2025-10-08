import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";


const TicketList = ({ tickets, setTickets, setEditingTicket }) => {
  const { user } = useAuth();

  const handleDelete = async (ticketId) => {
    try {
      await axiosInstance.delete(`/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
    } catch (error) {
      alert("Failed to delete ticket.");
    }
  };

  return (
    <div>
      {tickets.map((ticket) => (
        <div key={ticket._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">Subject: {ticket.subject}</h2>
          {user.admin === true && (
            <h3 className="font-bold">User Name: {ticket.username}</h3>
          )}
          <p className="font-bold">Ticket No: {ticket.ticketNo}</p>
          <p className="font-bold">Email: {ticket.email}</p>
          <p className="font-bold ">Message: {ticket.message}</p>

          <p className={"text-sm text-gray-500"}>
            Status:{" "}
            <span
              className={`${
                ticket.status === "In Progress"
                  ? "text-blue-600"
                  : "text-green-600"
              }`}
            >
              {ticket.status}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Created Date:{" "}
            {new Date(ticket.createdAt).toLocaleDateString("en-GB")}
          </p>
          <div className="mt-2">
            {ticket.status !== "Completion" && (
              <button
                onClick={() => setEditingTicket(ticket)}
                className="mr-2 bg-yellow-600 text-white rounded"
              >
                Edit
              </button>
            )}
            {ticket.status !== "Completion" && (
              <button
                onClick={() => handleDelete(ticket._id)}
                className="mr-2 bg-red-500 text-white  rounded"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList;
