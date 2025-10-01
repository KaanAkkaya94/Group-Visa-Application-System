const Ticket = require("../models/Ticket");
const TicketNo = require("../models/TicketNo");

const TicketService = require("../service/TicketService");
const AdminTicketFetchStrategy = require("../strategy/AdminTicketFetchStrategy");
const UserTicketFetchStrategy = require("../strategy/UserTicketFetchStrategy");

class TicketController {
  constructor() {
    this.ticketService = new TicketService(new UserTicketFetchStrategy());
  }

  //fetches all tickets
  async getTickets(req, res) {
    try {
      const strategy = req.user.admin
        ? new AdminTicketFetchStrategy()
        : new UserTicketFetchStrategy();
      this.ticketService.setStrategy(strategy);
      const tickets = await this.ticketService.getTickets(req.user);
      if (!tickets || tickets.length === 0)
        return res.status(404).json({ message: "ticket not found" });
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // creates a new ticket
  async addTicket(req, res) {
    const { username, subject, email, message, createdAt } = req.body;

    const lastTicket = await TicketNo.findOne().sort({ ticketNo: -1 });
    console.log("lastTicket", lastTicket);
    let nextTicketNo = "T00001";
    if (lastTicket) {
      const lastNumber = parseInt(lastTicket.ticketNo.substring(1), 10);
      const newNumber = lastNumber + 1;
      nextTicketNo = "T" + newNumber.toString().padStart(5, "0");
    }
    console.log("lastTicket", lastTicket);
    const newTicketNumber = new TicketNo({ ticketNo: nextTicketNo });
    await newTicketNumber.save();

    try {
      const ticket = await Ticket.create({
        userId: req.user.id,
        username,
        subject,
        message,
        createdAt,
        ticketNo: nextTicketNo,
        email,
      });
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //update an ticket in the db
  async updateTicket(req, res) {
    const { username, subject, message, email, status } = req.body;
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) return res.status(404).json({ message: "ticket not found" });
      ticket.username = username || ticket.username;
      ticket.subject = subject || ticket.subject;
      ticket.message = message || ticket.message;
      ticket.email = email || ticket.email;
      ticket.createdAt = ticket.createdAt;
      ticket.ticketNo = ticket.ticketNo;
      ticket.status = status || ticket.status;
      const updatedTicket = await ticket.save();
      res.json(updatedTicket);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //delete a single ticket from the db
  async deleteTicket(req, res) {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) return res.status(404).json({ message: "ticket not found" });
      await ticket.remove();
      res.json({ message: "ticket deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

// const getTicket = async (req, res) => {
//   try {
//     const ticket = await Ticket.findById(req.params.id);
//     if (!ticket) return res.status(404).json({ message: "ticket not found" });
//     res.json(ticket);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //fetches all tickets
// const getTickets = async (req, res) => {
//   try {
//     const tickets = req.user.admin
//       ? await Ticket.find({})
//       : await Ticket.find({ userId: req.user.id });
//     if (!tickets) return res.status(404).json({ message: "ticket not found" });
//     res.json(tickets);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // creates a new ticket
// const addTicket = async (req, res) => {
//   const { username, subject, email, message, createdAt } = req.body;

//   const lastTicket = await TicketNo.findOne().sort({ ticketNo: -1 });
//   console.log("lastTicket", lastTicket);
//   let nextTicketNo = "T00001";
//   if (lastTicket) {
//     const lastNumber = parseInt(lastTicket.ticketNo.substring(1), 10);
//     const newNumber = lastNumber + 1;
//     nextTicketNo = "T" + newNumber.toString().padStart(5, "0");
//   }
//   console.log("lastTicket", lastTicket);
//   const newTicketNumber = new TicketNo({ ticketNo: nextTicketNo });
//   await newTicketNumber.save();

//   try {
//     const ticket = await Ticket.create({
//       userId: req.user.id,
//       username,
//       subject,
//       message,
//       createdAt,
//       ticketNo: nextTicketNo,
//       email,
//     });
//     res.status(201).json(ticket);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //update an ticket in the db
// const updateTicket = async (req, res) => {
//   const { username, subject, message, email, status } = req.body;
//   try {
//     const ticket = await Ticket.findById(req.params.id);
//     if (!ticket) return res.status(404).json({ message: "ticket not found" });
//     ticket.username = username || ticket.username;
//     ticket.subject = subject || ticket.subject;
//     ticket.message = message || ticket.message;
//     ticket.email = email || ticket.email;
//     ticket.createdAt = ticket.createdAt;
//     ticket.ticketNo = ticket.ticketNo;
//     ticket.status = status || ticket.status;
//     const updatedTicket = await ticket.save();
//     res.json(updatedTicket);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //delete a single ticket from the db
// const deleteTicket = async (req, res) => {
//   try {
//     const ticket = await Ticket.findById(req.params.id);
//     if (!ticket) return res.status(404).json({ message: "ticket not found" });
//     await ticket.remove();
//     res.json({ message: "ticket deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getTickets,
//   getTicket,
//   addTicket,
//   updateTicket,
//   deleteTicket,
// };

module.exports = new TicketController();
