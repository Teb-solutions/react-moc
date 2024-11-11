import { TextField } from "@mui/material";
import Button from "../../common/Button";
import CommonModal from "../../common/CommonModal";
import { TaskPopupType } from "../../helpers/enum";

const titleArray = ["Send for Approval", "Delete Task", "Add/View Audit"];
const commentArray = [
  "Are you sure you want to approve this task?",
  "Are you sure you want to delete this task?",
  "Are you sure you want to add audit?",
];

const AddComment = ({
  popupType,
  openComment,
  handleComment,
}: {
  popupType: number;
  openComment: boolean;
  handleComment: () => void;
}) => {
  return (
    <CommonModal
      open={openComment}
      handleClose={handleComment}
      title={titleArray[popupType - 1]}
    >
      <div className="flex flex-col">
        <div className="flex flex-col my-20">
          <p>{commentArray[popupType - 1]}</p>
          <div className="flex flex-col my-20">
            <TextField
              className="mt-10"
              id="outlined-basic"
              label="Comment*"
              variant="outlined"
            />
          </div>
          {popupType === TaskPopupType.Audit && <ViewAudits />}
        </div>
        <div className="flex my-20 flex-row gap-10 w-full text-right justify-end">
          <Button
            onClick={() => {
              // sendForRevision();
            }}
            type="button"
            variant="neutral"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // sendForRevision();
            }}
            type="button"
            variant="approve"
          >
            Submit
          </Button>
        </div>
      </div>
    </CommonModal>
  );
};
export default AddComment;

interface Audit {
  auditComment: string;
  auditedByName: string;
  auditDateTime: string; // You can use Date type if you prefer
}

const audits: Audit[] = [
  {
    auditComment: "Initial review completed.",
    auditedByName: "John Doe",
    auditDateTime: "2023-10-01T10:00:00Z",
  },
  {
    auditComment: "Follow-up review completed.",
    auditedByName: "Jane Smith",
    auditDateTime: "2023-10-02T14:30:00Z",
  },
  {
    auditComment: "Final review completed.",
    auditedByName: "Alice Johnson",
    auditDateTime: "2023-10-03T09:15:00Z",
  },
];

const ViewAudits = () => {
  return (
    <div>
      <h2>Audit History</h2>
      <ul className="mt-5">
        {audits.map((audit, index) => (
          <li key={index}>
            <p>
              <strong>Comment:</strong> {audit.auditComment}
            </p>
            <p className="ml-10">
              <span className="font-medium"> By:</span> {audit.auditedByName},
              on {new Date(audit.auditDateTime).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
