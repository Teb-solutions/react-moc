import React from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Typography, Box, Tooltip } from "@mui/material";

const BookmarkPopup = () => {
  return (
    <>
      <Box
        style={{
          padding: "30px",
          backgroundColor: "#4f46e5",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <div className="flex justify-between text-white">
          <h3>Shortcuts</h3>
          <Tooltip
            title="Mark as all read"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "black",
                  color: "white",
                  fontSize: 12,
                },
              },
            }}
          ></Tooltip>
        </div>
      </Box>
    </>
  );
};

export default BookmarkPopup;
