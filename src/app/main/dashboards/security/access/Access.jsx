import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button, FormControlLabel, InputLabel, Switch } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { List, ListItem, Divider } from "@mui/material";
import { useEffect } from "react";
import { apiAuth } from "src/utils/http";
import MocHeader from "../../moc/MocHeader";
import { encryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";

const Access = () => {
  const pageLayout = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [activeRole, setActiveRole] = useState("Admin");
  const [roleList, setRoleList] = useState([]);
  const [roleIdList, setRoleIdList] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState([]);

  const featureMap = [
    { id: 1, code: "MST", description: "Master", parentId: 0 },
    { id: 2, code: "MCRT", description: "Master_Create", parentId: 1 },
    { id: 3, code: "MUPT", description: "Master_Update", parentId: 1 },
    { id: 4, code: "MDEL", description: "Master_Delete", parentId: 1 },
    { id: 5, code: "ACC", description: "Access", parentId: 0 },
    { id: 6, code: "ACCC", description: "Access_Management", parentId: 5 },
    { id: 7, code: "RLE", description: "Role", parentId: 0 },
    { id: 8, code: "RLC", description: "Role_Create", parentId: 7 },
    { id: 9, code: "RLCU", description: "Role_Update", parentId: 7 },
    { id: 10, code: "RLD", description: "Role_Delete", parentId: 7 },
    { id: 11, code: "STA", description: "Staff", parentId: 0 },
    { id: 12, code: "STAC", description: "Staff_Create", parentId: 11 },
    { id: 13, code: "STAU", description: "Staff_Update", parentId: 11 },
    { id: 14, code: "STAD", description: "Staff_Delete", parentId: 11 },
    { id: 15, code: "REQ", description: "Request", parentId: 0 },
    { id: 16, code: "REQC", description: "Request_Create", parentId: 15 },
    { id: 17, code: "TASK", description: "Task", parentId: 0 },
    { id: 18, code: "TSK", description: "Tasks", parentId: 17 },
  ];

  const handleToggleAll = () => {
    if (allExpanded) {
      setExpandedAccordions([]);
    } else {
      const allAccordionIds = roleIdList
        .filter((item) => item.parentId === 0)
        .map((item) => item.featureId);
      setExpandedAccordions(allAccordionIds);
    }
    setAllExpanded(!allExpanded);
  };

  const handleAccordionChange = (accordionId) => {
    const currentIndex = expandedAccordions.indexOf(accordionId);
    const newExpandedAccordions = [...expandedAccordions];

    if (currentIndex === -1) {
      newExpandedAccordions.push(accordionId);
    } else {
      newExpandedAccordions.splice(currentIndex, 1);
    }

    setExpandedAccordions(newExpandedAccordions);
  };

  function getRecords() {
    apiAuth.get(`/Role/List`).then((resp) => {
      setRoleList(resp.data.data);
      apiAuth
        .get(`/RoleFeature/List?roleId=${resp.data.data[0].roleId}`)
        .then((resp) => {
          setRoleIdList(resp.data.data);
        });
    });
  }

  useEffect(() => {
    getRecords();
  }, []);

  const getFeatureShortForms = (updatedList) => {
    return updatedList
      .filter((item) => item.isActive)
      .map((item) => {
        const feature = featureMap.find((f) => f.id === item.featureId);
        return feature ? feature.code : null;
      })
      .filter(Boolean); // Remove undefined values
  };

  const updateFeaturesInCookies = (updatedList) => {
    // Get short forms from updatedList
    let activeShortForms = getFeatureShortForms(updatedList);

    // Check and remove parent features if all children are deactivated
    const parentFeatures = featureMap.filter((f) => f.parentId === 0);

    parentFeatures.forEach((parent) => {
      const childFeatures = featureMap.filter((f) => f.parentId === parent.id);
      const allChildrenInactive = childFeatures.every(
        (child) =>
          !updatedList.find(
            (item) => item.featureId === child.id && item.isActive
          )
      );

      if (allChildrenInactive) {
        activeShortForms = activeShortForms.filter(
          (code) => code !== parent.code
        );
      } else {
        // Add parent if at least one child is active and parent is not already included
        if (!activeShortForms.includes(parent.code)) {
          activeShortForms.push(parent.code);
        }
      }
    });

    console.log("updatedList", updatedList);
    console.log("activeShortForms", activeShortForms);

    // Encrypt and store the active short forms in cookies
    encryptFeature(activeShortForms);
  };

  const handelRole = (role) => {
    setActiveRole(role.name);
    apiAuth.get(`/RoleFeature/List?roleId=${role.roleId}`).then((resp) => {
      setRoleIdList(resp.data.data);
    });
  };

  const handleSwitchChange = (featureId, roleId, isActive) => {
    apiAuth
      .post("/RoleFeature/Create", {
        featureId: featureId,
        roleId: roleId,
        isActive: !isActive, // Send the new state to the server
      })
      .then((response) => {
        console.log("API response:", response.data);
        if (response) {
          const updatedList = roleIdList.map((item) =>
            item.featureId === featureId
              ? { ...item, isActive: !isActive }
              : item
          );
          apiAuth.get(`/Staff/Staff`).then((resp) => {
            if (resp.data?.data) {
              const enData = encryptFeature(resp.data?.data?.features);
              if (enData) {
                setRoleIdList(updatedList);
              }
            }
          });

          // updateFeaturesInCookies(updatedList);s
        }
        // Optionally update the state based on the response if needed
      })
      .catch((error) => {
        console.error("API error:", error);
        // Optionally revert the state update if the API call fails
        setRoleIdList(roleIdList); // Revert to the original state
      });
  };

  return (
    <>
      <div
        style={{ backgroundColor: "white", borderBottom: "1px solid #ededed" }}
      >
        <MocHeader />{" "}
        <div
          style={{
            marginLeft: "30px",
            marginRight: "30px",
            marginBottom: "30px",
          }}
        >
          <div className="flex d-flex flex-col justify-between flex-wrap task_form_area sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
            <InputLabel id="category-select-label" style={{ fontSize: "xx-large", color: "black" }}>
              <b>Access</b>
            </InputLabel>
          </div>
        </div>
      </div>
      <FusePageSimple
        content={
          <div style={{ width: "100%" }}>
            <div
              style={{
                backgroundColor: "white",
                // borderBottom: "4px solid #ededed",
              }}
            >
              {" "}
              <div
                style={{
                  marginLeft: "30px",
                  marginRight: "30px",
                  marginBottom: "0",
                }}
              >
                <div className="flex d-flex pt-5 flex-col justify-between flex-wrap task_form_area sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
                  <InputLabel
                    id="category-select-label" className="subtitle_custom"
                    style={{
                      fontSize: "large",
                      color: "black",
                      paddingTop: "10px",
                    }}
                  >
                    <b>Feature</b>
                  </InputLabel>
                  <div
                    className="flex justify-end"
                    style={{ marginTop: "10px" }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={allExpanded}
                          onChange={handleToggleAll}
                        />
                      }
                    />
                    <span style={{ paddingTop: "8px" }}>Open All</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ margin: "20px 30px" }}>
              {roleIdList
                .filter((item) => item.parentId === 0)
                .map((accordionItem) => (
                  <Accordion className="Access_list_box"
                    key={accordionItem.featureId}
                    style={{
                      marginTop: "15px",
                      borderRadius: "10px",
                      padding: "10px 15px",
                    }}
                    expanded={expandedAccordions.includes(
                      accordionItem.featureId
                    )}
                    onChange={() =>
                      handleAccordionChange(accordionItem.featureId)
                    }
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{accordionItem.feature}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {roleIdList
                          .filter(
                            (item) => item.parentId === accordionItem.featureId
                          )
                          .map((detailItem) => (
                            <div key={detailItem.featureId}>
                              <ListItem>
                                <span className="sec_name">
                                  {detailItem.feature}
                                </span>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={detailItem.isActive} // Control the Switch with state
                                      onChange={() =>
                                        handleSwitchChange(
                                          detailItem.featureId,
                                          detailItem.roleId,
                                          detailItem.isActive
                                        )
                                      }
                                    />
                                  }
                                  label=""
                                  labelPlacement="end"
                                />
                              </ListItem>
                              <Divider />
                            </div>
                          ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
            </div>
          </div>
        }
        leftSidebarWidth={400}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarContent={
          <div style={{ backgroundColor: "white" }}>
            <div
              className="py-10"
              style={{ marginTop: "18px", marginLeft: "30px" }}
            >
              <div className="text-3xl font-bold tracking-tighter">
                Role
              </div>
              <div style={{ marginTop: "25px" }}>
                <ul className="mt-3 side-nav-s fuse-vertical-navigation-item-title-wrapper pr-30">
                  {roleList.map((role) => (
                    <li
                      key={role.name}
                      className={`text-lg font-semibold flex rounded-1xl fuse-vertical-navigation-item cursor-pointer p-2`}
                      onClick={() => handelRole(role)}
                      style={{
                        padding: "14px",
                        backgroundColor:
                          activeRole === role.name
                            ? "#f5f5f5"
                            : "transparent",
                      }}
                    >
                      <span>{role.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        }
        scroll="content"
        ref={pageLayout}
      />
    </>
  );
};

export default Access;
