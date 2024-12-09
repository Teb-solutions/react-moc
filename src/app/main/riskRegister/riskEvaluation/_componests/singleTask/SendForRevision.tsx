import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import Button from "../../../common/Button";
import CommonModal from "../../../common/CommonModal";
import { useState } from "react";
import { apiAuth } from "src/utils/http";
import { useTaskStore } from "../common/taskStore";
import { RiskActionType } from "../../../helpers/enum";
import { toast } from "react-toastify";
import { mutate } from "swr";

const SendForRevision = ({
  openRevision,
  setIsOpenRevision,
  riskId,
}: {
  openRevision: boolean;
  riskId: string;
  setIsOpenRevision: (value: boolean) => void;
}) => {
  const [comment, setComment] = useState<string | null>(null);
  const [commentValidation, setCommentValidation] = useState<string | null>(
    null
  );
  const [staffValidation, setStaffValidation] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const { selectedTask } = useTaskStore();

  const handleTaskRejection = () => {
    if (!comment) {
      !comment && setCommentValidation("Comment is required");
      return;
    }
    if (!selectedStaff) {
      !selectedStaff && setStaffValidation("Staff is required");
      return;
    }

    apiAuth
      .post(`/RiskRegister/task/approval/${selectedTask.taskId}/${riskId}`, {
        taskId: selectedTask.taskId,
        riskRegisterId: riskId,
        comments: comment,
        actionType: RiskActionType.SendBack,
        sendBackToApprId: selectedStaff,
      })
      .then((response) => {
        if (response.data.statusCode == 200) {
          toast.success(response.data.message);
          mutate(`/RiskRegister/task/list/${riskId}`);
          mutate(`/RiskRegister/task/detail/${selectedTask.taskId}`);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to approve task");
      })
      .finally(() => {
        setIsOpenRevision(false);
        setComment(null);
      });
  };
  return (
    <CommonModal
      open={openRevision}
      handleClose={() => setIsOpenRevision(false)}
      title="Send for Revision"
    >
      <div className="flex flex-col">
        <div className="flex flex-col my-20">
          <p>Are you sure you want to send this request for revision?</p>
          <p>
            The request will be sent back to the Team for further revision. Once
            the team submits the task for approval, the selected approver will
            be notified.
          </p>
          <div className="flex flex-col my-20">
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                <h3>Phase</h3>
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Approval"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Evaluation"
                />
              </RadioGroup>
            </FormControl>
            <FormControl className="w-[400px] my-10">
              <InputLabel id="demo-simple-select-label">
                Select Approver*
              </InputLabel>
              <Select
                // labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedStaff}
                label="Approver*"
                onChange={(e) => {
                  setSelectedStaff(e.target.value as string);
                  setStaffValidation(null);
                }}
              >
                {selectedTask.approvals?.map((item, index) => (
                  <MenuItem value={item.staffId}>{item.staffName}</MenuItem>
                ))}
              </Select>
              {staffValidation && (
                <p className="text-red-500  text-xs mt-5">{staffValidation}</p>
              )}
            </FormControl>
            <TextField
              className="mt-10"
              id="outlined-basic"
              label="Comment*"
              variant="outlined"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setCommentValidation(null);
              }}
            />
            {commentValidation && (
              <p className="text-red-500 text-xs  mt-5">{commentValidation}</p>
            )}
          </div>
        </div>
        <div className="flex my-20 flex-row gap-10 w-full text-right justify-end">
          <Button
            onClick={() => {
              setIsOpenRevision(false);
            }}
            type="button"
            variant="neutral"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleTaskRejection();
            }}
            type="button"
            variant="approve"
          >
            Send for Revision
          </Button>
        </div>
      </div>
    </CommonModal>
  );
};
export default SendForRevision;
