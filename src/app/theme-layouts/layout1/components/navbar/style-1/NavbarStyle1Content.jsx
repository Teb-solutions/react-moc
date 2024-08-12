import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import clsx from "clsx";
import FuseScrollbars from "@fuse/core/FuseScrollbars";
import { styled } from "@mui/material/styles";
import Navigation from "app/theme-layouts/shared-components/navigation/Navigation";
import NavbarToggleButton from "app/theme-layouts/shared-components/navbar/NavbarToggleButton";
import Logo from "../../../../shared-components/Logo";

const Root = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  position: "relative",
  height: "100vh",
}));

const StyledContent = styled(FuseScrollbars)(() => ({
  overscrollBehavior: "contain",
  overflowX: "hidden",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 40px, 100% 10px",
  backgroundAttachment: "local, scroll",
}));

function NavbarStyle1Content(props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const handleMouseEnter = () => !isMobile && setIsExpanded(true);
  const handleMouseLeave = () => !isMobile && setIsExpanded(false);

  return (
    <Root
      style={{
        width: isMobile || isExpanded ? "350px" : "80px",
        transition: "width 0.3s ease",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex h-48 shrink-0 flex-row items-center px-20 md:h-72"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <div
          className="mx-4 flex flex-1 justify-center"
          style={{ flex: 1, display: "flex", justifyContent: "center" }}
        >
          <img
            className="w-32"
            src="assets/images/logo/Logo-Total.png"
            alt="logo"
          />
        </div>

        <NavbarToggleButton className="h-40 w-40 p-0" />
      </div>

      <StyledContent
        className="flex min-h-0 flex-1 flex-col"
        option={{ suppressScrollX: true, wheelPropagation: false }}
        style={{ flex: 1, overflow: "auto" }}
      >
        <Navigation layout="vertical" />
      </StyledContent>
    </Root>
  );
}

export default NavbarStyle1Content;
