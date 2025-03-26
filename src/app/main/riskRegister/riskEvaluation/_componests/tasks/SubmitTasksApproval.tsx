import CommonModal from "../../../common/CommonModal";
import Button from "../../../common/Button";
import { useTaskStore } from "../common/taskStore";
import { toast } from "react-toastify";
import { apiAuth } from "src/utils/http";
import { mutate } from "swr";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import { Autocomplete, TextField } from "@mui/material";
import { useRiskStore } from "../common/riskstore";
import { approverMatrix, RiskRegisterTeamRoleDisplayNames } from "../../../helpers/enum";
import { set } from "lodash";

export const SubmitTasksApproval = ({
  isSubmitOpen,
  riskId,
  selectedRiskCategory,
  
  setIsSubmitOpen,
}: {
  isSubmitOpen: boolean;
  riskId: string;

selectedRiskCategory: number;
  setIsSubmitOpen: (value: boolean) => void;
}) => {
  const [staff, setStaff] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { risk} =
      useRiskStore();
  const {
    tasks,
    setTasks,
    setSelectedTask,
    selectedTask,
    selectedTasksIds,
    setSelectedTasksIds,
  } = useTaskStore();
  const approverRole = approverMatrix[risk.category]?.[selectedRiskCategory];
  const approverName = approverRole
    ? RiskRegisterTeamRoleDisplayNames[approverRole]
    : "";
  const handleTaskSubmitForApproval = () => {
    if (selectedTasksIds.length === 0) {
      setError("Please select at least one task");
      return;
    }
    if(!selectedStaff){
        setError("Please select an approver");
        return;
    }
    setError("");
    setIsSubmitting(true);
    const payload = {
        approverId: selectedStaff.value,
        approverRole: approverRole,
        taskIds: selectedTasksIds,  
        classification: selectedRiskCategory,
    };
    apiAuth
      .post(`/RiskRegister/task/submit/approval/${riskId}`, payload)
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
        toast.error("Failed to submit task for approval");
      })
      .finally(() => {
        setIsSubmitOpen(false);
        setSelectedTasksIds([]);
        setIsSubmitting(false);
      });
  };
  
  useEffect(() => {
    apiAuth
      .get(`/Staff/LOV`)
      .then((res) => {
        if (res.data.statusCode === 200) {
          setStaff(res.data.data);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  
  
  return (
    <CommonModal
      open={isSubmitOpen}
      handleClose={() => {
        setIsSubmitOpen(false);
      }}
      title="Submit for Approval"
    >
      <div className="flex flex-col">
        <div className="flex flex-col my-20">
          <p>
            Please select the approver to send the selected{" "}
            {selectedTasksIds.length} tasks for approval.
          </p>

          <FormControl  className="my-20 sm:w-full md:w-1/2">
            <Autocomplete
              key={"inputselect"}
              disablePortal
              options={staff}
              getOptionLabel={(option) => option.text}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              onChange={(event, value) => {
                setSelectedStaff(value);
                setError("");
              }}
              renderInput={(params) => (
                <TextField {...params} label={approverName || "Approver" + "*"} />
              )}
            />
          </FormControl>
          <p className="text-red-500">{error}</p>
        </div>
        <div className="flex my-20 flex-row gap-10 w-full text-right justify-end">
          <Button
            onClick={() => {
              setIsSubmitOpen(false);
            }}
            type="button"
            variant="neutral"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleTaskSubmitForApproval();
            }}
            type="button"
            variant="approve"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </div>
    </CommonModal>
  );
};
