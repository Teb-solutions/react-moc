import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import clsx from "clsx";

import { format, parseISO } from "date-fns";

import CircularProgress from "./CircularProgressbar";

/**
 * The CourseInfo component.
 */
function CourseInfo(props) {
  const { course, className } = props;

  if (!course) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Invalid date";
    }

    try {
      const date = parseISO(dateString);
      return format(date, "MMMM dd, yyyy");
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className={clsx("w-full", className)}>
      <div className="flex items-center justify-between mb-16">
        <div _ngcontent-xmv-c241="" class="flex items-center justify-between">
          <div
            _ngcontent-xmv-c241=""
            class="py-4 px-5 rounded-full text-sm font-semibold text-blue-800 bg-blue-100 dark:text-blue-50 dark:bg-blue-500"
          >
            {" "}
            {course.requestTypeName}
          </div>
        </div>

        {/* <CourseCategory slug={course.requestTypeName} /> */}

        {/* {2 > 0 && (
          <FuseSvgIcon className="text-green-600" size={20}>
            heroicons-solid:badge-check
          </FuseSvgIcon>
        )} */}
      </div>

      <Typography className="text-16 font-medium">
        {course.requestNo}
      </Typography>

      <Typography className="text-13 mt-2 line-clamp-2" color="text.secondary">
        Initiated by <b>{course.initiatorName}</b> on{" "}
        <b> {formatDate(course?.requestDate)}</b>
      </Typography>

      <div className="flex justify-between align-items-center  mt-10 ">
        <div>
          <Typography className="text-13line-clamp-2" color="text.secondary">
            {course.requestTypeName === "Document"
              ? "Document Name :"
              : "Project Name :"}
          </Typography>
          <span>{course?.projectName}</span>
          <Typography
            className="text-13 mt-10 line-clamp-2"
            color="text.secondary"
          >
            <span className="whitespace-nowrap leading-none">
              {course.requestTypeName === "Document"
                ? " Document Author :"
                : "Change Leader :"}
            </span>
          </Typography>
          <span>
            {course?.changeLeaderName === null
              ? "Not assigned"
              : course?.changeLeaderName}
          </span>
        </div>
        {course.statusName != "Cancelled" ? (
          <div>
            <CircularProgress course={course?.completionPercent} />
          </div>
        ) : (
          <img src="/assets/images/etc/close_icon.jpg" />
        )}
      </div>
    </div>
  );
}

export default CourseInfo;
