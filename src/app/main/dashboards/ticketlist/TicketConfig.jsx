import { authRoles } from "src/app/auth";
import Ticket from "./Ticket";

const TicketConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/ticketlist",
      element: <Ticket />,
    },
  ],
};
export default TicketConfig;
