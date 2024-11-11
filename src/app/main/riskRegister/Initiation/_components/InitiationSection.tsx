import React from "react";
import InfoItem from "./InfoItem";
import { IHiraList, IRiskRegisterDetails } from "../../helpers/type";
import { RiskCategory } from "../../helpers/enum";
import dayjs from "dayjs";

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

const InitiationSection = ({ risk }: { risk: IRiskRegisterDetails }) => {
  const infoItems = [
    {
      label: "Req No.",
      value: risk.siteName.substring(0, 3).toUpperCase() + risk.hiranumber,
    },
    { label: "Division", value: risk.divisionName },
    { label: "Site", value: risk.siteName },
    {
      label: "Category",
      value:
        RiskCategory[risk.category] &&
        RiskCategory[risk.category].replace(/_/g, " "),
    },
    { label: "Inititator", value: risk.activities[0].assignedToStaffName },
    { label: "Date", value: dayjs(risk.date).format("MMMM DD, YYYY") },
  ];

  return (
    <section className="flex overflow-hidden flex-wrap gap-8 items-start px-6 py-12 text-sm bg-white rounded-lg max-md:px-5">
      <h2 className="grow shrink text-2xl font-semibold text-black w-[1172px] max-md:max-w-full">
        HIRA Request Form
      </h2>
      <div className=" grid grid-cols-3 w-full gap-10">
        {infoItems.map((item, index) => (
          <InfoItem key={index} label={item.label} value={item.value} />
        ))}
      </div>
      <div className="flex">
        <InfoItem label="Title" value={risk.projectName} />
      </div>
      <div className="flex">
        <InfoItem label="Description" value={risk.projectDescription} />
      </div>
    </section>
  );
};

export default InitiationSection;
