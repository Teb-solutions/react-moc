// Function to convert step index to alphabet
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Chip } from "@mui/material";
// Custom StepIcon component
const CustomStepIcon = (props) => {
  const { active, completed, className, index, canView, isComplete, status } =
    props;
  console.log(status, "vvvccc");
  return (
    <div
      className={`MuiStepIcon-root ${className} ${active ? "MuiStepIcon-active" : ""}`}
    >
      {isComplete && status != "Sent back for review" ? (
        <CheckCircleIcon
          className="MuiStepIcon-completed"
          style={{ color: "#4f46e5", width: 30, height: 30 }}
        /> // Customize color here
      ) : status == "Sent back for review" ? (
        <CancelIcon style={{ color: "red", width: 30, height: 30 }} />
      ) : (
        <Chip
          size="medium"
          style={{
            color: "blue",
            width: 30,
            height: 30,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12, // Adjust font size as needed
            paddingLeft: "1px",
            border: "2px solid #cdcdcd",
            backgroundColor: "white",
          }}
          label="!"
        />
      )}
    </div>
  );
};

export default CustomStepIcon;
