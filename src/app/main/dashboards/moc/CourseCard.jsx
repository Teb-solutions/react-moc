import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { lighten } from "@mui/material/styles";
import CourseInfo from "./CourseInfo";
import CourseProgress from "./CourseProgress";

/**
 * The CourseCard component.
 */
function CourseCard(props) {
  const { course } = props;

  console.log(course, ";;12");

  return (
    <Card className="flex flex-col shadow">
      <CardContent className="flex flex-col flex-auto p-24">
        <CourseInfo course={course} />
      </CardContent>
      {/* <CourseProgress course={course?.completionPercent} /> */}
      <CardActions
        className="items-center justify-between py-16 px-24"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.03),
        }}
      >
        <div>
          <h4>
            <b
              style={{
                color: course.statusName == "Cancelled" ? "orangered" : "black",
              }}
            >
              {course?.statusName}
            </b>
          </h4>
        </div>
        <Button
          to={
            course.requestTypeName === "Asset"
              ? `/moc/assetEvaluation/${course.token}`
              : course.requestTypeName === "Document"
                ? `/moc/evaluation/${course.token}`
                : `/moc/orgEvaluation/${course.token}`
          }
          component={Link}
          className="px-12 min-w-120"
          // color="light"
          variant="contained"
          style={{ backgroundColor: "white", border: "1px solid grey" }}
          endIcon={
            <FuseSvgIcon size={20}>heroicons-solid:arrow-sm-right</FuseSvgIcon>
          }
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
}

export default CourseCard;
