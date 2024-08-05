// ticketEnums.js

const TicketSourceEnum = {
  Inbound: 1,
  PhoneCall: 2,
  Email: 3,
  WhatsApp: 4,
  Others: 5,
};

const TicketCategoryEnum = {
  Information: 1,
  Payment: 2,
  Complaint: 3,
  Orders: 4,
  WhatsappLiveChat: 5,
  CustomerAppLiveChat: 6,
  Feature: 7,
  Others: 8,
};

const TicketPriorityEnum = {
  Low: 0,
  Medium: 1,
  High: 2,
};

const TicketStatusEnum = {
  Closed: 0,
  Open: 1,
  Reopened: 2,
};

export {
  TicketSourceEnum,
  TicketCategoryEnum,
  TicketPriorityEnum,
  TicketStatusEnum,
};
