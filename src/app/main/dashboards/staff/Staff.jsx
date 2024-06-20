import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import { useState } from "react";
import { Button, FormControlLabel, FormLabel, Switch } from "@mui/material";
import { Box } from "@mui/material";
import { apiAuth } from "src/utils/http";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const Task = () => {
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
  };

  // Function to open sidebar
  const openSidebar = (e, task) => {
    e.preventDefault();
    setOpenDetails(false);
    setSidebarOpen(!sidebarOpen);
    setHandelUpdate(true);
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

  const handelOpenProfile = (e, task) => {
    e.preventDefault();
    setOpenDetails(true);
    setSidebarOpen(!sidebarOpen);
    setId(task.staffId); // Set photoUrl to 'yes' when an image is uploaded, else ''

    apiAuth.get(`/Staff/GetDetails?id=${task.staffId}`).then((response) => {
      setUserName(response.data.data.userName);
      setPersonDetails(response.data.data);
    });
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
      username: userNames,
      documentStatus: task.documentStatus,
      photoUrl: task.photoUrl,
      image: "",
      isActive: task.isActive && task.isActive, // handle image separately if necessary
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
      task.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.mobile.includes(searchTerm)
    );
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    setFormData((prevState) => ({
      ...prevState,
      photoUrl: file ? "yes" : "",
      image: event.target.files[0], // Set photoUrl to 'yes' when an image is uploaded, else ''
    }));
  };

  const handleSubmitProfile = (e, value) => {
    e.preventDefault();
    const formDatas = new FormData();

    formDatas.append("firstName", formData.firstName);
    formDatas.append("lastName", formData.lastName);
    formDatas.append("email", formData.email);
    formDatas.append("mobile", formData.mobile);
    formDatas.append("photoUrl", formData.photoUrl);
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
    // formDatas.append("isActive", formData.isActive && formData.isActive);
    formDatas.append("image", formData.image);

    try {
      const path = value === "submit" ? "/Staff/Create" : `/staff/${id}`;
      apiAuth.post(path, formDatas).then((response) => {});
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
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

  return (
    <>
      <div className="" style={{ margin: "20px" }}>
        <div className="flex d-flex flex-col flex-wrap task_form_area sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            style={{ fontSize: "x-large" }}
          >
            <b>Staff</b>
          </InputLabel>
        </div>
        <div>&nbsp;</div>

        <b style={{ fontSize: "x-large" }}>113 staffs</b>
        <div>&nbsp;</div>

        <Box className="flex-grow-2">
          <TextField
            fullWidth
            label="Search by Task Name"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
          />
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

                    {formData.image && (
                      <div className="uploadImg1">
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Uploaded"
                        />
                      </div>
                    )}
                    <div className="uploadImg">
                      {/* {!openDetails && (
                        // <input
                        //   type="file"
                        //   accept="image/*"
                        //   onChange={handleImageUpload}
                        // />
                      )} */}
                      <FuseSvgIcon size={20}>
                        heroicons-outline:camera
                      </FuseSvgIcon>
                    </div>
                  </div>
                  {openDetails && (
                    <div style={styles.container}>
                      <Box className="flex-grow-2 justify-end">
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
                      </Box>
                      <div style={styles.gridContainerSm}>
                        <div>
                          <div style={styles.textMd}>First Name</div>
                          <div>{formData.firstName}</div>
                        </div>
                        <div>
                          <div style={styles.textMd}>Last Name</div>
                          <div style={styles.textSecondary}>
                            {formData.lastName}
                          </div>
                        </div>
                      </div>
                      <div style={styles.gridContainer}>
                        <div>
                          <div style={styles.textMd}>Email</div>
                          <div style={styles.textSecondary}>
                            {formData.email}
                          </div>
                        </div>
                        <div>
                          <div style={styles.textMd}>Mobile</div>
                          <div style={styles.textSecondary}>
                            {formData.mobile}
                          </div>
                        </div>
                      </div>
                      <div style={styles.borderT}></div>
                      <div style={styles.gridContainerSm}>
                        <div>
                          <div style={styles.textMd}>Site</div>
                          <div style={styles.textSecondary}>
                            {formData.siteId}
                          </div>
                        </div>
                        <div>
                          <div style={styles.textMd}>Department</div>
                          <div style={styles.textSecondary}>
                            {formData.departmentId}
                          </div>
                        </div>
                      </div>
                      <div style={styles.gridContainerSm}>
                        <div>
                          <div style={styles.textMd}>Division</div>
                          <div style={styles.textSecondary}>
                            {formData.divisionId}
                          </div>
                        </div>
                        <div>
                          <div style={styles.textMd}>Function</div>
                          <div style={styles.textSecondary}>
                            {formData.functionId}
                          </div>
                        </div>
                      </div>
                      <div style={styles.gridContainerSm}>
                        <div>
                          <div style={styles.textMd}>Designation</div>
                          <div style={styles.textSecondary}>
                            {formData.designationId}
                          </div>
                        </div>
                        <div>
                          <div style={styles.textMd}>Role</div>
                          <div style={styles.textSecondary}>
                            {formData.roleId}
                          </div>
                        </div>
                      </div>
                      <div style={styles.gridContainerSm}>
                        <div>
                          <div style={styles.textMd}>Manager</div>
                          <div style={styles.textSecondary}>
                            {formData.managerStaffId}
                          </div>
                        </div>
                        <div>
                          <div style={styles.textMd}>Reporting</div>
                          <div style={styles.textSecondary}>
                            {formData.reportingStaffId}
                          </div>
                        </div>
                      </div>
                      <div style={styles.gridContainer}>
                        <div>
                          <div style={styles.textMd}>User Name</div>
                          <div style={styles.textSecondary}>
                            {formData.firstName}
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
                        </div>
                      )}
                      <div className="flex-auto">
                        <div className="flex sidebarMarg flex-col-reverse">
                          <div
                            style={{
                              marginTop: "30px",
                              justifyContent: "space-between",
                              margin: "15px",
                            }}
                            className="flex flex-row "
                          >
                            <Box
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
                              />
                            </Box>
                            <Box
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
                              />
                            </Box>
                          </div>
                        </div>
                        <div className="flex flex-col-reverse">
                          <div
                            style={{
                              marginTop: "30px",
                              justifyContent: "space-between",
                              margin: "15px",
                            }}
                            className="flex flex-row "
                          >
                            <Box
                              sx={{
                                width: 800,
                                maxWidth: "100%",
                              }}
                            >
                              <TextField
                                fullWidth
                                label="Email *"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                              />
                            </Box>
                          </div>
                        </div>
                        <div className="flex flex-col-reverse">
                          <div
                            style={{
                              marginTop: "30px",
                              justifyContent: "space-between",
                              margin: "15px",
                            }}
                            className="flex flex-row "
                          >
                            <Box
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
                              />
                            </Box>
                          </div>
                        </div>
                      </div>
                      <div>&nbsp;</div>
                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full  border-b justify-between"
                      ></div>
                      <div className="flex flex-col-reverse">
                        <div
                          style={{
                            marginTop: "30px",
                            justifyContent: "space-between",
                            margin: "15px",
                          }}
                          className="flex flex-row "
                        >
                          <FormControl
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
                            >
                              {site.map((option) => (
                                <MenuItem key={option.id} value={option.value}>
                                  {option.text}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl
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
                            >
                              {department.map((option) => (
                                <MenuItem key={option.id} value={option.value}>
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
                            marginTop: "30px",
                            justifyContent: "space-between",
                            margin: "15px",
                          }}
                          className="flex flex-row "
                        >
                          <FormControl
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
                            >
                              {division.map((option) => (
                                <MenuItem key={option.id} value={option.value}>
                                  {option.text}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl
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
                            >
                              {functions.map((option) => (
                                <MenuItem key={option.id} value={option.value}>
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
                            marginTop: "30px",
                            justifyContent: "space-between",
                            margin: "15px",
                          }}
                          className="flex flex-row "
                        >
                          <FormControl
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
                            >
                              {designation.map((option) => (
                                <MenuItem key={option.id} value={option.value}>
                                  {option.text}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl
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
                            >
                              {role.map((option) => (
                                <MenuItem key={option.id} value={option.value}>
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
                            marginTop: "30px",
                            justifyContent: "space-between",
                            margin: "15px",
                          }}
                          className="flex flex-row "
                        >
                          <FormControl
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
                            >
                              {staffData.map((option) => (
                                <MenuItem key={option.id} value={option.value}>
                                  {option.text}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl
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
                                <MenuItem key={option.id} value={option.value}>
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
                            marginTop: "30px",
                            justifyContent: "space-between",
                            margin: "15px",
                          }}
                          className="flex flex-row "
                        >
                          <Box
                            sx={{
                              width: 800,
                              maxWidth: "100%",
                            }}
                          >
                            <TextField
                              fullWidth
                              label="User Name *"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
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
