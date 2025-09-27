import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";
import { useAuth } from "../context/AuthContext";

const TicketSystemPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [ticketNo, setTicketNo] = useState("");
  const [editingTicket, setEditingTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get("/api/tickets", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!response) return setTickets([]);
        setTickets(response.data);
      } catch (error) {
        alert("Failed to fetch tickets.");
      }
    };

    fetchTickets();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      {(!user.admin || (user.admin && editingTicket)) && (
        <TicketForm
          tickets={tickets}
          setTickets={setTickets}
          editingTicket={editingTicket}
          setEditingTicket={setEditingTicket}
        />
      )}

      <TicketList
        tickets={tickets}
        setTickets={setTickets}
        editingTicket={editingTicket}
        setEditingTicket={setEditingTicket}
      />
    </div>
  );
};

export default TicketSystemPage;
