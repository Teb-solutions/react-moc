import FusePageCarded from "@fuse/core/FusePageCarded";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Select, MenuItem, Paper, Icon } from "@mui/material";
import { useNavigate } from "react-router";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "../common/Button";
import RiskHeader from "../common/RiskHeader";
import { useForm, SubmitHandler } from "react-hook-form";
import { RiskCategory } from "../helpers/enum";
import daysjs from "dayjs";
import { apiAuth } from "src/utils/http";
import { set } from "lodash";
import CommonModal from "../common/CommonModal";

interface IFormInput {
  isActive: boolean;
  projectName: string;
  projectDescription: string;
  siteId: number;
  divisionId: number;
  siteInchargeId: number;
  date: string;
  category: number;
}
function InitiateRisk() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      category: RiskCategory.Transport,
      siteId: 28,
      divisionId: 35,
      siteInchargeId: 22,
      date: daysjs().format("DD-MM-YYYY"),
    },
  });
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const riskCategories = Object.keys(RiskCategory).filter((key) =>
    isNaN(Number(key))
  );
  const category = watch("category");
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    //hardcoded values for site and all, this we have to get from api
    setPayload({ ...data, siteId: 28, divisionId: 35, siteInchargeId: 22 });
    setOpen(true);
  };
  const handleRiskSubmit = () => {
    setIsSubmitting(true);
    apiAuth
      .post("/RiskRegister/Initiate", payload)
      .then(() => {
        setIsSubmitting(false);
        toast.success("Risk initiated successfully");
        setOpen(false);
        navigate("/risk");
      })
      .catch(() => {
        setIsSubmitting(false);
        toast.error("Failed to initiate risk");
      });
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
                  {/* <Box>
                    <TextField
                      fullWidth
                      label="Request No"
                      id="Request No"

                      value={"MUMRR42903"}
                      disabled
                    />
                  </Box> */}

                  <Box>
                    <TextField
                      fullWidth
                      label="Division"
                      id="division"
                      value={"Corporate HSEQ"}
                      {...register("divisionId", { required: true })}
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
                      value={"Mumbai"}
                      {...register("siteId", { required: true })}
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
                      id="siteInCharge"
                      value={"Girish KOTBAGI"}
                      {...register("siteInchargeId", { required: true })}
                      disabled
                    />
                    {errors.siteInchargeId?.type === "required" && (
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
                      value={daysjs().format("DD-MM-YYYY")}
                      {...register("date", { required: true })}
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
                    <InputLabel htmlFor="description">Description *</InputLabel>
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
                      Submit for Approval
                    </Button>

                    <CommonModal
                      open={open}
                      handleClose={() => setOpen(false)}
                      title="Submit request"
                    >
                      <div className="flex flex-col">
                        <div className="flex flex-col my-20">
                          <p>
                            Once submitted you will not be able to revert ! Are
                            you sure you want to continue ?
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
        </>
      }
    />
  );
}

export default InitiateRisk;
