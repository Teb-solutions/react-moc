import LinearProgress from "@mui/material/LinearProgress";
import clsx from "clsx";

/**
 * The CourseProgress component.
 */
function CourseProgress(props) {
  const { course, className } = props;
  return (
    <LinearProgress
      className={clsx("w-full h-4", className)}
      variant="determinate"
      value={course}
      color="secondary"
    />
  );
}

export default CourseProgress;
