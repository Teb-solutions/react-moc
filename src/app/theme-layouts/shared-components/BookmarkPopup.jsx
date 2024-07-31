import React from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Typography, Box, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

const BookmarkPopup = ({ onClose }) => {
  const handleClick = (event) => {
    onClose(); // Close the popover
  };
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
      <div className="grid grid-cols-2 grid-flow-row ">
        <Link
          to={"http://wikihelp.tebs.co.in:3000/en/moc/user-manual"}
          class="relative group flex flex-col overflow-hidden bg-card border-r border-b even:border-r-0 hover:bg-gray-50 dark:hover:bg-black dark:hover:bg-opacity-5"
          onClick={handleClick}
        >
          <a
            target="_blank"
            class="flex flex-col items-center justify-center w-full h-full py-24 no-underline"
            href="http://wikihelp.tebs.co.in:3000/en/moc/user-manual"
          >
            <div class="relative flex flex-shrink-0 items-center justify-center icon_size mb-3 rounded-full ">
              <FuseSvgIcon className="text-48" size={24} color="action">
                heroicons-outline:book-open
              </FuseSvgIcon>
            </div>
            <div class="font-medium text-center ng-star-inserted pt-5">
              Documentation
            </div>
            <div class="text-md text-center text-secondary ng-star-inserted">
              Getting started
            </div>
          </a>
        </Link>
        <Link
          to={"https://chat.whatsapp.com/JHjHaErMsynJIauSASXUho"}
          class="relative group flex flex-col overflow-hidden bg-card border-r border-b even:border-r-0 hover:bg-gray-50 dark:hover:bg-black dark:hover:bg-opacity-5 "
          onClick={handleClick}
        >
          <a
            target="_blank"
            class="flex flex-col items-center justify-center w-full h-full py-24 no-underline "
            href="https://chat.whatsapp.com/JHjHaErMsynJIauSASXUho"
          >
            <div class="relative flex flex-shrink-0 items-center justify-center icon_size mb-3 rounded-full ">
              <FuseSvgIcon className="text-48" size={24} color="action">
                heroicons-outline:support
              </FuseSvgIcon>
            </div>
            <div class="font-medium text-center  pt-5 ">Whatsapp Support</div>
            <div class="text-md text-center text-secondary ">Your queries</div>
          </a>
        </Link>

        <Link
          to={"/dashboards/project"}
          class="relative group flex flex-col overflow-hidden bg-card border-r border-b even:border-r-0 hover:bg-gray-50 dark:hover:bg-black dark:hover:bg-opacity-5 "
          onClick={handleClick}
        >
          <a
            class="flex flex-col items-center justify-center w-full h-full py-24 no-underline "
            href="/dashboards/project"
          >
            <div class="relative flex flex-shrink-0 items-center justify-center icon_size mb-3 rounded-full ">
              <FuseSvgIcon className="text-48" size={24} color="action">
                heroicons-outline:chart-pie
              </FuseSvgIcon>
            </div>
            <div class="font-medium text-center  pt-5">Dashboard</div>
            <div class="text-md text-center text-secondary ">
              User analytics
            </div>
          </a>
        </Link>

        <Link
          to={"/tasks"}
          class="relative group flex flex-col overflow-hidden bg-card border-r border-b even:border-r-0 hover:bg-gray-50 dark:hover:bg-black dark:hover:bg-opacity-5 "
          onClick={handleClick}
        >
          <a
            class="flex flex-col items-center justify-center w-full h-full py-24 no-underline "
            href="/tasks"
          >
            <div class="relative flex flex-shrink-0 items-center justify-center icon_size rounded-full ">
              <FuseSvgIcon className="text-48" size={24} color="action">
                heroicons-outline:check-circle
              </FuseSvgIcon>
            </div>
            <div class="font-medium text-center  pt-5">Tasks</div>
            <div class="text-md text-center text-secondary ">
              Your pending tasks
            </div>
          </a>
        </Link>
      </div>
    </>
  );
};

export default BookmarkPopup;
