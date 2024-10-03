import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { lighten } from "@mui/material/styles";
import CourseInfo from "./CourseInfo";
import CourseProgress from "./CircularProgressbar";
import AuditListModal from "../common_modal/audit_modals/AuditList";
import { useState } from "react";
import { apiAuth } from "src/utils/http";
import { format, parseISO } from "date-fns";

/**
 * The CourseCard component.
 *
 */

function createData(
  index,

  Task,
  Audit,
  date,
  staff
) {
  return { index, Task, Audit, date, staff };
}

function CourseCard(props) {
  const { course } = props;
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

  const [openAudit, setOpenAudit] = useState(false);
  const [currentAudit, setCurrentAudit] = useState([]);

  const handelOpenAudit = async (token, value) => {
    apiAuth.get(`/ChangeImplementation/AuditList/${token}`).then((response) => {
      setOpenAudit(true);
      const transformedData = response?.data?.data.map((item, index) =>
        createData(
          index + 1,
          item.task,
          item.comments,
          formatDate(item.donebydate),
          item.auditDoneBy
        )
      );
      setCurrentAudit(transformedData);
    });
  };

  return (
    <Card className="flex flex-col shadow" style={{ height: "100%" }}>
      <AuditListModal
        open={openAudit}
        handleClose={() => setOpenAudit(false)}
        auditData={currentAudit}
        onAddAudit={openAudit}
      />
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
        <div>
          {course.completionPercent >= 60 && (
            <Button
              className="whitespace-nowrap  mb-5 m-5"
              style={{
                backgroundColor: "white",
                border: "2px solid #d4d4d4",
                color: "black",
              }}
              variant="contained"
              color="warning"
              onClick={(e) => {
                handelOpenAudit(course.token);
              }}
              endIcon={
                <FuseSvgIcon size={20}>
                  heroicons-solid:document-add
                </FuseSvgIcon>
              }
            >
              Audit List
            </Button>
          )}
          <Button
            to={
              course.requestTypeName === "Asset"
                ? `/moc/assetEvaluation/${course.token}`
                : course.requestTypeName === "Document"
                  ? `/moc/evaluation/${course.token}`
                  : course.requestTypeName === "Engg"
                    ? `/moc/assetEvaluation/${course.token}`
                    : course.requestTypeName === "TransportAct"
                      ? `/moc/assetEvaluation/${course.token}`
                      : course.requestTypeName === "Others"
                        ? `/moc/assetEvaluation/${course.token}`
                        : `/moc/orgEvaluation/${course.token}`
            }
            component={Link}
            className="px-12 min-w-120"
            // color="light"
            variant="contained"
            style={{ backgroundColor: "white", border: "2px solid #d4d4d4" }}
            endIcon={
              <FuseSvgIcon size={20}>
                heroicons-solid:arrow-sm-right
              </FuseSvgIcon>
            }
          >
            View
          </Button>
        </div>
      </CardActions>
    </Card>
  );
}

export default CourseCard;
