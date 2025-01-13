import { subCategoryList, useSubCategoryStore } from "./ErgonomicRisk";
import React from 'react';

interface RatingTableProps {
  setPotentialRating: (rating: number | null) => void;
}

const ManualLoadHandlingPushPull = ({ setPotentialRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    setPotentialRating(rating);
  };

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Rating P</th>
          <th className="py-10 px-4 border">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">10</td>
          <td className="py-4 px-4 border">
            The potential exposure probability P of exposure to ergonomic factors
            during handling is 10.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const ManualLoadHandlingUnitMass = ({ setPotentialRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    setPotentialRating(rating);
  };

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Rating P</th>
          <th className="py-10 px-4 border">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">10</td>
          <td className="py-4 px-4 border">
            The potential exposure probability P of exposure to ergonomic factors
            during pulling or pushing is 10.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const PostureStrain = ({ setPotentialRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    setPotentialRating(rating);
  };

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Rating P</th>
          <th className="py-10 px-4 border">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">10</td>
          <td className="py-4 px-4 border">
            The potential exposure probability P of exposure to ergonomic factors
            during a dynamic task is 10.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const RepetitiveMovement = ({ setPotentialRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    setPotentialRating(rating);
  };

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Rating P</th>
          <th className="py-10 px-4 border">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">10</td>
          <td className="py-4 px-4 border">
            The potential exposure probability P of exposure to ergonomic factors
            during a repetitive task is 10.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Static = ({ setPotentialRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    setPotentialRating(rating);
  };

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Rating P</th>
          <th className="py-10 px-4 border">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">10</td>
          <td className="py-4 px-4 border">
            The potential exposure probability P of exposure to ergonomic factors
            during a static task is 10.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const WorkAtmosphere = ({ setPotentialRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);

  const handleClick = (rating: number) => {
    setSelectedRating(rating);
    setPotentialRating(rating);
  };

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Rating P</th>
          <th className="py-10 px-4 border">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">10</td>
          <td className="py-4 px-4 border">
            The potential exposure probability P of exposure to ergonomic factors when
            working in these conditions is 10.
          </td>
        </tr>
      </tbody>
    </table>
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

export const PotentialRatingTable = ({ setPotentialRating }: RatingTableProps) => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(subCategory);

  return CategoryComponent ? <CategoryComponent setPotentialRating={setPotentialRating} /> : null;
};
