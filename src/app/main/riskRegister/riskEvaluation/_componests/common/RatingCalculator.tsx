import BiologicalRisk from "./rating/BiologicalRisk";
import ChemicalRisk from "./rating/chemicalrisk/ChemicalRisk";
import ErgonomicRisk from "./rating/ergonomicrisk/ErgonomicRisk";
import OccupationalRisk from "./rating/OccupationalRisk";
import PhyscoSocialRisk from "./rating/PhyscoSocialRisk";
import PhysicalRiskNew from "./rating/physicalrisk/PhysicalRiskNew";
import PhysicalRiskShortTerm from "./rating/physicalriskshortterm/PhysicalRiskShortTerm";
 // add occupational risk later after checking with jayadev, its not implemented in moc
const RatingCalculator = ({
  hazardTypeWatch,
  hazardTypes,
}: {
  hazardTypeWatch: number;
  hazardTypes: { value: number; text: string }[];
}) => {
  return (
    <>
      {hazardTypeWatch == 1 && (
        <ChemicalRisk
          hazardType={
            hazardTypes.find((hazard) => hazard.value == hazardTypeWatch)
              ?.text || ""
          }
        />
      )}
      {hazardTypeWatch == 2 && (
        <BiologicalRisk
          hazardType={
            hazardTypes.find((hazard) => hazard.value == hazardTypeWatch)
              ?.text || ""
          }
        />
      )}
      {hazardTypeWatch == 3 && (
        <ErgonomicRisk
          hazardType={
            hazardTypes.find((hazard) => hazard.value == hazardTypeWatch)
              ?.text || ""
          }
        />
      )}
      {hazardTypeWatch == 4 && (
        <PhysicalRiskNew
          hazardType={
            hazardTypes.find((hazard) => hazard.value == hazardTypeWatch)
              ?.text || ""
          }
        />
      )}
      {hazardTypeWatch == 5 && (
        <PhysicalRiskShortTerm
          hazardType={
            hazardTypes.find((hazard) => hazard.value == hazardTypeWatch)
              ?.text || ""
          }
        />
      )}
      {hazardTypeWatch == 6 && (
        <PhyscoSocialRisk
          hazardType={
            hazardTypes.find((hazard) => hazard.value == hazardTypeWatch)
              ?.text || ""
          }
        />
      )}
    </>
  );
};

export default RatingCalculator;
