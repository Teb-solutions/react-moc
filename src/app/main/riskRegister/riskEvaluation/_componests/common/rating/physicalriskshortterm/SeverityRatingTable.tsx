import { subCategoryList, useSubCategoryStore } from "./PhysicalRiskShortTerm";

interface Props {
  severityRating: number | null;
  setSeverityRating: (rating: number | null) => void;
}

const Mechanical = ({ severityRating, setSeverityRating }: Props) => {
  const handleClick = (rating: number) => {
    setSeverityRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Rating G</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">10</td>
          <td className="border p-4">
            Death
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(6)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 6 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">6</td>
          <td className="border p-4">
            Serious injury (fracture, amputation, etc.)
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">3</td>
          <td className="border p-4">
            Minor injury (cut, bruise, etc.)
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">1</td>
          <td className="border p-4">
            No injury
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Traffic = ({ severityRating, setSeverityRating }: Props) => {
  const handleClick = (rating: number) => {
    setSeverityRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Rating G</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">10</td>
          <td className="border p-4">
            Fatal collision
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(6)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 6 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">6</td>
          <td className="border p-4">
            Serious collision with injury
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">3</td>
          <td className="border p-4">
            Minor collision
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">1</td>
          <td className="border p-4">
            Near miss
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Height = ({ severityRating, setSeverityRating }: Props) => {
  const handleClick = (rating: number) => {
    setSeverityRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Rating G</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">10</td>
          <td className="border p-4">
            Fatal fall
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(6)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 6 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">6</td>
          <td className="border p-4">
            Fall with serious injury
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">3</td>
          <td className="border p-4">
            Fall with minor injury
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">1</td>
          <td className="border p-4">
            Near miss
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const HeatCold = ({ severityRating, setSeverityRating }: Props) => {
  const handleClick = (rating: number) => {
    setSeverityRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Rating G</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">10</td>
          <td className="border p-4">
            Fatal exposure
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(6)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 6 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">6</td>
          <td className="border p-4">
            Severe burns or frostbite
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">3</td>
          <td className="border p-4">
            Minor burns or cold exposure
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">1</td>
          <td className="border p-4">
            Discomfort
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Electricity = ({ severityRating, setSeverityRating }: Props) => {
  const handleClick = (rating: number) => {
    setSeverityRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Rating G</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">10</td>
          <td className="border p-4">
            Fatal electrocution
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(6)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 6 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">6</td>
          <td className="border p-4">
            Severe electrical shock
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">3</td>
          <td className="border p-4">
            Minor electrical shock
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">1</td>
          <td className="border p-4">
            Static shock
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Pressure = ({ severityRating, setSeverityRating }: Props) => {
  const handleClick = (rating: number) => {
    setSeverityRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Rating G</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">10</td>
          <td className="border p-4">
            Fatal pressure injury
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(6)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 6 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">6</td>
          <td className="border p-4">
            Severe pressure injury
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">3</td>
          <td className="border p-4">
            Minor pressure injury
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">1</td>
          <td className="border p-4">
            Discomfort
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Atmosphere = ({ severityRating, setSeverityRating }: Props) => {
  const handleClick = (rating: number) => {
    setSeverityRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Rating G</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">10</td>
          <td className="border p-4">
            Fatal atmospheric exposure
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(6)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 6 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">6</td>
          <td className="border p-4">
            Severe respiratory distress
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">3</td>
          <td className="border p-4">
            Minor respiratory issues
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">1</td>
          <td className="border p-4">
            Discomfort
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const getCategoryComponent = (category: string) => {
  switch (category) {
    case subCategoryList.mechanical:
      return Mechanical;
    case subCategoryList.traffic:
      return Traffic;
    case subCategoryList.height:
      return Height;
    case subCategoryList.heatcold:
      return HeatCold;
    case subCategoryList.electricity:
      return Electricity;
    case subCategoryList.pressure:
      return Pressure;
    case subCategoryList.atmosphere:
      return Atmosphere;
    default:
      return null;
  }
};

export const SeverityRatingTable = ({ severityRating, setSeverityRating }: Props) => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(subCategory || subCategoryList.mechanical);

  if (!CategoryComponent) return null;
  
  return <CategoryComponent severityRating={severityRating} setSeverityRating={setSeverityRating} />;
};
