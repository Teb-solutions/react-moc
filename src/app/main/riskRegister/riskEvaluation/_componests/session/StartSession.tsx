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
    apiAuth
      .post(`/RiskRegister/session/create/${riskId}`, {
        teamList: selectedTeamMembers,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.statusCode == 200) {
          handleClose();
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
            <p className="text-gray-500">
              Notification will be send to the selected team members and session
              will start once they accept it
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
