import { Icon } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const controlMeasures = [
  {
    label: "Manual",
    value: [
      "Engineering controls are the first line of defense in protecting workers from hazards. ",
      "Engineering controls are the first line of defense in protecting workers from hazards. ",
    ],
  },
  {
    label: "Technical",
    value: [
      "Engineering controls are the first line of defense in protecting workers from hazards. ",
      "Engineering controls are the first line of defense in protecting workers from hazards. ",
    ],
  },
  {
    label: "Orgnaizational",
    value: [
      "Personal protective equipment (PPE) is t",
      "Engineering controls are the first line of defense in protecting workers from hazards. ",
    ],
  },
];
const ControlMeasures = () => {
  return (
    <section className="flex flex-col mt-8 w-full">
      <h3 className="text-base font-semibold text-zinc-800">
        {"Control Measure"}
      </h3>
      <div className="flex flex-col mt-6 w-full text-sm">
        {controlMeasures.map((item, index) => (
          <ControlMeasureItem
            key={index}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </section>
  );
};

function ControlMeasureItem({
  label,
  value,
}: {
  label: string;
  value: string[];
}) {
  return (
    <div className="flex flex-col gap-5 mt-10 justify-between items-start w-full">
      <div className="text-neutral-400 font-semibold flex flex-row justify-between w-full">
        {label}
        <Icon className="text-lg ml-5 text-blue-600 rounded-sm border-1 border-blue-600 cursor-pointer">
          edit
        </Icon>
      </div>
      <div className="text-neutral-600 text-sm  px-20">
        <ul>
          {value.map((item, index) => (
            <li key={index}>
              {index + 1}. {item}
            </li>
          ))}
        </ul>
      </div>
      {/* <div className="font-medium mb-10 text-neutral-600">
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          className="w-50"
          size="small"
          style={{ width: "400px", wordBreak: "break-word" }}
          value={value}
          label="Age"
          //   onChange={handleChange}
        >
          {value.map((value) => (
            <MenuItem value={value}>{value}</MenuItem>
          ))}
        </Select>
      </div> */}
    </div>
  );
}

export default ControlMeasures;
