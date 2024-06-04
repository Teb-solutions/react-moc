import LinearProgress from "@mui/material/LinearProgress";
import clsx from "clsx";

/**
 * The CourseProgress component.
 */
function CourseProgress(props) {
  const { course, className } = props;
  return (
    <LinearProgress
      className={clsx("w-full h-2", className)}
      variant="determinate"
      value={course.completionPercent * 100}
      color="secondary"
    />
  );
}

export default CourseProgress;
