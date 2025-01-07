import { Man } from "@mui/icons-material";
import { subCategoryList, useSubCategoryStore } from "./ErgonomicRisk";
import { TestTable } from "./TestTable"; // Update the path to the correct location of TestTable

const ManualLoadHandlingUnitMass = () => {
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
        <tr>
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
        <tr>
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
        <tr>
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
        <tr>
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

const ManualLoadHandlingPushPull = () => {
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
        <tr>
          <td className="border p-4 text-center font-bold">15</td>
          <td className="border p-4">&gt; 24</td>
          <td className="border p-4">&gt; 15</td>
          <td className="border p-4">
            Pull a hose full of fuel (&gt;35kg) over more than 20 meters
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold">7</td>
          <td className="border p-4">19-24</td>
          <td className="border p-4">9-15</td>
          <td className="border p-4"></td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold">3</td>
          <td className="border p-4">10-19</td>
          <td className="border p-4">6-9</td>
          <td className="border p-4">
            Pull a hose full of fuel (18kg to 27kg) over 10-15 metres
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold">1</td>
          <td className="border p-4">&lt; 10</td>
          <td className="border p-4">&lt; 6</td>
          <td className="border p-4"></td>
        </tr>
      </tbody>
    </table>
  );
};

const PostureStrain = () => {
  return (
    <img src={"../assets/images/pages/workposture.png"} alt="Posture Strain" />
  );
};

const RepetitiveMovement = () => {
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
        <tr>
          <td className="py-4 px-4 border text-center font-bold">15</td>
          <td className="py-4 px-4 border">
            Presence of repetitive movements during the whole job. More than 6
            hours per job.
          </td>
          <td className="py-4 px-4 border"></td>
        </tr>
        <tr>
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
        <tr>
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
        <tr>
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
const Static = () => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4 py-10">Rating</th>
          <th className="border p-4 py-10">Work at screen</th>
          <th className="border p-4 py-10">Work position (body, arms, head)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-4 text-center font-bold">7</td>
          <td className="border p-4 text-center">-</td>
          <td className="border p-4">
            <u>Strained body, arm or head position</u>: working on more than one
            screen, screen too high, etc.
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold">3</td>
          <td className="border p-4">
            More than 2 h per day continuously More than 4 hours per day in
            total
          </td>
          <td className="border p-4">
            <u>Feeling of discomfort regarding the activity</u>: adjustment of
            worktop, seat, working on two screens, etc.
            <br />
            Standing work more than 2 h per day continuously
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold">1</td>
          <td className="border p-4 text-center">
            Less than 2 hours per day continuously
            <br />
            Less than 4 hours per day in total
          </td>
          <td className="border p-4">
            Standing work less than 2 h per day continuously
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const WorkAtmosphere = () => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4 py-[10px]">Rating</th>
          <th className="border p-4 py-[10px]">Temperature (NFX 35-102)</th>
          <th className="border p-4 py-[10px]">Relative humidity (RH)</th>
          <th className="border p-4 py-[10px]">Noise (*)</th>
          <th className="border p-4 py-[10px]">Lighting (*) (EN 12464-1)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-4 text-center font-bold">3</td>
          <td className="border p-4">
            <u>Temperature:</u> &lt; 20°C or &gt; 26°C, work by a window with
            exposure to sunrays, etc. <u>Draughts</u>, etc.
          </td>
          <td className="border p-4">RH &lt; 30%, RH &gt; 70%</td>
          <td className="border p-4 text-center">
            Discomfort related to background noise level
          </td>
          <td className="border p-4 text-center">
            <u>Inappropriate lighting:</u> &lt; 500 lux in office, laboratory,
            control room, etc. <u>Dazzle</u>
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold">1</td>
          <td className="border p-4">
            <u>Thermal comfort:</u> 20-24°C in winter, 22-26°C in summer
          </td>
          <td className="border p-4 text-center">
            30% &lt; RH &lt; 70% or little discomfort
          </td>
          <td className="border p-4 text-center">-</td>
          <td className="border p-4 text-center">-</td>
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

export const SeverityRatingTable = () => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(
    subCategory || subCategoryList.manualloadhandlingpushpull
  );
  // return <TestTable />;
  return <div>{CategoryComponent && <CategoryComponent />}</div>;
};
