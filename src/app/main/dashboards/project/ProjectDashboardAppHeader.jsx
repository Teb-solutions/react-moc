import Avatar from "@mui/material/Avatar";
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import _ from "@lodash";
import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import FuseLoading from "@fuse/core/FuseLoading";
import { darken } from "@mui/material/styles";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { useAppSelector } from "app/store/hooks";

// import { Dashboard } from "../../../../../api/Api";
import { apiAuth } from "src/utils/http";
import { Link, Navigate, useNavigate } from "react-router-dom";

/**
 * The ProjectDashboardAppHeader page.
 */
function ProjectDashboardAppHeader({ data }) {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState({
    id: 1,
    menuEl: null,
  });

  function handleChangeProject(id) {
    setSelectedProject({
      id,
      menuEl: null,
    });
  }

  function handleOpenProjectMenu(event) {
    setSelectedProject({
      id: selectedProject.id,
      menuEl: event.currentTarget,
    });
  }

  function handleCloseProjectMenu() {
    setSelectedProject({
      id: selectedProject.id,
      menuEl: null,
    });
  }

  const handelNav = (e, value) => {
    e.preventDefault();
    if (value == "session") {
      navigate("/session");
    } else if (value == "notification") {
      navigate("/notifications");
    } else {
      navigate("/tasks");
    }
  };

  return (
    <div className="flex flex-col w-full px-24 sm:px-24">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-32">
        <div className="flex flex-auto items-center min-w-0">
          <Avatar
            sx={{
              background: (theme) =>
                darken(theme.palette.background.default, 0.05),
              color: (theme) => theme.palette.text.secondary,
            }}
            className="flex-0 w-64 h-64"
            alt="user photo"
            // src={user?.data?.photoURL}
          >
            {/* {user?.data?.displayName?.[0]} */}
          </Avatar>
          <div className="flex flex-col min-w-0 mx-16">
            <Typography className="text-2xl md:text-3xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
              {/* {`Welcome back, ${user.data.displayName}!`} */}Welcome back,
              {localStorage.getItem("username")}
            </Typography>

            <div className="flex items-center">
              <FuseSvgIcon size={20} color="action">
                heroicons-solid:bell
              </FuseSvgIcon>
              <Link
                to={"/tasks"}
                className="mx-6 leading-6 truncate text-blue"
                color="text.secondary"
              >
                {data?.tasksDue ? (
                  `You have ${data?.tasksDue} pending tasks`
                ) : (
                  <span className="text-black">You have no pending tasks</span>
                )}
              </Link>
            </div>
          </div>
        </div>
        <div className="dashboard_buttons flex flex-wrap items-center mt-10 sm:mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="warning"
            startIcon={
              <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
            }
            onClick={(e) => handelNav(e, "session")}
          >
            Sessions
          </Button>
          <Button
            className="whitespace-nowrap ml-10"
            variant="contained"
            color="primary"
            startIcon={
              <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
            }
            onClick={(e) => handelNav(e, "notification")}
          >
            Notifications
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={
              <FuseSvgIcon size={20}>heroicons-solid:check-circle</FuseSvgIcon>
            }
            onClick={(e) => handelNav(e, "tasks")}
          >
            Tasks
          </Button>
        </div>
      </div>
      {/* <div className="flex items-center">
				<Button
					onClick={handleOpenProjectMenu}
					className="flex items-center border border-solid border-b-0 rounded-t-xl rounded-b-0 h-40 px-16 text-13 sm:text-16"
					sx={{
						backgroundColor: (theme) => theme.palette.background.default,
						borderColor: (theme) => theme.palette.divider
					}}
					endIcon={
						<FuseSvgIcon
							size={20}
							color="action"
						>
							heroicons-solid:chevron-down
						</FuseSvgIcon>
					}
				>
					{_.find(projects, ['id', selectedProject.id])?.name}
				</Button>
				<Menu
					id="project-menu"
					anchorEl={selectedProject.menuEl}
					open={Boolean(selectedProject.menuEl)}
					onClose={handleCloseProjectMenu}
				>
					{projects &&
						projects.map((project) => (
							<MenuItem
								key={project.id}
								onClick={() => {
									handleChangeProject(project.id);
								}}
							>
								{project.name}
							</MenuItem>
						))}
				</Menu>
			</div> */}
    </div>
  );
}

export default ProjectDashboardAppHeader;
