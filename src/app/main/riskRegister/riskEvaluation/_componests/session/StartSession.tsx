import { useState } from "react";
import CommonModal from "../../../common/CommonModal";
import { TeamList } from "../../../helpers/type";
import { FormControl } from "@mui/base";
import {
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Button from "../../../common/Button";
import { apiAuth } from "src/utils/http";
import { mutate } from "swr";
import { toast } from "react-toastify";

const StartSession = ({
  open,
  handleClose,
  riskId,
  teamList,
}: {
  open: boolean;
  handleClose: () => void;
  riskId: number;
  teamList: TeamList[];
}) => {
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedStaff((prevSelectedStaff) =>
      checked
        ? [...prevSelectedStaff, Number(value)]
        : prevSelectedStaff.filter((id) => id !== Number(value))
    );
  };

  const startSessionHandler = () => {
    const selectedTeamMembers = teamList.filter((team) =>
      selectedStaff.includes(team.staffId)
    );
    console.log(selectedTeamMembers);
    console.log(selectedTeamMembers.length);
    if (selectedTeamMembers.length < 2) {
      console.log("selectedTeamMembers.length", selectedTeamMembers.length);
      // toast.error("minimum 2 team members required to start session");
      setError("Note: Minimum 2 team members required to start session");
      return;
    }
    setError(null);
    apiAuth
      .post(`/RiskRegister/session/create/${riskId}`, {
        teamList: selectedTeamMembers,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.statusCode == 200) {
          handleClose();
          mutate(`/RiskRegister/session/list/${riskId}`);
        } else {
          console.log(res.data.message, { autoClose: 2000 });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <CommonModal title="Start Session" open={open} handleClose={handleClose}>
      <div>
        <div>
          <FormControl>
            <FormLabel
              component="legend"
              className="font-medium text-slate-500 text-lg"
            >
              Select Team
            </FormLabel>
            <p className="text-gray-700 my-5">
              Note:- Notification will be send to the selected team members and
              session will start once they accept it. Once the session is
              started you will be able to add/edit tasks.
            </p>
            <FormGroup>
              {teamList.map((team) => (
                <FormControlLabel
                  key={team.staffId}
                  control={
                    <Checkbox
                      id={team.staffId.toString()}
                      value={team.staffId}
                      checked={selectedStaff.includes(team.staffId)}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={team.staffName}
                />
              ))}
            </FormGroup>
          </FormControl>
          {error && (
            <p className="text-red-500 text-sm font-medium mt-2">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-10">
          <Button variant="neutral" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="approve"
            type="button"
            onClick={() => {
              startSessionHandler();
            }}
          >
            Start Session
          </Button>
        </div>
      </div>
    </CommonModal>
  );
};

export default StartSession;
