import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import clsx from "clsx";
import CourseCategory from "./CourseCategory";
import { format, parseISO } from "date-fns";

/**
 * The CourseInfo component.
 */
function CourseInfo(props) {
  const { course, className } = props;

  if (!course) {
    return null;
  }

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
        <b>{format(parseISO(course?.requestDate), "MMMM dd, yyyy")}</b>
      </Typography>
      <Divider className="w-48 my-24 border-1" light />

      <Typography className="text-13 mt-2 line-clamp-2" color="text.secondary">
        Document Name :
      </Typography>
      <span>{course?.projectName}</span>
      <Divider className="w-48 my-24 border-1" light />

      <Typography
        className="flex items-center space-x-6 text-13"
        color="text.secondary"
      >
        <span className="whitespace-nowrap leading-none">
          Document Author :
        </span>
      </Typography>
      <span>
        {course?.changeLeaderName === null
          ? "Not assigned"
          : course?.changeLeaderName}
      </span>
    </div>
  );
}

export default CourseInfo;
