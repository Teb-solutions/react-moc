import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import "react-toastify/dist/ReactToastify.css";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

const styleImp = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  maxWidth: "80vw",
  height: "auto",
  borderRadius: "16px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};
const GuideLines = ({ handelGuideOpen, handelGuideClose }) => {
  const requiredArray = [
    "Equipment (e.g. replacing valve, vessel, lines with)",
    "Is Equipment having different Dimensions",
    "Is Equipment having different Material",
    "Is equipment having different design Limits",
    "Safety thresholds",
    "Modification of relief valve set pressure",
    "Modification of threshold setting of a safety instrumented function",
    "Modification of threshold setting of alarms",
    "Operating conditions",
    "Is operating parameters outside design range",
    "Process",
    "Is process equipment Bypassed",
    "Is process instrumentation bypassed",
    "Technologies",
    "Is New Technology being used",
    "Procedures",
    "Is procedure being modified",
    "Materials or products used",
    "Is new material OR product being used",
    "Personnel and organisation (e.g.",
    "Modification of relief valve set pressure",
    "Modification of relief valve set pressure",
    "new assignment in a key HSE position",
    "lack of a key competence",
    "major organisation modification",
    "Modification of an existing installation, including compliance work temporary or permanent",
    "Is there a modification such as adaptation, transformation",
    "removal or addition – of a function that affects the installations' basic design or operation.",
    "Is there any alteration that has an impact on an installation's safety logic diagram",
    "They concern physical changes, but also the programming of the command-control or safety systems and the parameter settings of instruments.",
    "Modification of an industrial project",
    "Is there a change in statement of requirement?",
    "identifying the change orders, examining them and, above all, for disseminating the information through the project team",
    "Modification of an existing organisation – resulting in a modified workload – or in the interests of optimisation.",
    "Is there a change in ORG structure established initially to perform works?",
    "Is there a change in ORG structure established initially to operate?",
    "Temporary modifications with an explicit final date",
    "Is the modification for a short duration?",
    "The MOC Process offers two options for closing out a temporary change:",
    "Is the change returned to original conditions?",
    "Once a temporary change is no longer required and the change is restored to its original pre-change configuration, a second PSSR will be completed prior to being brought back into service. The MOC can then be closed.",
    "Is the change become a permanent change?",
    "the MOC Process must be restarted and the change reviewed as a permanent change to the asset.",
    "Downgraded situations",
    "Is the compensatory measures after initial risk assessment changed?",
    "Equipment upgrades and changes in materials Is there an upgrade of the equipment or materials?",
    "Initiated by supplier & managed by him, Equipment provided on the installation or used in operations",
    "If such modifications are likely to alter the level of risk involved ? (in routine use)",
    "If such modifications are likely to alter the level of risk involved ? (in Maintenance)",
    "Changes of product, material and/or substance (except technical changes to product, raw material, packaging material LUBES)",
    "Is there a change in chemicals, materials & substances due to",
    "new technologies",
    "stock renewal",
    "obsolescence",
    "reordering problems",
    "optimisation",
    "Changes in contractual strategy",
    "Is there a change in contractual strategy? (Contractual change having potential impact on HSE risk level)",
    "Modification of an existing operating program",
    "change in the service of a storage tank from one product to another (e.g. from butane to propane)",
    "Likewise any change of the product reception mode in a plant or tank farm",
    "Is there a change in product reception mode in plant or tank farm? (example from ship to pipeline?)",
    "legal requirement changes",
    "Group requirement changes",
    "audits & inspections",
    "Internal audits",
    "mgt review meeting",
    "monthly review meeting",
    "Near Miss & deviations",
    "Capex & Opex",
    "customer complaints",
    "Hazid / Hazop",
    "TRA",
    "Transport change",
    "Replacing vessels or piping or valves with equipment having the same design specifications as the original equipment (metallurgy, wall thickness, pressure and vacuum rating, design temperature, heat treatment, valve Cv, etc.).",
    "Repairing a corroded vessel to restore its original wall thickness.",
    "Repaving an existing road while maintaining existing drainage, shoulder elevation, width, etc.",
  ];

  const notRequiredArray = [
    "Replacing rotating equipment with new equipment of the same material, capacity, flange rating, seal design, driver type, horsepower, etc.",
    "Tuning a controller to more tightly control the process variable.",
    "Replacing a Distributed Control System (DCS) component with an identical replacement.",
    "Replacing an instrument with an identical spare in every respect.",
    "Modifying process operating parameters but staying within the safe operating range established by prior safety analyses, including, but not limited to: flow, temperature, pressure, composition, time, pH, speed, production rate, inventory, weight, level, density, frequency/amplitude of vibrating equipment, voltage/current/power.",
    "Rearranging warehouse stock, but within the established basis for safe operation with respect to considerations such as inventory limits, compatibility groupings, fire protection system capabilities, etc.",
    "Making minor editorial changes or typographical corrections to operating or maintenance procedures.",
    "Delegating approval responsibilities (e.g. for work order approval) to a properly qualified substitute in accordance with the pre-established delegation schedule.",
    "Recharging a fixed fire protection system with the same firefighting agent previously used.",
    "Replacing a relief valve with a new valve that is identical to the original.",
    "Operating a process with an interlock (inhibition/by-pass) for maintenance but with alternative means of protection provided, as specified in the operating procedures.",
    "Replacing hazardous area lighting with fixtures of the same type, design and certification ATEX.",
    "Note: Replacement-in-kind does not exclude the application of current standards.",
  ];

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={handelGuideOpen}
      onClose={handelGuideClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={handelGuideOpen}>
        <Box sx={styleImp}>
          {/* Header */}
          <Box
            style={{
              padding: "15px",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              color: "black",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">MOC Guide</Typography>
            <Button onClick={handelGuideClose}>
              <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
            </Button>
          </Box>

          {/* Tabs for MOC Guide Sections */}
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: 1,
            }}
          >
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="MOC Required Examples" />
              <Tab label="MOC Not Required Examples" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box
            sx={{
              maxHeight: 400, // Restrict height to make it scrollable
              overflowY: "auto",
              padding: "15px",
            }}
          >
            {tabValue === 0 && (
              <List>
                {requiredArray.map((example, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#e0f7fa", // Light blue hover effect
                      },
                      borderBottom: "1px solid #ccc", // Bottom border between items
                    }}
                  >
                    <ListItemText primary={example} />
                  </ListItem>
                ))}
              </List>
            )}
            {tabValue === 1 && (
              <List>
                {notRequiredArray.map((example, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#e0f7fa", // Light blue hover effect
                      },
                      borderBottom: "1px solid #ccc", // Bottom border between items
                    }}
                  >
                    <ListItemText primary={example} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default GuideLines;
