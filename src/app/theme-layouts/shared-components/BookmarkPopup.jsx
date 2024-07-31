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
      <div className="grid grid-cols-2 grid-flow-row">
        <div class="relative group flex flex-col overflow-hidden bg-card border-r border-b even:border-r-0 hover:bg-gray-50 dark:hover:bg-black dark:hover:bg-opacity-5">
          <a target="_blank" class="flex flex-col items-center justify-center w-full h-full py-6 no-underline" href="#">
            <div class="relative flex flex-shrink-0 items-center justify-center icon_size mb-3 rounded-full ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>           
            </div>
            <div class="font-medium text-center ng-star-inserted">Documentation</div>
            <div class="text-md text-center text-secondary ng-star-inserted">Getting started</div>
          </a>
        </div>
        <div class="relative group flex flex-col overflow-hidden bg-card border-r border-b even:border-r-0 hover:bg-gray-50 dark:hover:bg-black dark:hover:bg-opacity-5 ">
            <a target="_blank" class="flex flex-col items-center justify-center w-full h-full py-6 no-underline " href="#">
                <div class="relative flex flex-shrink-0 items-center justify-center icon_size mb-3 rounded-full ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </div>
                <div class="font-medium text-center ">
                    Whatsapp Support
                </div>
                <div class="text-md text-center text-secondary ">
                    Your queries
                </div>
            </a>
        </div>

        <div class="relative group flex flex-col overflow-hidden bg-card border-r border-b even:border-r-0 hover:bg-gray-50 dark:hover:bg-black dark:hover:bg-opacity-5 ">
            <a class="flex flex-col items-center justify-center w-full h-full py-6 no-underline " href="#">
                <div class="relative flex flex-shrink-0 items-center justify-center icon_size mb-3 rounded-full ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                    </svg>
                </div>
                <div class="font-medium text-center ">Dashboard</div>
                <div class="text-md text-center text-secondary ">User analytics</div>
            </a>
        </div>


        <div class="relative group flex flex-col overflow-hidden bg-card border-r border-b even:border-r-0 hover:bg-gray-50 dark:hover:bg-black dark:hover:bg-opacity-5 ">
            <a class="flex flex-col items-center justify-center w-full h-full py-6 no-underline " href="#">
                <div class="relative flex flex-shrink-0 items-center justify-center icon_size rounded-full ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div class="font-medium text-center ">
                    Tasks
                </div>
                <div class="text-md text-center text-secondary ">
                    Your pending tasks
                </div>
            </a>
        </div>



      </div>
    </>
  );
};

export default BookmarkPopup;
