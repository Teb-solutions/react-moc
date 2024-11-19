import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
} from "@mui/material";
import Button from "../../../common/Button";
import CommonModal from "../../../common/CommonModal";
import { TaskPopupType } from "../../../helpers/enum";
import ControlMeasures from "./ControlMeasures";
import InfoSection from "./InfoSection";
import RiskSection from "./RiskSection";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TaskApprovalHistory from "./TaskAppovalHistory";
interface RiskItemProps {
  label: string;
  value: string;
}
const priskItems: RiskItemProps[] = [
  { label: "Time", value: "10" },
  { label: "Frequency", value: "<day" },
  { label: "Frequency Scoring", value: "10" },
  { label: "Likelyhood Scoring", value: "23" },
  { label: "Severity Scoring", value: "12" },
];

const rriskItems: RiskItemProps[] = [
  { label: "Time", value: "20" },
  { label: "Frequency", value: "<week" },
  { label: "Frequency Scoring", value: "14" },
  { label: "Likelyhood Scoring", value: "23" },
  { label: "Severity Scoring", value: "15" },
];
const VersionHistory = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <CommonModal
      open={isOpen}
      handleClose={() => {
        setIsOpen(false);
      }}
      title="Version History"
    >
      <div className="flex flex-col">
        <div className="flex flex-col my-20">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Version 1
            </AccordionSummary>
            <AccordionDetails>
              <article
                className="flex flex-col px-6 bg-white rounded-lg"
                style={{ maxHeight: "75vh", overflowY: "auto" }}
              >
                <div className="flex flex-col mt-5">
                  <InfoSection />
                  <RiskSection riskItems={priskItems} title="Potential Risk" />
                  <hr className="mt-8 w-full border border-solid border-neutral-200" />
                  <RiskSection riskItems={rriskItems} title="Residual Risk" />
                  <hr className="mt-8 w-full border border-solid border-neutral-200" />
                  <ControlMeasures />

                  <hr className="mt-8 w-full border border-solid border-neutral-200" />
                  <TaskApprovalHistory />
                </div>
              </article>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              Version 2
            </AccordionSummary>
            <AccordionDetails>
              <article
                className="flex flex-col px-6 bg-white rounded-lg"
                style={{ maxHeight: "75vh", overflowY: "auto" }}
              >
                <div className="flex flex-col mt-5">
                  <InfoSection />
                  <RiskSection riskItems={priskItems} title="Potential Risk" />
                  <hr className="mt-8 w-full border border-solid border-neutral-200" />
                  <RiskSection riskItems={rriskItems} title="Residual Risk" />
                  <hr className="mt-8 w-full border border-solid border-neutral-200" />
                  <ControlMeasures />

                  <hr className="mt-8 w-full border border-solid border-neutral-200" />
                  <TaskApprovalHistory />
                </div>
              </article>
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="flex my-20 flex-row gap-10 w-full text-right justify-end">
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            type="button"
            variant="neutral"
          >
            Close
          </Button>
        </div>
      </div>
    </CommonModal>
  );
};
export default VersionHistory;
