import FusePageCarded from "@fuse/core/FusePageCarded";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Select, MenuItem, Paper, Icon, Autocomplete } from "@mui/material";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "../common/Button";
import RiskHeader from "../common/RiskHeader";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  RiskCategory,
  RiskCategoryToTeamRoleMapping,
  RiskRegisterTeamRoleDisplayNames,
} from "../helpers/enum";
import daysjs from "dayjs";
import { apiAuth } from "src/utils/http";
import { set } from "lodash";
import CommonModal from "../common/CommonModal";
import { useGetPermenant } from "src/utils/swr";
import FuseLoading from "@fuse/core/FuseLoading";
import { use } from "i18next";
import { Roles } from "../helpers/type";
import { fi, is } from "date-fns/locale";

interface IFormInput {
  isActive: boolean;
  projectName: string;
  projectDescription: string;
  siteId: number;
  divisionId: number;
  siteInChargeId: number;
  date: string;
  hiranumber: string;
  category: number;
}
function InitiateRisk() {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staff, setStaff] = useState<any[]>([]);
  const [teamRoles, setTeamRoles] = useState<any[]>(
    RiskCategoryToTeamRoleMapping[1]
  );

  const [rolesEmployee, setRolesEmployee] = useState<Roles[]>([]);
  const [teamError, setTeamError] = useState<string>("");
  const riskCategories = Object.keys(RiskCategory).filter((key) =>
    isNaN(Number(key))
  );
  const {
    data: defaultValue,
    isLoading,
    error,
  } = useGetPermenant<{
    data: any;
    message: string;
    statusCode: number;
  }>(`/RiskRegister/DefaultForInitiate`);
  console.log(defaultValue);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      category: RiskCategory.Transport,
      date: daysjs().toISOString(),
    },
  });

  useEffect(() => {
    // console.log(teamRoles, "teamRoles");
    // console.log(rolesEmployee, "rolesEmployee");
    setRolesEmployee([])
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
    // let errorMessages: string[] = [];
    let isValid = true;
    //to check if there are minimum 3 members in team
    // console.log(newRoleEmpArray, "newRoleEmpArray");
    // console.log(newRoleEmpArray.filter((r) => r.staffId).length, "length");
    if (newRoleEmpArray.filter((r) => r.staffId).length < 3) {
      isValid = false;
      setTeamError("Minimum 3 team members are required to proceed");
    }else{
      isValid = true;
      setTeamError("")
    }
    return isValid;
  };

  const category = watch("category");

  useEffect(() => {
    setTeamRoles(RiskCategoryToTeamRoleMapping[category]);
    setTeamError("")
  }, [category]);
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    //hardcoded values for site and all, this we have to get from api
    if (validateTeamRoles(rolesEmployee)) {
      setPayload({ ...data });
      setOpen(true);
    }
  };

  const handleRiskSubmit = () => {
    setIsSubmitting(true);
    // console.log(rolesEmployee)
    //how to filter our the employees who are not selected
    const filteredRolesEmployee = rolesEmployee.filter((role) => role.staffId);
    if (validateTeamRoles(rolesEmployee)) {
      payload.teamList = filteredRolesEmployee;
      payload.siteId = defaultValue.data.siteId;
      payload.divisionId = defaultValue.data.divisionId;
      payload.date = defaultValue.data.date;
      payload.hiranumber = defaultValue.data.hiranumber;
      payload.siteInChargeId = defaultValue.data.siteInchargeId;
      // console.log(payload);
      apiAuth
        .post("/RiskRegister/Initiate", payload)
        .then((response) => {
          if (response.data.statusCode == 200) {
            setIsSubmitting(false);
            toast.success(
              <p className="text-gray-800">Risk initiated successfully</p>
            );
            setOpen(false);
            navigate("/risk");
          } else {
            setIsSubmitting(false);
            setOpen(false);
            toast.error(
              <p className="text-gray-800">{response.data.message}</p>
            );
          }
        })
        .catch((error) => {
          toast.error(
            <p className="text-gray-800">Failed to inititate risk</p>
          );
          setOpen(false);
          setIsSubmitting(false);
          console.log(error);
          // toast.error("Failed to initiate risk");
        });
    } else {
      setIsSubmitting(false);
    }
  };
  return (
    <FusePageCarded
      header={
        (
          <RiskHeader
            risk={"risk"}
            setLeftSidebarOpen={() => {}}
            leftSidebarOpen={false}
          />
        ) as any
      }
      content={
        <>
          <ToastContainer
            className="toast-container"
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="null"
          />
          {isLoading && <FuseLoading />}
          {!isLoading && defaultValue && (
            <Paper className="flex flex-col p-10 m-20">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col bg-white flex-1 w-full mx-auto px-24 pt-24 sm:p-30">
                  <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                    <div
                      _ngcontent-fyk-c288=""
                      className="flex items-center w-full justify-between"
                    >
                      <h2
                        _ngcontent-fyk-c288=""
                        className="text-2xl font-semibold"
                      >
                        Initiate new risk register
                      </h2>
                    </div>
                  </div>

                  <div className="grid mt-20 mb-10  grid-cols-1 sm:grid-cols-3 gap-20">
                    <Box>
                      <TextField
                        fullWidth
                        label="Request No"
                        id="Request No"
                        value={defaultValue.data.hiranumber}
                        disabled
                      />
                    </Box>

                    <Box>
                      <TextField
                        fullWidth
                        label="Division"
                        id="division"
                        value={defaultValue.data.divisionName}
                        // {...register("divisionId", { required: true })}
                        disabled
                      />
                      {errors.divisionId?.type === "required" && (
                        <p role="alert" className="text-sm text-red-500">
                          Division is required
                        </p>
                      )}
                    </Box>
                    <Box>
                      <TextField
                        fullWidth
                        label="Site"
                        id="site"
                        value={defaultValue.data.siteName}
                        // {...register("siteId", { required: true })}
                        disabled
                      />
                      {errors.siteId?.type === "required" && (
                        <p role="alert" className="text-sm text-red-500">
                          Site is required
                        </p>
                      )}
                    </Box>
                    {/* <Box>
                    <TextField
                      fullWidth
                      label="Area"
                      id="area"
                      placeholder="Enter Area"
                      value={""}
                    />
                  </Box> */}

                    <Box>
                      <TextField
                        fullWidth
                        label="Site in charge"
                        id="Site in charge"
                        value={defaultValue.data.siteInChargeName}
                        // {...register("siteInChargeId", { required: true })}
                        disabled
                      />
                      {errors.siteInChargeId?.type === "required" && (
                        <p role="alert" className="text-sm text-red-500">
                          SIC is required
                        </p>
                      )}
                    </Box>
                    <Box>
                      <TextField
                        fullWidth
                        label="Created On"
                        id="category"
                        // type="date"
                        // defaultValue={daysjs().format("DD-MM-YYYY")}
                        value={daysjs().format("DD-MM-YYYY")}
                        // {...register("date", { required: true })}
                        disabled
                      />
                      {errors.date?.type === "required" && (
                        <p role="alert" className="text-sm text-red-500">
                          Date is required
                        </p>
                      )}
                    </Box>
                    <div className="flex flex-row  w-full">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Category
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          {...register("category", { required: true })}
                          value={category || RiskCategory.Transport}
                          label="Category"
                        >
                          {riskCategories.map((category, index) => (
                            <MenuItem
                              key={index}
                              value={
                                RiskCategory[
                                  category as keyof typeof RiskCategory
                                ]
                              }
                            >
                              {category.replace("_", " ")}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.category?.type === "required" && (
                          <p role="alert" className="text-sm text-red-500">
                            Category is required
                          </p>
                        )}
                      </FormControl>
                    </div>
                  </div>

                  <div
                    className="flex flex-col gap-20"
                    style={{ marginTop: "20px" }}
                  >
                    <FormControl fullWidth>
                      <InputLabel htmlFor="title">Title *</InputLabel>
                      <OutlinedInput
                        id="title"
                        name="title"
                        {...register("projectName", { required: true })}
                        //   value={documentState.projectName}
                        //   onChange={handleChange}
                        label="Document Name *"
                      />
                      {errors.projectName?.type === "required" && (
                        <p role="alert" className="text-sm text-red-500">
                          Title is required
                        </p>
                      )}
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel htmlFor="description">
                        Description *
                      </InputLabel>
                      <OutlinedInput
                        id="description"
                        name="description"
                        {...register("projectDescription", { required: true })}
                        //   value={documentState.projectDescription}
                        //   onChange={handleChange}
                        label="Document Description *"
                      />
                      {errors.projectDescription?.type === "required" && (
                        <p role="alert" className="text-sm text-red-500">
                          Description is required
                        </p>
                      )}
                    </FormControl>
                  </div>
                  <div className="flex flex-col gap-20 mt-24">
                    <h3 className="font-bold">Select Team</h3>
                  </div>
                  <div className="grid mt-14 grid-cols-3 w-full gap-10">
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
                                label={
                                  RiskRegisterTeamRoleDisplayNames[role] + "*"
                                }
                              />
                            )}
                          />
                        </FormControl>
                      ))}
                    
                  </div>
                      <div className="mt-4">
                      {teamError && (
                      <p role="alert" className="text-sm pb-10 text-red-500">
                        {teamError}
                      </p>
                    )}
                      </div>
                  <div className="flex flex-col sm:flex-row justify-between my-20  py-30">
                    <div className="flex items-center">
                      <Button
                        variant="neutral"
                        type="button"
                        // onClick={handleOpenDocModal}
                      >
                        <Icon>upload</Icon>
                        Document
                      </Button>
                    </div>
                    <div className="flex flex-row sm:justify-between items-center gap-10">
                      <Button variant="reject" type="button">
                        Cancel
                      </Button>
                      <Button variant="approve" type="submit">
                        Initiate Risk Register
                      </Button>

                      <CommonModal
                        open={open}
                        handleClose={() => setOpen(false)}
                        title="Submit request"
                      >
                        <div className="flex flex-col">
                          <div className="flex flex-col my-20">
                            <p>
                              Once submitted you will not be able to revert !
                              Are you sure you want to continue ?
                            </p>
                          </div>
                          <div className="flex my-20 flex-row gap-10 w-full text-right justify-end">
                            <Button
                              variant="neutral"
                              type="button"
                              onClick={() => setOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="approve"
                              type="submit"
                              onClick={handleRiskSubmit}
                            >
                              Submit
                            </Button>
                          </div>
                        </div>
                      </CommonModal>
                    </div>
                  </div>
                </div>
              </form>
            </Paper>
          )}
        </>
      }
    />
  );
}

export default InitiateRisk;
