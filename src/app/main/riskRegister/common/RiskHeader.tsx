import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

interface MocHeaderProps {
  activity?: string;
  reqno?: string;
  risk?: string;
  master?: string;
  type?: string;
  home?: boolean;
  verName?: string;
  name?: string;
  sidemenu?: boolean;
  evaluation?: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  leftSidebarOpen: boolean;
}

function RiskHeader(props: MocHeaderProps) {
  const {
    activity,
    reqno,
    risk,
    master,
    type,
    home,
    evaluation,
    verName,
    name,
    sidemenu,
    setLeftSidebarOpen,
    leftSidebarOpen,
  } = props;
  const routeParams = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleClick = (event) => {
    navigate("/risk/initiate");

    // setAnchorEl(event.currentTarget);
  };

  const urlContainsMocOrRisk = path === "/moc" || path === "/risk";
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <div
      className={`flex d-sm-block flex-1 w-full items-center justify-between ${evaluation ? "p-0" : "pt-24 px-24"}`}
      style={{
        backgroundColor: Object.keys(routeParams).length !== 0 ? "" : "",
      }}
    >
      <div>
        <Breadcrumbs
          separator={<FuseSvgIcon>heroicons-solid:chevron-right</FuseSvgIcon>}
          aria-label="breadcrumb"
        >
          <Link
            className="font-medium hover:underline text-blue"
            key="1"
            color="inherit"
            to="/dashboards/project"
            style={{ textDecoration: "none" }}
          >
            Home
          </Link>
          <Link
            className="font-medium hover:underline text-blue"
            key="1"
            color="inherit"
            to="/risk"
            style={{ textDecoration: "none" }}
          >
            Risk Register
          </Link>

          {name && (
            <Typography className="font-medium" key="3" color="text.primary">
              {name}
            </Typography>
          )}
        </Breadcrumbs>

        <div className="flex sm:hidden" />
      </div>
      {home && (
        <div className="mt-10 md:mt-0" style={{ justifyContent: "end" }}>
          <Button
            className=""
            variant="contained"
            color="secondary"
            onClick={handleClick}
          >
            <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
            <span className="mx-4 sm:mx-8">Initiate New Risk Register</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export default RiskHeader;
