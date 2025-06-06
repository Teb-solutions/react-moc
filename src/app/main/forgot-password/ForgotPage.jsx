import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CardContent from "@mui/material/CardContent";
import _ from "@lodash";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import JwtLoginTab from "./tabs/JwtSignInTab";
import FirebaseSignInTab from "./tabs/FirebaseSignInTab";

const tabs = [
  {
    id: "jwt",
    title: "JWT",
    logo: "assets/images/logo/jwt.svg",
    logoClass: "h-40 p-4 bg-black rounded-12",
  },
  {
    id: "firebase",
    title: "Firebase",
    logo: "assets/images/logo/firebase.svg",
    logoClass: "h-40",
  },
];

/**
 * The sign in page.
 */
function ForgotPage() {
  const [selectedTabId, setSelectedTabId] = useState(tabs[0].id);

  function handleSelectTab(id) {
    setSelectedTabId(id);
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
      <Paper className="h-full w-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-64 md:shadow-none">
        <CardContent className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
          <img
            className="w-48"
            src="assets/images/logo/TotalEnergies_Logo_RGB.png"
            alt="logo"
          />

          <Typography className="mt-32 text-4xl font-extrabold leading-tight  tracking-tight">
            Forgot password?
          </Typography>
          <div className="mt-2 flex items-baseline font-medium">
            <Typography>Fill the form to reset your password</Typography>
          </div>

          <JwtLoginTab />
          {/* {selectedTabId === 'firebase' && <FirebaseSignInTab />} */}
          <Typography className="mt-32 text-1xl  leading-tight tracking-tight">
            Return to
            <Link to={"/sign-in"} className="text-blue">
              {" "}
              sign in
            </Link>
          </Typography>
        </CardContent>
      </Paper>

      <Box
        className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
        sx={{ backgroundColor: "primary.main" }}
      >
        <svg
          className="pointer-events-none absolute inset-0"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: "primary.light" }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg>
        <Box
          component="svg"
          className="absolute -right-64 -top-64 opacity-20"
          sx={{ color: "primary.light" }}
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect
            width="220"
            height="192"
            fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
          />
        </Box>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="text-7xl font-bold leading-none text-gray-100">
            <div>Welcome to</div>
            <div>Total Energies</div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default ForgotPage;
