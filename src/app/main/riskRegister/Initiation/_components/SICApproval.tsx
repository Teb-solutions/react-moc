import React, { useEffect, useState } from "react";
import InputField from "./InputField";
import Button from "../../common/Button";
import { IHiraList } from "../../helpers/type";
import { useForm } from "react-hook-form";
import {
  RiskActionType,
  RiskCategoryToTeamRoleMapping,
  RiskRegisterTeamRole,
  RiskRegisterTeamRoleDisplayNames,
} from "../../helpers/enum";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Autocomplete,
  TextField,
} from "@mui/material";
import { set } from "lodash";
import { use } from "i18next";
import { apiAuth } from "src/utils/http";
import ConfirmationModal from "src/app/main/moc/common_modal/confirmation_modal/ConfirmationModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

interface Roles {
  teamType: RiskRegisterTeamRole;
  staffId: string;
}

interface approverForm {
  comment: string;
}
const SICApproval = ({ risk }: { risk: IHiraList }) => {
  const teamRoles = RiskCategoryToTeamRoleMapping[risk.category];
  const [rolesEmployee, setRolesEmployee] = useState<Roles[]>([]);
  const [teamError, setTeamError] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [staff, setStaff] = useState<any[]>([]);
  const [payload, setPayload] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    watch,
  } = useForm<approverForm>();
  useEffect(() => {
    teamRoles.forEach((role) => {
      setRolesEmployee((prev) => {
        if (!prev.some((r) => r.teamType === role)) {
          return [...prev, { teamType: role, staffId: "" }];
        }
        return prev;
      });
    });
  }, [teamRoles]);
  useEffect(() => {
    apiAuth
      .get(`/Staff/LOV`)
      .then((res) => {
        setStaff(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const commentEntered = watch("comment");
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
    console.log(errorMessages);
    if (errorMessages.length > 0) {
      setTeamError("Please select employee for " + errorMessages.join(", "));
    } else {
      setTeamError("");
    }

    return isValid;
  };

  const onSubmit = (data) => {
    setIsSubmit(true);
    if (validateTeamRoles(rolesEmployee)) {
      setPayload({
        riskRegisterId: risk.id,
        comments: data.comment,
        actionType: RiskActionType.Approve,
        teamList: rolesEmployee,
      });
      console.log(payload);
      setOpen(true);
    }
  };
  const handleReject = async () => {
    setIsSubmit(true);
    const isFormValid = await trigger();
    if (isFormValid) {
      setPayload({
        riskRegisterId: risk.id,
        comments: commentEntered,
        actionType: RiskActionType.Reject,
        // teamList: rolesEmployee,
      });
      setOpen(true);
    }
  };
  const handleSICApprove = () => {
    apiAuth
      .post("/RiskRegister/SicApproval/" + risk.id, payload)
      .then((res) => {
        if (res.data.statusCode == 200) {
          toast.success("Risk Approved Successfully");
          navigate("/risk");
        } else toast.error(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error Approving Risk");
      })
      .finally(() => {
        setOpen(false);
      });
  };

  return (
    <section className="flex overflow-hidden flex-wrap gap-8 items-start px-6 py-12 text-sm bg-white rounded-lg max-md:px-5">
      <h1 className="grow shrink text-2xl font-semibold text-black min-w-[240px] w-[970px] max-md:max-w-full">
        SIC Approval
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full my-20">
        <div className="grid grid-cols-3 w-full gap-10">
          {/*  */}
          {staff.length > 0 &&
            teamRoles.map((role, index) => (
              <FormControl fullWidth key={index}>
                <Autocomplete
                  key={"inputselect" + index}
                  disablePortal
                  options={staff}
                  getOptionLabel={(option) => option.text}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  onChange={(event, value) =>
                    handleTeamRoleChange(event, value, role)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={RiskRegisterTeamRoleDisplayNames[role] + "*"}
                    />
                  )}
                />
              </FormControl>
            ))}
        </div>
        <div className="mt-10">
          {isSubmit && teamError && (
            <p role="alert" className="text-sm pb-10 text-red-500">
              {teamError}
            </p>
          )}
          <FormControl fullWidth className="col-span-3 mt-10">
            <InputLabel htmlFor="comment">Comment *</InputLabel>
            <OutlinedInput
              id="comment"
              name="comment"
              {...register("comment", { required: true })}
              //   value={documentState.projectName}
              //   onChange={handleChange}
              label="Comment *"
            />
            {errors.comment?.type === "required" && (
              <p role="alert" className="text-sm text-red-500">
                Comment is required
              </p>
            )}
          </FormControl>
        </div>
        <div className="flex flex-row justify-end  mt-20 gap-20">
          <Button type="button" onClick={() => handleReject()} variant="reject">
            Reject
          </Button>
          <Button type="submit" variant="approve">
            Approve
          </Button>
        </div>
        <ConfirmationModal
          openSubmit={open}
          handleCloseSubmit={() => {}}
          title="Submit request"
        >
          <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
            <Button
              variant="neutral"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="approve" type="submit" onClick={handleSICApprove}>
              Submit
            </Button>
          </div>
        </ConfirmationModal>
      </form>
    </section>
  );
};

export default SICApproval;
