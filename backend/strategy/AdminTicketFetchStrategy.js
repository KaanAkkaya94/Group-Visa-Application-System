const Ticket = require("../models/Ticket");
const TicketFetchStrategy = require("./TicketFetchStrategy");

class AdminTicketFetchStrategy extends TicketFetchStrategy {
  async fetchTickets() {
    return Ticket.find({});
  }
}

module.exports = AdminTicketFetchStrategy;
