import React from "react";
import InfoItem from "./InfoItem";
import { IHiraList, IRiskRegisterDetails } from "../../helpers/type";
import {
  RiskCategory,
  RiskRegisterStatus,
  RiskRegisterTeamRoleDisplayNames,
} from "../../helpers/enum";
import dayjs from "dayjs";
import { Icon } from "@mui/material";

interface InitiationSectionProps {
  reqNo: string;
  site: string;
  division: string;
  category: string;
  sic: string;
  date: string;
  projectName: string;
  projectDescription: string;
}

const Team = ({ risk }: { risk: IRiskRegisterDetails }) => {
  const infoItems = [];
  risk.teamList.length > 0 &&
    risk.teamList.forEach((team) => {
      infoItems.push({
        label: RiskRegisterTeamRoleDisplayNames[team.teamType],
        value: team.staffName,
      });
    });
  console.log(infoItems);
  return (
    <section className="flex flex-col overflow-hidden gap-8 items-start px-6 py-12 text-sm bg-white rounded-lg max-md:px-5">
      <h2 className="grow shrink text-2xl font-semibold text-black w-[1172px] max-md:max-w-full">
        SIC Approval
      </h2>
      <div className="flex text-lg mb-20">
        {risk.status === RiskRegisterStatus.SICApproval ? (
          <div className="flex text-lg mt-10">
            <Icon className="text-amber-500">info</Icon>
            <span className="mt-5 ml-4">Awaiting SIC Approval</span>
          </div>
        ) : (
          <>
            <Icon
              className={`${risk.status === RiskRegisterStatus.SICRejected ? "text-red-500" : "text-green-500"}`}
            >
              {risk.status === RiskRegisterStatus.SICRejected
                ? "close"
                : "check"}
            </Icon>
            <span className="mt-5">
              SIC, {risk.activities[1].assignedToStaffName} has
              {risk.status === RiskRegisterStatus.SICRejected
                ? " rejected"
                : " approved "}{" "}
              the request on{" "}
              {dayjs(risk.activities[1].completedDate).format(
                "MMMM DD, YYYY HH:mm"
              )}
            </span>
          </>
        )}
      </div>

      {[RiskRegisterStatus.Evaluation, RiskRegisterStatus.Approved].includes(
        risk.status
      ) &&
        risk.teamList.length > 0 && (
          <>
            <h3 className="px-20 grow shrink text-xl font-semibold text-black w-[1172px] max-md:max-w-full">
              Team
            </h3>

            <div className="grid grid-cols-3 w-full gap-10 px-20">
              {infoItems.map((item, index) => (
                <InfoItem key={index} label={item.label} value={item.value} />
              ))}
            </div>
          </>
        )}
    </section>
  );
};

export default Team;
