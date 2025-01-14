import React from "react";
import { subCategoryList, useSubCategoryStore } from "./ErgonomicRisk";
import { useRatingStore } from "../../ratingStore";

interface RatingTableProps {
  setSeverityRating?: (rating: number | null) => void;
}

const ManualLoadHandlingUnitMass = ({ setSeverityRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const { severityRating, setSeverityRating: setStoreSeverityRating } = useRatingStore();

  const handleRowClick = (rating: number) => {
    setSelectedRating(rating);
    if (setSeverityRating) {
      setSeverityRating(rating);
    }
    setStoreSeverityRating(rating);
  };

  React.useEffect(() => {
    if (severityRating !== null) {
      setSelectedRating(severityRating);
    }
  }, [severityRating]);

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border" rowSpan={2}>
            Severity
          </th>
          <th className="py-10 px-4 border" rowSpan={2}>
            Unit mass (kg)
          </th>
          <th className="py-10 px-4 border" colSpan={9}>
            Total tonnages by unit of time for a distance less than or equal to
            2m
          </th>
        </tr>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">1 min</th>
          <th className="py-10 px-4 border">1 hour</th>
          <th className="py-10 px-4 border">2 hours</th>
          <th className="py-10 px-4 border">3 hours</th>
          <th className="py-10 px-4 border">4 hours</th>
          <th className="py-10 px-4 border">5 hours</th>
          <th className="py-10 px-4 border">6 hours</th>
          <th className="py-10 px-4 border">7 hours</th>
          <th className="py-10 px-4 border">8 hours</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleRowClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 15 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">15</td>
          <td className="py-4 px-4 border">&gt; 25kg</td>
          <td className="py-4 px-4 border">&gt; 140kg</td>
          <td className="py-4 px-4 border">&gt; 4t</td>
          <td className="py-4 px-4 border">&gt; 5.3t</td>
          <td className="py-4 px-4 border">&gt; 6.6t</td>
          <td className="py-4 px-4 border">&gt; 8t</td>
          <td className="py-4 px-4 border">&gt; 9t</td>
          <td className="py-4 px-4 border">&gt; 10t</td>
          <td className="py-4 px-4 border">&gt; 11t</td>
          <td className="py-4 px-4 border">&gt; 12t</td>
        </tr>
        <tr 
          onClick={() => handleRowClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 7 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">7</td>
          <td className="py-4 px-4 border">15-25kg</td>
          <td className="py-4 px-4 border">90-140kg</td>
          <td className="py-4 px-4 border">2.5-4t</td>
          <td className="py-4 px-4 border">3.4-5.3t</td>
          <td className="py-4 px-4 border">4.2-6.6t</td>
          <td className="py-4 px-4 border">5-8t</td>
          <td className="py-4 px-4 border">5.6-9t</td>
          <td className="py-4 px-4 border">6.2-10t</td>
          <td className="py-4 px-4 border">6.8-11t</td>
          <td className="py-4 px-4 border">7.5-12t</td>
        </tr>
        <tr 
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">3</td>
          <td className="py-4 px-4 border">5-15kg</td>
          <td className="py-4 px-4 border">30-90kg</td>
          <td className="py-4 px-4 border">1-2.5t</td>
          <td className="py-4 px-4 border">1.3-3.4t</td>
          <td className="py-4 px-4 border">1.6-4.2t</td>
          <td className="py-4 px-4 border">2-5t</td>
          <td className="py-4 px-4 border">2.2-5.6t</td>
          <td className="py-4 px-4 border">2.5-6.2t</td>
          <td className="py-4 px-4 border">2.8-6.8t</td>
          <td className="py-4 px-4 border">3-7.5t</td>
        </tr>
        <tr 
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">1</td>
          <td className="py-4 px-4 border">&lt; 5kg</td>
          <td className="py-4 px-4 border">&lt; 30kg</td>
          <td className="py-4 px-4 border">&lt; 1t</td>
          <td className="py-4 px-4 border">&lt; 1.3t</td>
          <td className="py-4 px-4 border">&lt; 1.6t</td>
          <td className="py-4 px-4 border">&lt; 2t</td>
          <td className="py-4 px-4 border">&lt; 2.2t</td>
          <td className="py-4 px-4 border">&lt; 2.5t</td>
          <td className="py-4 px-4 border">&lt; 2.8t</td>
          <td className="py-4 px-4 border">&lt; 3t</td>
        </tr>
      </tbody>
    </table>
  );
};

const ManualLoadHandlingPushPull = ({ setSeverityRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const { severityRating, setSeverityRating: setStoreSeverityRating } = useRatingStore();

  const handleRowClick = (rating: number) => {
    setSelectedRating(rating);
    if (setSeverityRating) {
      setSeverityRating(rating);
    }
    setStoreSeverityRating(rating);
  };

  React.useEffect(() => {
    if (severityRating !== null) {
      setSelectedRating(severityRating);
    }
  }, [severityRating]);

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border py-10 px-4">Rating</th>
          <th className="border py-10 px-4">Initial force (daN)</th>
          <th className="border py-10 px-4">Sustained force (daN)</th>
          <th className="border py-10 px-4">Orders of magnitude</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleRowClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 15 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4 text-center font-bold">15</td>
          <td className="border p-4">&gt; 24</td>
          <td className="border p-4">&gt; 15</td>
          <td className="border p-4">
            Pull a hose full of fuel (&gt;35kg) over more than 20 meters
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 7 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4 text-center font-bold">7</td>
          <td className="border p-4">19-24</td>
          <td className="border p-4">9-15</td>
          <td className="border p-4"></td>
        </tr>
        <tr 
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4 text-center font-bold">3</td>
          <td className="border p-4">10-19</td>
          <td className="border p-4">6-9</td>
          <td className="border p-4">
            Pull a hose full of fuel (18kg to 27kg) over 10-15 metres
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4 text-center font-bold">1</td>
          <td className="border p-4">&lt; 10</td>
          <td className="border p-4">&lt; 6</td>
          <td className="border p-4"></td>
        </tr>
      </tbody>
    </table>
  );
};

const PostureStrain = ({ setSeverityRating }: RatingTableProps) => {
  const { setSeverityRating: setStoreSeverityRating } = useRatingStore();
  return (
    <img src={"../assets/images/pages/workposture.png"} alt="Posture Strain" />
  );
};

const RepetitiveMovement = ({ setSeverityRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const { severityRating, setSeverityRating: setStoreSeverityRating } = useRatingStore();

  const handleRowClick = (rating: number) => {
    setSelectedRating(rating);
    if (setSeverityRating) {
      setSeverityRating(rating);
    }
    setStoreSeverityRating(rating);
  };

  React.useEffect(() => {
    if (severityRating !== null) {
      setSelectedRating(severityRating);
    }
  }, [severityRating]);

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Rating</th>
          <th className="py-10 px-4 border">Repetitive movements</th>
          <th className="py-10 px-4 border">
            Examples of repetitive movements
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleRowClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 15 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">15</td>
          <td className="py-4 px-4 border">
            Presence of repetitive movements during the whole job. More than 6
            hours per job.
          </td>
          <td className="py-4 px-4 border"></td>
        </tr>
        <tr 
          onClick={() => handleRowClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 7 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">7</td>
          <td className="py-4 px-4 border">
            Presence of repetitive movements with absence of regular breaks and
            forced rate. 4-6 hours per job.
          </td>
          <td className="py-4 px-4 border">
            Making sandwiches. Working at the cash register in a very busy
            service station. Manually wrapping small packages. Manually filling
            boxes (opening boxes, filling boxes, putting them on a pallet).
            Filling LPG bottle on carrousel. Filling LPG bottle manually.
            Putting on tops (taking and placing the tops manually before
            tightening). Manually putting LPG bottles onto pallets and taking
            them off.
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">3</td>
          <td className="py-4 px-4 border">
            Presence of repetitive movement, but with interruption associated
            with other activity and adapted breaks. 2-4 hours per job.
          </td>
          <td className="py-4 px-4 border">
            Restocking shelves at a service station. Working at the cash
            register in a service station. Preparing packaging (supply and
            preparation of packaging - bottles and boxes), labelling of boxes.
            Small packaging (manual filling of bottles, operation of the pedal,
            placing empty bottles...). Entering date with the keyboard.
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">1</td>
          <td className="py-4 px-4 border">
            Everyday movements without particular strain. Less than 2 hours per
            job.
          </td>
          <td className="py-4 px-4 border">-</td>
        </tr>
      </tbody>
    </table>
  );
};

const Static = ({ setSeverityRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const { severityRating, setSeverityRating: setStoreSeverityRating } = useRatingStore();

  const handleRowClick = (rating: number) => {
    setSelectedRating(rating);
    if (setSeverityRating) {
      setSeverityRating(rating);
    }
    setStoreSeverityRating(rating);
  };

  React.useEffect(() => {
    if (severityRating !== null) {
      setSelectedRating(severityRating);
    }
  }, [severityRating]);

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Rating</th>
          <th className="py-10 px-4 border">Static work</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleRowClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 15 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">15</td>
          <td className="py-4 px-4 border">
            Static work more than 6 hours per day
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 7 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">7</td>
          <td className="py-4 px-4 border">
            Static work 4 to 6 hours per day
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">3</td>
          <td className="py-4 px-4 border">
            Static work 2 to 4 hours per day
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">1</td>
          <td className="py-4 px-4 border">
            Static work less than 2 hours per day
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const WorkAtmosphere = ({ setSeverityRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const { severityRating, setSeverityRating: setStoreSeverityRating } = useRatingStore();

  const handleRowClick = (rating: number) => {
    setSelectedRating(rating);
    if (setSeverityRating) {
      setSeverityRating(rating);
    }
    setStoreSeverityRating(rating);
  };

  React.useEffect(() => {
    if (severityRating !== null) {
      setSelectedRating(severityRating);
    }
  }, [severityRating]);

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Rating</th>
          <th className="py-10 px-4 border">Work atmosphere</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleRowClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 15 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">15</td>
          <td className="py-4 px-4 border">
            Extreme conditions: work in a cold room (-18°C), work in a very hot
            environment (furnace, oven, boiler room), work in a very dusty
            environment
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 7 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">7</td>
          <td className="py-4 px-4 border">
            Work in a cold room (0-4°C), work in a hot environment, work in a
            dusty environment
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">3</td>
          <td className="py-4 px-4 border">
            Work in a cold environment (4-15°C), work in a warm environment
            (25-30°C)
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="py-4 px-4 border text-center font-bold">1</td>
          <td className="py-4 px-4 border">
            Work in an environment with a controlled temperature (15-25°C)
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const getCategoryComponent = (subCategory: string) => {
  switch (subCategory) {
    case subCategoryList.manualloadhandlingunitmass:
      return ManualLoadHandlingUnitMass;
    case subCategoryList.manualloadhandlingpushpull:
      return ManualLoadHandlingPushPull;
    case subCategoryList.posturestrain:
      return PostureStrain;
    case subCategoryList.repetitivemovement:
      return RepetitiveMovement;
    case subCategoryList.static:
      return Static;
    case subCategoryList.workatmosphere:
      return WorkAtmosphere;
    default:
      return ManualLoadHandlingUnitMass;
  }
};

export const SeverityRatingTable = ({ setSeverityRating }: RatingTableProps) => {
  const { subCategory } = useSubCategoryStore();
  const Component = getCategoryComponent(subCategory);
  return <Component setSeverityRating={setSeverityRating} />;
};
