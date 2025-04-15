import React from "react";
import { subCategoryList, useSubCategoryStore } from "./ErgonomicRisk";
import { useRatingStore } from "../../ratingStore";

interface RatingTableProps {
  setSeverityRating?: (rating: number | null) => void;
}

const ManualLoadHandlingUnitMass = ({
  setSeverityRating,
}: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(
    null
  );
  const { severityRating, setSeverityRating: setStoreSeverityRating } =
    useRatingStore();

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
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 15 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border text-orange-500 text-center font-bold">
            15
          </td>
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
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 7 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border text-amber-500 text-center font-bold">
            7
          </td>
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
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border text-yellow-600 text-center font-bold">
            3
          </td>
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
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border text-green-500 text-center font-bold">
            1
          </td>
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

const ManualLoadHandlingPushPull = ({
  setSeverityRating,
}: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(
    null
  );
  const { severityRating, setSeverityRating: setStoreSeverityRating } =
    useRatingStore();

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
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 15 ? "bg-blue-100" : ""}`}
        >
          <td className="border p-4 text-orange-500 text-center font-bold">
            15
          </td>
          <td className="border p-4">&gt; 24</td>
          <td className="border p-4">&gt; 15</td>
          <td className="border p-4">
            Pull a hose full of fuel (&gt;35kg) over more than 20 meters
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 7 ? "bg-blue-100" : ""}`}
        >
          <td className="border p-4 text-amber-500 text-center font-bold">7</td>
          <td className="border p-4">19-24</td>
          <td className="border p-4">9-15</td>
          <td className="border p-4"></td>
        </tr>
        <tr
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="border p-4 text-yellow-600 text-center font-bold">
            3
          </td>
          <td className="border p-4">10-19</td>
          <td className="border p-4">6-9</td>
          <td className="border p-4">
            Pull a hose full of fuel (18kg to 27kg) over 10-15 metres
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="border p-4 text-green-500 text-center font-bold">1</td>
          <td className="border p-4">&lt; 10</td>
          <td className="border p-4">&lt; 6</td>
          <td className="border p-4"></td>
        </tr>
      </tbody>
    </table>
  );
};

const PostureStrain = ({ setSeverityRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(
    null
  );
  const { severityRating, setSeverityRating: setStoreSeverityRating } =
    useRatingStore();

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
          <th className="border py-10 px-4">Posture</th>
          
        </tr>
      </thead>
      <tbody>
        <tr  onClick={() => handleRowClick(15)}>
          <td className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 15 ? "bg-blue-100" : ""} border py-4 px-10 text-orange-500 text-center font-bold`} onClick={() => handleRowClick(15)}>15</td>
          <td rowSpan={4} className="border p-4"> <img src={"../assets/images/pages/workposture.png"} alt="Posture Strain" /></td>
          
        </tr>
        <tr className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 7 ? "bg-blue-100" : ""}`} onClick={() => handleRowClick(7)}>
          <td className="border py-4 px-10 text-amber-500 text-center font-bold" onClick={() => handleRowClick(7)}>7</td>
          {/* <td> <img src={"../assets/images/pages/workposture.png"} alt="Posture Strain" /></td> */}
          
        </tr>
        
        <tr className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 3 ? "bg-blue-100" : ""}`} onClick={() => handleRowClick(3)}>
          <td className="border py-4 px-10 text-yellow-500 text-center font-bold" onClick={() => handleRowClick(3)}>3</td>
          {/* <td> <img src={"../assets/images/pages/workposture.png"} alt="Posture Strain" /></td> */}
          
        </tr>
        
        <tr className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 1 ? "bg-blue-100" : ""}`} onClick={() => handleRowClick(1)}>
          <td className="border py-4 px-10 text-green-500 text-center font-bold" onClick={() => handleRowClick(1)}>1</td>
          {/* <td> <img src={"../assets/images/pages/workposture.png"} alt="Posture Strain" /></td> */}
          
        </tr>
      </tbody>
    </table>
   

  );
};

const RepetitiveMovement = ({ setSeverityRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(
    null
  );
  const { severityRating, setSeverityRating: setStoreSeverityRating } =
    useRatingStore();

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
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 15 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border text-orange-500 text-center font-bold">
            15
          </td>
          <td className="py-4 px-4 border">
            Presence of repetitive movements during the whole job. <br />
            More than 6 hours per job.
          </td>
          <td className="py-4 px-4 border"></td>
        </tr>
        <tr
          onClick={() => handleRowClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 7 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border text-amber-500 text-center font-bold">
            7
          </td>
          <td className="py-4 px-4 border">
            Presence of repetitive movements with absence of regular breaks and
            forced rate.
            <br /> 4-6 hours per job.
          </td>
          <td className="py-4 px-4 border">
            Making sandwiches. <br />
            Working at the cash register in a very busy service station.
            <br /> Manually wrapping small packages. <br />
            Manually filling boxes (opening boxes, filling boxes, putting them
            on a pallet).
            <br />
            Filling LPG bottle on carrousel. <br />
            Filling LPG bottle manually.
            <br />
            Putting on tops (taking and placing the tops manually before
            tightening). <br />
            Manually putting LPG bottles onto pallets and taking them off.
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border text-yellow-500 text-center font-bold">
            3
          </td>
          <td className="py-4 px-4 border">
            Presence of repetitive movement, but with interruption associated
            with other activity and adapted breaks. <br />
            2-4 hours per job.
          </td>
          <td className="py-4 px-4 border">
            Restocking shelves at a service station.
            <br /> Working at the cash register in a service station. <br />
            Preparing packaging (supply and preparation of packaging - bottles
            and boxes), labelling of boxes.
            <br />
            Small packaging (manual filling of bottles, operation of the pedal,
            placing empty bottles...).
            <br /> Entering date with the keyboard.
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border  text-green-500 text-center font-bold">
            1
          </td>
          <td className="py-4 px-4 border">
            Everyday movements without particular strain. <br />
            Less than 2 hours per job.
          </td>
          <td className="py-4 px-4 border">-</td>
        </tr>
      </tbody>
    </table>
  );
};

const Static = ({ setSeverityRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(
    null
  );
  const { severityRating, setSeverityRating: setStoreSeverityRating } =
    useRatingStore();

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
          <th className="py-10 px-4 border">Work at screen</th>
          <th className="py-10 px-4 border">Work position(body, arms, head)</th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleRowClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 7 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border text-amber-500 text-center font-bold">
            7
          </td>
          <td className="py-4 px-4 border">-</td>
          <td className="py-4 px-4 border">
            Strained body, arm or head position: working on more than one
            screen, screen too high, etc.
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border text-yellow-500 text-center font-bold">
            3
          </td>
          <td className="py-4 px-4 border">
            More than 2 h per day continuously
            <br />
            More than 4 hours per day in total
          </td>
          <td className="py-4 px-4 border">
            Feeling of discomfort regarding the activity: adjustment of worktop,
            seat, working on two screens, etc.
            <br />
            Standing work more than 2 h per day continuously
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border text-green-500 text-center font-bold">
            1
          </td>
          <td className="py-4 px-4 border">
            Less than 2 hours per day continuously
            <br />
            Less than 4 hours per day in total
          </td>
          <td className="py-4 px-4 border">
            Standing work less than 2 h per day continuously
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const WorkAtmosphere = ({ setSeverityRating }: RatingTableProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(
    null
  );
  const { severityRating, setSeverityRating: setStoreSeverityRating } =
    useRatingStore();

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
          <th className="py-10 px-4 border">Temperature</th>
          <th className="py-10 px-4 border">Humidity(RH)</th>
          <th className="py-10 px-4 border">Noise</th>
          <th className="py-10 px-4 border">Lighting</th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border text-center text-yellow-500 font-bold">
            3
          </td>
          <td className="py-4 px-4 border">
            - Temperature:less than 20°C or greater than 26°C <br />
            - Work by a window with exposure to sunrays, etc.
            <br />
            - Draughts, etc.
            <br />
          </td>
          <td className="py-4 px-4 border">
            RH less than 30% RH greater than 70%
          </td>
          <td className="py-4 px-4 border">
            Discomfort related to background noise level
          </td>
          <td className="py-4 px-4 border">
            - Inappropriate lighting:less than 500 lux in office, laboratory,
            control room, etc. <br />- Dazzle
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${selectedRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="py-4 px-4 border text-center text-green-500 font-bold">
            1
          </td>
          <td className="py-4 px-4 border">
            Thermal comfort: 20-24°C in winter 22-26°C in summer
          </td>
          <td className="py-4 px-4 border">
            RH between 30% and 70% or little discomfort
          </td>
          <td className="py-4 px-4 border">-</td>
          <td className="py-4 px-4 border">-</td>
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

export const SeverityRatingTable = ({
  setSeverityRating,
}: RatingTableProps) => {
  const { subCategory } = useSubCategoryStore();
  const Component = getCategoryComponent(subCategory);
  return <Component setSeverityRating={setSeverityRating} />;
};
