import { Man } from "@mui/icons-material";
import { subCategoryList, useSubCategoryStore } from "./ErgonomicRisk";
import { TestTable } from "./TestTable"; // Update the path to the correct location of TestTable

const ManualLoadHandlingPushPull = () => {
  return (
    <p className="font-semibold">
      The potential exposure probability P of exposure to ergonomic factors
      during handling is 10.
    </p>
  );
};

const ManualLoadHandlingUnitMass = () => {
  return (
    <p className="font-semibold">
      The potential exposure probability P of exposure to ergonomic factors
      during pulling or pushing is 10.
    </p>
  );
};

const PostureStrain = () => {
  return (
    <p className="font-semibold">
      The potential exposure probability P of exposure to ergonomic factors
      during a dynamic task is 10.
    </p>
  );
};

const RepetitiveMovement = () => {
  return (
    <p className="font-semibold">
      The potential exposure probability P of exposure to ergonomic factors
      during a repetitive task is 10.
    </p>
  );
};

const Static = () => {
  return (
    <p className="font-semibold">
      The potential exposure probability P of exposure to ergonomic factors
      during a static task is 10.
    </p>
  );
};

const WorkAtmosphere = () => {
  return (
    <p className="font-semibold">
      The potential exposure probability P of exposure to ergonomic factors when
      working in these conditions is 10.
    </p>
  );
};
const getCategoryComponent = (subCategory: string) => {
  switch (subCategory) {
    case subCategoryList.manualloadhandlingpushpull:
      return ManualLoadHandlingPushPull;
    case subCategoryList.manualloadhandlingunitmass:
      return ManualLoadHandlingUnitMass;
    case subCategoryList.posturestrain:
      return PostureStrain;
    case subCategoryList.repetitivemovement:
      return RepetitiveMovement;
    case subCategoryList.static:
      return Static;
    case subCategoryList.workatmosphere:
      return WorkAtmosphere;

    default:
      return null;
  }
};

export const PotentialRatingTable = () => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(
    subCategory || subCategoryList.manualloadhandlingpushpull
  );
  // return <TestTable />;
  return <div>{CategoryComponent && <CategoryComponent />}</div>;
};
