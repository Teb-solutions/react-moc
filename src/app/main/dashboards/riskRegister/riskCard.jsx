import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { lighten } from "@mui/material/styles";
import RiskInfo from "./riskInfo";

/**
 * The CourseCard component.
 */
function RiskCard(props) {
  const { course } = props;

  return (
    <Card className="flex flex-col  shadow">
      <CardContent className="flex flex-col flex-auto p-24">
        <RiskInfo course={course} />
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
          to={`/moc/riskEvaluation/${course.token}`}
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

export default RiskCard;
