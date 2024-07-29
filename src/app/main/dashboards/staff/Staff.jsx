import React, { useRef, useCallback } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";
import { Button, FormControlLabel, FormLabel, Switch } from "@mui/material";
import { Box } from "@mui/material";
import { apiAuth } from "src/utils/http";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { decryptFeature } from "../../sign-in/tabs/featureEncryption";
import FuseLoading from "@fuse/core/FuseLoading";

const Task = () => {
  const storedFeature = decryptFeature();
  const feature = storedFeature ? storedFeature : [];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "615px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };
  const styles = {
    container: {
      padding: "7rem",
    },
    gridContainer: {
      display: "grid",
      gap: "1.5rem",
      gridTemplateColumns: "1fr",
    },
    gridContainerSm: {
      display: "grid",
      gap: "1.5rem",
      gridTemplateColumns: "repeat(2, 1fr)",
      width: "100%",
    },
    textMd: {
      marginTop: "1rem",
      fontSize: "1rem",
      fontWeight: "600",
    },
    textSecondary: {
      marginTop: "0.5rem",
      lineHeight: "1.5",
      color: "grey",
    },
    borderT: {
      marginTop: "1rem",
      borderTop: "1px solid grey",
    },
  };

  const [taskList, setTaskList] = useState([]);
  const [site, setSiteData] = useState([]);
  const [division, setDivision] = useState([]);
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [functions, setFunction] = useState([]);
  const [role, setRole] = useState([]);
  const [staffData, SetStaffData] = useState([]);
  const [task, setTask] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false); // State variable to control sidebar open/close
  const [comments, setComments] = useState("");
  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [handelUpdate, setHandelUpdate] = useState(false);
  const [personDetails, setPersonDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [userNames, setUserName] = useState("");
  const [id, setId] = useState(0);
  const [apiImage, setApiImage] = useState("");
  const [editIconImage, setEditIconImage] = useState(false);
  const [addIconImage, setAddIconImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    image: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    photoUrl: "",
    siteId: "",
    departmentId: "",
    designationId: "",
    divisionId: "",
    managerStaffId: "",
    reportingStaffId: "",
    roleId: "",
    functionId: "",
    username: "",
    documentStatus: 3,
  });

  const handleToggleChange = (event) => {
    setFormData({
      ...formData,
      isActive: event.target.checked,
    });
  };
  function getRecords() {
    apiAuth.get(`/Staff/List`).then((resp) => {
      setIsLoading(false);
      setTaskList(resp.data.data);
    });
  }
  console.log(formData, "pppp");

  useEffect(() => {
    getRecords();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Function to open sidebar
  const openSidebar = (e, task) => {
    e.preventDefault();
    setOpenDetails(false);
    setApiImage("");
    setEditIconImage(false);
    setSidebarOpen(!sidebarOpen);
    setHandelUpdate(true);
    setAddIconImage(true);
    setPersonDetails("");
    setFormData({
      image: "",
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      photoUrl: "",
      siteId: "",
      departmentId: "",
      designationId: "",
      divisionId: "",
      managerStaffId: "",
      reportingStaffId: "",
      roleId: "",
      functionId: "",
      username: "",
      documentStatus: 3,
    });
    apiAuth.get(`/Staff/CreateData`).then((response) => {
      setSiteData(response.data.data.site);
      setDivision(response.data.data.division);
      setDepartment(response.data.data.department);
      setDesignation(response.data.data.designation);
      setFunction(response.data.data.function);
      setRole(response.data.data.role);
      SetStaffData(response.data.data.staffData);
    });
  };

  const openSidebarEdit = (e) => {
    setOpenDetails(false);
    setHandelUpdate(false);
    setEditIconImage(true);
    setAddIconImage(false);

    apiAuth.get(`/Staff/CreateData`).then((response) => {
      setSiteData(response.data.data.site);
      setDivision(response.data.data.division);
      setDepartment(response.data.data.department);
      setDesignation(response.data.data.designation);
      setFunction(response.data.data.function);
      setRole(response.data.data.role);
      SetStaffData(response.data.data.staffData);
    });
  };

  const handelOpenProfile = async (e, task) => {
    e.preventDefault();
    setOpenDetails(true);
    setEditIconImage(false);
    setAddIconImage(false);

    setSidebarOpen(!sidebarOpen);
    setId(task.staffId); // Set photoUrl to 'yes' when an image is uploaded, else ''

    await apiAuth
      .get(`/Staff/GetDetails?id=${task.staffId}`)
      .then((response) => {
        setUserName(response.data.data.userName);

        setPersonDetails(response.data.data);
        if (response.data.data.photoUrl) {
          const byteCharacters = atob(response.data.data.photoUrl);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" }); // Adjust the type according to your image type

          // Create URL for the Blob object
          const imageUrl = URL.createObjectURL(blob);
          setApiImage(imageUrl);
        } else {
          setApiImage("");
        }
        setFormData({
          ...formData,
          firstName: task.firstName,
          lastName: task.lastName,
          email: task.email,
          mobile: task.mobile,
          siteId: task.siteId,
          departmentId: task.departmentId,
          designationId: task.designationId,
          divisionId: task.divisionId,
          managerStaffId: task.managerStaffId,
          reportingStaffId: task.reportingStaffId,
          roleId: task.roleId,
          functionId: task.functionId,
          username: response.data.data.userName,
          documentStatus: task.documentStatus,
          photoUrl: task.photoUrl,
          image: "",
          isActive: task.isActive && task.isActive, // handle image separately if necessary
        });
      });
  };

  const handleSubmit = () => {
    const updatedTask = {
      ...task,
      notes: comments,
    };

    apiAuth
      .put(`/Task/Update?id=${taskType}`, updatedTask)
      .then((response) => {
        setOpen(false);
        console.log(response);
      })
      .catch((error) => {
        setOpen(false);
        console.error(error);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTaskList = taskList.filter((task) => {
    return (
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.mobile.includes(searchTerm)
    );
  });
  console.log(formData, "formss");
  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    setFormData((prevState) => ({
      ...prevState,
      photoUrl: file ? "yes" : "yes",
      image: event.target.files[0], // Set photoUrl to 'yes' when an image is uploaded, else ''
    }));
  };
  console.log(formData, "pppppp");

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = "First Name is required";
    if (!formData.lastName) tempErrors.lastName = "Last Name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    if (!formData.mobile) tempErrors.mobile = "Mobile is required";
    if (!formData.siteId) tempErrors.siteId = "Site is required";
    if (!formData.departmentId)
      tempErrors.departmentId = "Department is required";
    if (!formData.divisionId) tempErrors.divisionId = "Division is required";
    if (!formData.functionId) tempErrors.functionId = "Function is required";
    if (!formData.designationId)
      tempErrors.designationId = "Designation is required";
    if (!formData.roleId) tempErrors.roleId = "Role is required";
    if (!formData.username) tempErrors.username = "Username is required";
    // Add other validations here
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmitProfile = (e, value) => {
    e.preventDefault();
    if (validate()) {
      const formDatas = new FormData();

      formDatas.append("firstName", formData.firstName);
      formDatas.append("lastName", formData.lastName);
      formDatas.append("email", formData.email);
      formDatas.append("mobile", formData.mobile);
      formDatas.append("photoUrl", "yes");
      formDatas.append("siteId", formData.siteId);
      formDatas.append("departmentId", formData.departmentId);
      formDatas.append("designationId", formData.designationId);
      formDatas.append("divisionId", formData.divisionId);
      formDatas.append("managerStaffId", formData.managerStaffId);
      formDatas.append("reportingStaffId", formData.reportingStaffId);
      formDatas.append("roleId", formData.roleId);
      formDatas.append("functionId", formData.functionId);
      formDatas.append("username", formData.username);
      formDatas.append("documentStatus", formData.documentStatus);

      formDatas.append("image", formData.image ? formData.image : null);

      try {
        const path = value === "submit" ? "/Staff/Create" : `/staff/${id}`;
        if (value !== "submit") {
          formDatas.append("isActive", formData.isActive && formData.isActive);
        }
        if (value === "submit") {
          apiAuth
            .post(path, formDatas)
            .then((response) => {
              toast?.success("Staff Created");
              setSidebarOpen(false);
              // setTimeout(() => {
              //   location.reload();
              // }, 2000);
            })
            .catch((error) => {
              toast?.error("Some Error Occured");
            });
        } else {
          apiAuth
            .put(path, formDatas)
            .then((response) => {
              toast?.success("Staff Updated");
              setSidebarOpen(false);
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch((error) => {
              toast?.error("Some Error Occured");
            });
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
      }
    }
  };

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar1-open");
    } else {
      document.body.classList.remove("sidebar1-open");
    }

    return () => {
      document.body.classList.remove("sidebar1-open");
    };
  }, [sidebarOpen]);

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <>
      <ToastContainer className="toast-container " />
      <div style={{ margin: "20px" }}>
        <div className="flex d-flex flex-col flex-wrap task_form_area sm:flex-row w-full sm:w-auto space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel id="category-select-label" className="text-2xl">
            <b>Staff</b>
          </InputLabel>
        </div>

        <b className="text-xl">113 staffs</b>

        <Box className="flex-grow-2">
          <TextField
            fullWidth
            label="Search by Task Name"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
          />
          {feature.includes("STAC") && (
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="secondary"
              style={{
                padding: "23px",
                backgroundColor: "blue",
                marginLeft: "10px",
              }}
              type="submit"
              onClick={(e) => openSidebar(e, task)}
            >
              <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
              Add
            </Button>
          )}
        </Box>
      </div>

      <div
        _ngcontent-fyk-c288=""
        class="flex items-center w-full  border-b justify-between"
      ></div>
      {filteredTaskList.map((list) => (
        <div className="cardhover">
          <div
            className="relative  z-20 flex items-center px-6 py-4 md:px-8 cursor-pointer border-b staff-alert-type-success bg-primary-50 dark:bg-hover"
            style={{ padding: "20px" }}
            onClick={(e) => handelOpenProfile(e, list)}
          >
            <div className="z-10 absolute -top-px left-0 -bottom-px flex flex-0 w-1"></div>
            <div
              className="flex flex-0 items-center justify-center w-10 h-10 rounded-full overflow-hidden"
              style={{ width: "45px", height: "45px" }}
            >
              <div
                className="flex items-center justify-center w-full h-full rounded-full text-lg uppercase bg-gray-200   dark:text-gray-200"
                style={{ backgroundColor: "rgba(226,232,240)" }}
              >
                {list?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div
              className="min-w-0 ml-4 flex-auto"
              style={{ marginLeft: "15px" }}
            >
              <div className="font-medium leading-5 truncate">{list?.name}</div>
              <div className="leading-5 truncate text-secondary">
                <div className="float-left width-mobile">
                  <span className="float-left mt-1 mr-1">
                    <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
                  </span>
                  <span className="email-style">{list?.email}</span>
                </div>
                <div
                  className="ml-3 float-left width-mobile"
                  style={{ marginLeft: "10px" }}
                >
                  <span className="float-left mt-0.5 mr-1">
                    <FuseSvgIcon size={20}>heroicons-solid:phone</FuseSvgIcon>
                  </span>
                  <span className="phone-style">{list.mobile}</span>
                </div>
              </div>
            </div>
            {/* <small
              title="User Approved"
              className="pr-2 material-icons text-48"
              style={{ color: "green" }}
            >
              check_circle
            </small> */}
          </div>
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          ></div>
        </div>
      ))}
      {/* 
     
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={dateExtendopen}
        onClose={handlehandledateExtendClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={dateExtendopen}>
          <Box sx={style1}>
            <Box
              style={{
                padding: "30px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            ></Box>
          </Box>
        </Fade>
      </Modal> */}
      <div
        className={`sidebar1 ${sidebarOpen ? "open" : ""}`}
        style={{ overflowY: "auto" }}
      >
        {/* Add sidebar content here */}
        {/* <button onClick={closeSidebar}>Close Sidebar</button> */}
        <div className="flex flex-auto">
          <form
            className="flex flex-col flex-auto p-6 pt-10 sm:p-8 sm:pt-10 overflow-y-auto"
            style={{ overflow: "hidden", padding: "0px" }}
          >
            <div className="w-full">
              <div className="relative flex flex-auto flex-col w-full">
                <div className="flex-auto">
                  <div className="flex flex-col flex-auto flex-shrink">
                    <img
                      src="/assets/images/etc/profile.jpg"
                      style={{
                        height: "180px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                    {apiImage != "" ? (
                      <div
                        className="uploadImg1"
                        style={{
                          backgroundColor: apiImage
                            ? "rgb(56 54 54 / 55%)"
                            : "",
                        }}
                      >
                        <img className="upImg" src={apiImage} />
                      </div>
                    ) : (
                      <div
                        className="uploadImg1"
                        style={{
                          backgroundColor: apiImage
                            ? "rgb(56 54 54 / 55%)"
                            : "",
                          display: "flex", // Added to center the text
                          alignItems: "center", // Added to center the text vertically
                          justifyContent: "center", // Added to center the text horizontally
                          fontSize: "2rem", // Adjust as needed for desired text size
                          color: "#fff", // Adjust as needed for desired text color
                        }}
                      >
                        <h1 style={{ fontSize: "50px" }}>
                          {personDetails?.name?.charAt(0).toUpperCase()}
                        </h1>
                      </div>
                    )}
                    {formData.image && (
                      <div
                        className="uploadImg1"
                        style={{
                          backgroundColor: apiImage
                            ? "rgb(56 54 54 / 51%)"
                            : "",
                        }}
                      >
                        <img
                          className="upImg"
                          src={URL.createObjectURL(formData.image)}
                        />
                      </div>
                    )}

                    {editIconImage && (
                      <div className="uploadImg">
                        <FuseSvgIcon
                          size={20}
                          className="uplImg1"
                          onClick={handleIconClick}
                        >
                          heroicons-outline:camera
                        </FuseSvgIcon>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleImageUpload}
                        />

                        <FuseSvgIcon
                          size={20}
                          className="uplImg2"
                          onClick={() => setApiImage("")}
                        >
                          heroicons-outline:trash
                        </FuseSvgIcon>
                      </div>
                    )}
                    {addIconImage && (
                      <div className="uploadImg">
                        <FuseSvgIcon
                          size={20}
                          className="uplImg3"
                          onClick={handleIconClick}
                        >
                          heroicons-outline:camera
                        </FuseSvgIcon>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleImageUpload}
                        />
                      </div>
                    )}
                  </div>

                  {openDetails && (
                    <div style={styles.container}>
                      <Box className="flex-grow-2 justify-end">
                        {feature.includes("STAU") && (
                          <Button
                            className="whitespace-nowrap"
                            variant="contained"
                            style={{
                              paddingLeft: "23px",
                              paddingRight: "23px",
                              backgroundColor: "white",
                              border: "1px solid black",
                              marginLeft: "10px",
                            }}
                            type="submit"
                            onClick={(e) => openSidebarEdit(e)}
                          >
                            <FuseSvgIcon size={20}>
                              heroicons-outline:plus
                            </FuseSvgIcon>
                            Edit
                          </Button>
                        )}
                      </Box>
                      <div style={styles.gridContainerSm}>
                        <div>
                          <div style={styles.textMd}>First Name</div>
                          <div>{personDetails.firstName}</div>
                        </div>
                        <div>
                          <div style={styles.textMd}>Last Name</div>
                          <div style={styles.textSecondary}>
                            {personDetails.lastName}
                          </div>
                        </div>
                      </div>
                      <div style={styles.gridContainer}>
                        <div>
                          <div style={styles.textMd}>Email</div>
                          <div style={styles.textSecondary}>
                            {personDetails.email}
                          </div>
                        </div>
                        <div>
                          <div style={styles.textMd}>Mobile</div>
                          <div style={styles.textSecondary}>
                            {personDetails.mobile}
                          </div>
                        </div>
                      </div>
                      <div style={styles.borderT}></div>
                      <div style={styles.gridContainerSm}>
                        <div>
                          <div style={styles.textMd}>Site</div>
                          <div style={styles.textSecondary}>
                            {personDetails.siteName}
                          </div>
                        </div>
                        <div>
                          <div style={styles.textMd}>Department</div>
                          <div style={styles.textSecondary}>
                            {personDetails.departmentName}
                          </div>
                        </div>
                      </div>
                      <div style={styles.gridContainerSm}>
                        <div>
                          <div style={styles.textMd}>Division</div>
                          <div style={styles.textSecondary}>
                            {personDetails.divisionName}
                          </div>
                        </div>
                        <div>
                          <div style={styles.textMd}>Function</div>
                          <div style={styles.textSecondary}>
                            {personDetails.functionName}
                          </div>
                        </div>
                      </div>
                      <div style={styles.gridContainerSm}>
                        <div>
                          <div style={styles.textMd}>Designation</div>
                          <div style={styles.textSecondary}>
                            {personDetails.designationName}
                          </div>
                        </div>
                        <div>
                          <div style={styles.textMd}>Role</div>
                          <div style={styles.textSecondary}>
                            {personDetails.roleName}
                          </div>
                        </div>
                      </div>
                      <div style={styles.gridContainerSm}>
                        <div>
                          <div style={styles.textMd}>Manager</div>
                          <div style={styles.textSecondary}>
                            {personDetails.managerStaff}
                          </div>
                        </div>
                        <div>
                          <div style={styles.textMd}>Reporting</div>
                          <div style={styles.textSecondary}>
                            {personDetails.reportingStaff}
                          </div>
                        </div>
                      </div>
                      <div style={styles.gridContainer}>
                        <div>
                          <div style={styles.textMd}>User Name (JID)</div>
                          <div style={styles.textSecondary}>
                            {personDetails?.userName != undefined &&
                              personDetails?.userName}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {!openDetails && (
                    <>
                      {!handelUpdate && (
                        <div
                          className="flex justify-end"
                          style={{ marginTop: "10px" }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.isActive}
                                onChange={handleToggleChange}
                                // Reflects the isActive property of the department
                                // Passes the index of the department
                              />
                            }
                          />
                          <span style={{ paddingTop: "8px" }}>
                            {personDetails.isActive ? "Active" : "Not Active"}
                          </span>
                        </div>
                      )}
                      <div className="flex-auto" style={{ margin: "18px" }}>
                        <div className="flex sidebarMarg flex-col-reverse">
                          <div
                            style={{
                              justifyContent: "space-between",
                            }}
                            className="flex flex-row d-sm-block flex-wrap"
                          >
                            <Box
                              className="Fw-100 mt-10"
                              sx={{
                                width: 380,
                                maxWidth: "48%",
                              }}
                            >
                              <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                              />
                            </Box>
                            <Box
                              className="Fw-100 mt-10"
                              sx={{
                                width: 380,
                                maxWidth: "48%",
                              }}
                            >
                              <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                              />
                            </Box>
                          </div>
                        </div>
                        <div className="flex flex-col-reverse">
                          <div
                            style={{
                              justifyContent: "space-between",
                            }}
                            className="flex flex-row d-sm-block flex-wrap"
                          >
                            <Box
                              className="Fw-100 mt-10"
                              sx={{
                                width: 300,
                                maxWidth: "48%",
                              }}
                            >
                              <TextField
                                fullWidth
                                label="Email *"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                              />
                            </Box>
                            <Box
                              className="Fw-100 mt-10"
                              sx={{
                                width: 380,
                                maxWidth: "48%",
                              }}
                            >
                              <TextField
                                fullWidth
                                label="Mobile *"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                error={!!errors.mobile}
                                helperText={errors.mobile}
                              />
                            </Box>
                          </div>
                        </div>
                      </div>

                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full  border-b justify-between"
                        style={{ margin: "18px" }}
                      ></div>
                      <div className="flex-auto" style={{ margin: "18px" }}>
                        <div className="flex flex-col-reverse">
                          <div
                            style={{
                              justifyContent: "space-between",
                            }}
                            className="flex flex-row d-sm-block flex-wrap"
                          >
                            <FormControl
                              className="Fw-100 mt-10"
                              sx={{
                                width: 380,
                                maxWidth: "48%",
                              }}
                            >
                              <FormLabel
                                className="font-medium text-14"
                                component="legend"
                              >
                                Site *
                              </FormLabel>
                              <Select
                                variant="outlined"
                                value={formData.siteId}
                                onChange={handleChange}
                                name="siteId"
                                error={!!errors.siteId}
                              >
                                {site.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.value}
                                  >
                                    {option.text}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.siteId && (
                                <span style={{ color: "red" }}>
                                  {errors.siteId}
                                </span>
                              )}
                            </FormControl>
                            <FormControl
                              className="Fw-100 mt-10"
                              sx={{
                                width: 380,
                                maxWidth: "48%",
                              }}
                            >
                              <FormLabel
                                className="font-medium text-14"
                                component="legend"
                              >
                                Department *
                              </FormLabel>
                              <Select
                                variant="outlined"
                                value={formData.departmentId}
                                onChange={handleChange}
                                name="departmentId"
                                error={!!errors.departmentId}
                              >
                                {department.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.value}
                                  >
                                    {option.text}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.departmentId && (
                                <span style={{ color: "red" }}>
                                  {errors.departmentId}
                                </span>
                              )}
                            </FormControl>
                          </div>
                        </div>{" "}
                        <div className="flex flex-col-reverse">
                          <div
                            style={{
                              justifyContent: "space-between",
                            }}
                            className="flex flex-row d-sm-block flex-wrap"
                          >
                            <FormControl
                              className="Fw-100 mt-10"
                              sx={{
                                width: 380,
                                maxWidth: "48%",
                              }}
                            >
                              <FormLabel
                                className="font-medium text-14"
                                component="legend"
                              >
                                Division *
                              </FormLabel>
                              <Select
                                variant="outlined"
                                value={formData.divisionId}
                                onChange={handleChange}
                                name="divisionId"
                                error={!!errors.divisionId}
                              >
                                {division.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.value}
                                  >
                                    {option.text}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.divisionId && (
                                <span style={{ color: "red" }}>
                                  {errors.divisionId}
                                </span>
                              )}
                            </FormControl>
                            <FormControl
                              className="Fw-100 mt-10"
                              sx={{
                                width: 380,
                                maxWidth: "48%",
                              }}
                            >
                              <FormLabel
                                className="font-medium text-14"
                                component="legend"
                              >
                                Function *
                              </FormLabel>
                              <Select
                                variant="outlined"
                                value={formData.functionId}
                                onChange={handleChange}
                                name="functionId"
                                error={!!errors.functionId}
                              >
                                {functions.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.value}
                                  >
                                    {option.text}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.functionId && (
                                <span style={{ color: "red" }}>
                                  {errors.functionId}
                                </span>
                              )}
                            </FormControl>
                          </div>
                        </div>{" "}
                        <div className="flex flex-col-reverse">
                          <div
                            style={{
                              justifyContent: "space-between",
                            }}
                            className="flex flex-row  d-sm-block flex-wrap"
                          >
                            <FormControl
                              className="Fw-100 mt-10"
                              sx={{
                                width: 380,
                                maxWidth: "48%",
                              }}
                            >
                              <FormLabel
                                className="font-medium text-14"
                                component="legend"
                              >
                                Designation *
                              </FormLabel>
                              <Select
                                variant="outlined"
                                value={formData.designationId}
                                onChange={handleChange}
                                name="designationId"
                                error={!!errors.designationId}
                              >
                                {designation.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.value}
                                  >
                                    {option.text}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.designationId && (
                                <span style={{ color: "red" }}>
                                  {errors.designationId}
                                </span>
                              )}
                            </FormControl>
                            <FormControl
                              className="Fw-100 mt-10"
                              sx={{
                                width: 380,
                                maxWidth: "48%",
                              }}
                            >
                              <FormLabel
                                className="font-medium text-14"
                                component="legend"
                              >
                                Role *
                              </FormLabel>
                              <Select
                                variant="outlined"
                                value={formData.roleId}
                                onChange={handleChange}
                                name="roleId"
                                error={!!errors.roleId}
                              >
                                {role.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.value}
                                  >
                                    {option.text}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.roleId && (
                                <span style={{ color: "red" }}>
                                  {errors.roleId}
                                </span>
                              )}
                            </FormControl>
                          </div>
                        </div>{" "}
                        <div className="flex flex-col-reverse">
                          <div
                            style={{
                              justifyContent: "space-between",
                            }}
                            className="flex flex-row d-sm-block flex-wrap"
                          >
                            <FormControl
                              className="Fw-100 mt-10"
                              sx={{
                                width: 380,
                                maxWidth: "48%",
                              }}
                            >
                              <FormLabel
                                className="font-medium text-14"
                                component="legend"
                              >
                                Manager
                              </FormLabel>
                              <Select
                                variant="outlined"
                                value={formData.managerStaffId}
                                onChange={handleChange}
                                name="managerStaffId"
                                error={!!errors.managerStaffId}
                              >
                                {staffData.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.value}
                                  >
                                    {option.text}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl
                              className="Fw-100 mt-10"
                              sx={{
                                width: 380,
                                maxWidth: "48%",
                              }}
                            >
                              <FormLabel
                                className="font-medium text-14"
                                component="legend"
                              >
                                Reporting
                              </FormLabel>
                              <Select
                                variant="outlined"
                                value={formData.reportingStaffId}
                                onChange={handleChange}
                                name="reportingStaffId"
                              >
                                {staffData.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.value}
                                  >
                                    {option.text}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </div>{" "}
                        <div className="flex flex-col-reverse">
                          <div
                            style={{
                              justifyContent: "space-between",
                            }}
                            className="flex flex-row d-sm-block flex-wrap"
                          >
                            <Box
                              className="Fw-100 mt-10"
                              sx={{
                                width: 800,
                                maxWidth: "100%",
                              }}
                            >
                              <TextField
                                fullWidth
                                label="User Name (JID) *"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                error={!!errors.username}
                                helperText={errors.username}
                              />
                            </Box>
                          </div>
                        </div>
                        <div
                          className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                          style={{
                            marginTop: "15px",
                            justifyContent: "end",
                            backgroundColor: " rgba(248,250,252)",
                            padding: "10px",
                          }}
                        >
                          <Button
                            className="whitespace-nowrap"
                            variant="contained"
                            color="primary"
                            style={{
                              padding: "23px",
                              backgroundColor: "white",
                              color: "black",
                              border: "1px solid grey",
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="whitespace-nowrap"
                            variant="contained"
                            color="secondary"
                            style={{ padding: "23px", backgroundColor: "blue" }}
                            type="submit"
                            onClick={(e) =>
                              handleSubmitProfile(
                                e,
                                handelUpdate ? "submit" : "update"
                              )
                            }
                          >
                            {handelUpdate ? "Submit" : "Update"}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div>&nbsp;</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Task;
