import AppBar from "@mui/material/AppBar";
import { ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography"; // Add this for text
import Link from "@mui/material/Link"; // Add this for the TEBS link
import { memo } from "react";
import { selectFooterTheme } from "@fuse/core/FuseSettings/fuseSettingsSlice";
import clsx from "clsx";
import { useAppSelector } from "app/store/hooks";

/**
 * The footer layout 1.
 */
function FooterLayout1(props) {
  const { className } = props;
  const footerTheme = useAppSelector(selectFooterTheme);

  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar
        id="fuse-footer"
        className={clsx("relative z-20 shadow", className)}
        color="default"
        sx={{
          backgroundColor: "white", // Light grey background
          elevation: 0,
          padding: "16px 0", // Add padding to the footer
        }}
        position="static"
      >
        <Toolbar className="min-h-48 md:min-h-24 px-8 sm:px-12 py-0 flex items-center justify-start">
          {/* Centered content */}
          <Typography
            variant="body2"
            color="textSecondary"
            className="text-black"
          >
            TotalEnergies © 2024 Powered by{" "}
            <Link
              href="https://www.tebs.co.in/"
              target="_blank"
              rel="noopener"
              underline="hover"
              style={{ backgroundColor: "white", color: "blue" }}
            >
              TEBS
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(FooterLayout1);
