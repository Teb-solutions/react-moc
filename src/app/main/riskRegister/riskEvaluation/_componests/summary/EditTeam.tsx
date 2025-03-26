import { FormControl } from "@mui/base";
import Button from "../../../common/Button";
import CommonModal from "../../../common/CommonModal";
import { Autocomplete, TextField } from "@mui/material";
import { useRiskStore } from "../common/riskstore";
import { RiskRegisterTeamRoleDisplayNames } from "../../../helpers/enum";
import { useEffect, useState } from "react";
import { apiAuth } from "src/utils/http";
import { toast } from "react-toastify";
import { Roles } from "../../../helpers/type";
import { mutate } from "swr";

const EditTeam = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const { risk } = useRiskStore();
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rolesEmployee, setRolesEmployee] = useState<Roles[]>([]);
  const [teamError, setTeamError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  useEffect(() => {
    apiAuth
      .get(`/Staff/LOV`)
      .then((res) => {
        if (res.data.statusCode === 200) {
          setStaff(res.data.data);
          const roles = risk.teamList.map((team) => ({
            teamType: team.teamType,
            staffId: team.staffId.toString(),
          }));
          setRolesEmployee(roles);
          setIsLoading(false);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleTeamRoleChange = (event, value: any, teamType) => {
    const staffId = (value.value as string) || "";

    const newRoleEmpArray = rolesEmployee.map((role) =>
      role.teamType === teamType ? { ...role, staffId } : role
    );
    setRolesEmployee((prev) =>
      prev.map((role) =>
        role.teamType === teamType ? { ...role, staffId } : role
      )
    );
    validateTeamRoles(newRoleEmpArray);
  };

  const validateTeamRoles = (newRoleEmpArray: Roles[]) => {
    let errorMessages: string[] = [];
    let isValid = true;

    newRoleEmpArray.forEach((role) => {
      if (!role.staffId) {
        errorMessages.push(RiskRegisterTeamRoleDisplayNames[role.teamType]);
        isValid = false;
      }
    });

    if (errorMessages.length > 0) {
      setTeamError("Please select employee for " + errorMessages.join(", "));
    } else {
      setTeamError("");
    }

    return isValid;
  };
  const handleEditTeam = () => {
    // console.log(rolesEmployee);

    if (validateTeamRoles(rolesEmployee)) {
      setIsSubmitting(true);
      apiAuth
        .put(`/RiskRegister/team/update/${risk.id}`, rolesEmployee)
        .then((response) => {
          if (response.data.statusCode == 200) {
            toast.success(response.data.message);
            mutate(`/RiskRegister/Details/${risk.id}`);
            setIsOpen(false);
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to edit team");
        }).finally(() => {
          setIsSubmitting(false);
        });
    }
  };
  return (
    <CommonModal
      open={isOpen}
      handleClose={() => setIsOpen(false)}
      title="Edit Team"
    >
      <div>
        <p>Edit the team members below</p>
        <div className="grid grid-cols-2 gap-20 mt-20">
          {!isLoading &&
            risk.teamList.map((team, index) => (
              <div key={index}>
                <FormControl key={index}>
                  <Autocomplete
                    key={"inputselect" + index}
                    disablePortal
                    options={staff}
                    defaultValue={{
                      value: team.staffId,
                      text: team.staffName,
                    }}
                    onChange={(event, value) =>
                      handleTeamRoleChange(event, value, team.teamType)
                    }
                    getOptionLabel={(option) => option.text}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        defaultValue={team.staffName}
                        label={
                          RiskRegisterTeamRoleDisplayNames[team.teamType] + "*"
                        }
                      />
                    )}
                  />
                </FormControl>
              </div>
            ))}
        </div>
        <div className="flex my-20 flex-row gap-10 w-full text-right justify-end">
          <Button
            variant="neutral"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleEditTeam()}
            variant="approve"
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </div>
    </CommonModal>
  );
};

export default EditTeam;
