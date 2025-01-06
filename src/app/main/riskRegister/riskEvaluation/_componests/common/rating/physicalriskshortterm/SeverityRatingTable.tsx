import { subCategoryList, useSubCategoryStore } from "./PhysicalRiskShortTerm";
import { TestTable } from "./TestTable";

const Mechanical = () => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Rating</th>
          <th className="py-10 px-4 border">
            Tools/machines or other mechanical hazards
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">15</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>
                Rotating machines, unprotected moving parts that can have an
                impact on the whole body or a large part of the body:
              </u>
            </strong>
            <p>
              - Pipe cutters, calenders, mixers, presses, roll benders,
              conveyers, movement of high kinetic loads (wagons), etc.
            </p>
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">7</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>Small turning machines, unprotected moving parts:</u>
            </strong>
            <p>
              - Clippers, drills, grinders, lathes, winches, hydraulic presses,
              etc.
            </p>
            <strong>
              <u>Other energy sources:</u>
            </strong>
            <p>
              - Air-driven ventilator blades, compressed springs, jacks, etc.
            </p>
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">3</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>Manually operated tools or objects:</u>
            </strong>
            <p>
              - Cutters, knives, scissors, staplers, hammers, small tools, saws,
              mincers, skips, bins, strapping, etc.
            </p>
            <strong>
              <u>Energy of the body striking fixed objects:</u>
            </strong>
            <p>
              - Corners of unprotected equipment, open drawers, low shelves,
              clutter, etc.
            </p>
            <p>
              - Objects that hit, cut, pinch, jam, etc., such as windowpanes and
              springs.
            </p>
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">1</td>
          <td className="py-4 px-4 border">-</td>
        </tr>
      </tbody>
    </table>
  );
};

const Traffic = () => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-blue-400 text-white ">
          <th className="py-10 px-4 border border-gray-300" rowSpan={2}>
            Rating
          </th>
          <th className="py-10 px-4 border border-gray-300" colSpan={2}>
            Movement of pedestrians or vehicles
          </th>
        </tr>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border border-gray-300">On foot</th>
          <th className="py-10 px-4 border border-gray-300">
            Traffic on site and off site
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-300 text-center font-bold p-4">
            15
          </td>
          <td className="border border-gray-300 p-4">- N/A</td>
          <td className="border border-gray-300 p-4">
            - Intersection of pedestrian/cycle and motorized vehicle flows in
            noisy environment
            <br />
            - Intersection of flows of vehicles in the case of heavy traffic and
            high speeds
            <br />
            - Intersection of truck flows in buildings
            <br />
            - Use of forklift truck on an irregular surface at excessive speed
            <br />- Use of quad bike, motorbike, cycle on an irregular surface
            at excessive speed
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 text-center font-bold p-4">
            7
          </td>
          <td className="border border-gray-300 p-4">- N/A</td>
          <td className="border border-gray-300 p-4">
            - Intersection of vehicle flow and unexpected obstacle/stationary
            vehicle, etc. or between vehicle flows with low visibility.
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 text-center font-bold p-4">
            3
          </td>
          <td className="border border-gray-300 p-4">
            - Movement on one level.
          </td>
          <td className="border border-gray-300 p-4">
            - Cycle on gravel/irregular surface, etc.
            <br />- Ordinary conditions
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 text-center font-bold p-4">
            1
          </td>
          <td className="border border-gray-300 p-4">- N/A</td>
          <td className="border border-gray-300 p-4">
            - Reduced vehicle flow on separated, well-lit and well-maintained
            roads, etc.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Height = () => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border border-gray-300" rowSpan={2}>
            Rating G
          </th>
          <th className="py-10 px-4 border border-gray-300" colSpan={2}>
            Height
          </th>
        </tr>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border border-gray-300">
            Work at height (distance from foot to floor)
          </th>
          <th className="py-10 px-4 border border-gray-300">
            Object at height (with helmet) (to be adapted based on the size and
            shape of the object)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-4 px-4 border border-gray-300 text-center font-bold">
            40
          </td>
          <td className="py-4 px-4 border border-gray-300">
            <u>
              Work by several people at more than 3 metres from the ground or a
              body of water
            </u>
          </td>
          <td className="py-4 px-4 border border-gray-300">
            Simultaneous work:
            <ul>
              <li>
                - Scaffolding in a busy zone (during a major shutdown), etc.
              </li>
              <li>- Cradle above a busy zone, etc.</li>
              <li>- Loaded duckboard above an activity zone</li>
              <li>
                - Wall of an excavation/pit/gallery (crush syndrome), etc.
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border border-gray-300 text-center font-bold">
            15
          </td>
          <td className="py-4 px-4 border border-gray-300">
            <u>Working at a height of more than 3 metres above the ground</u>
            <br />
            Work above a body of water
          </td>
          <td className="py-4 px-4 border border-gray-300">
            Objects from:
            <ul>
              <li>- 2m cabinet: &gt;7kg</li>
              <li>- 5m shelving: &gt;2.5kg</li>
              <li>- high shelving (7.2m): &gt;2kg</li>
              <li>- 12m scaffolding: &gt;1kg</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border border-gray-300 text-center font-bold">
            7
          </td>
          <td className="py-4 px-4 border border-gray-300">
            <u>Working at a height of 1.5 to 3 metres above the ground</u>
          </td>
          <td className="py-4 px-4 border border-gray-300" rowSpan={2}>
            <u>For objects of intermediate mass, use:</u> Electronic calculator:
            <a href="http://www.dropsonline.org/resources-and-guidance/drops-calculator/e-drops-calculator/">
              http://www.dropsonline.org/resources-and-guidance/drops-calculator/e-drops-calculator/
            </a>
            <br />
            or
            <br />
            <u>DROPS METRIC table:</u> see below.
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border border-gray-300 text-center font-bold">
            3
          </td>
          <td className="py-4 px-4 border border-gray-300">
            <u>Work performed at between 0.5 and 1.5 meters above the ground</u>
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border border-gray-300 text-center font-bold">
            1
          </td>
          <td className="py-4 px-4 border border-gray-300">
            <u>Work performed at less than 0.5 meters above the ground</u>
          </td>
          <td className="py-4 px-4 border border-gray-300">
            <u>Objects located at a distance of:</u>
            <ul>
              <li>- 2m: &lt; 3kg</li>
              <li>- 5m: &lt; 1kg</li>
              <li>- 7.2m: &lt; 0.6kg</li>
              <li>- 12m: &lt; 0.4kg</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Optical = () => {
  return (
    <table className="border border-collapse w-full">
      <thead className="bg-blue-400 text-white py-10">
        <tr>
          <th className="border p-2" rowSpan={2}>
            Rating G
          </th>
          <th className="border p-2" colSpan={4}>
            <div className="text-center">
              <strong>Optical radiation: UV-visible-IR-laser</strong>
              <br />
              <strong>(EU directive 2006/25/EC and EN 12198-1)</strong>
              <br />
              <em>
                Correlation between irradiance or radiance, and the radiation
                emission category
              </em>
            </div>
          </th>
        </tr>
        <tr>
          <td className="border p-2 text-center">
            Visible and infrared E (700nm – 1mm)
          </td>
          <td className="border p-2 text-center">
            Visible Eeff (400nm – 700nm) Leff (400nm – 700nm)
          </td>
          <td className="border p-2 text-center">
            Ultraviolet and visible Eeff (180 – 400nm)
          </td>
          <td className="border p-2 text-center">LASERS</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2 text-center">15</td>
          <td className="border p-2 text-center">-</td>
          <td className="border p-2 text-center">-</td>
          <td className="border p-2">UV index 8 and higher</td>
          <td className="border p-2">Laser source class* 4</td>
        </tr>
        <tr>
          <td className="border p-2 text-center" rowSpan={2}>
            7
          </td>
          <td className="border p-2" rowSpan={2}>
            &gt; 100 W.m-2
          </td>
          <td className="border p-2" rowSpan={2}>
            Eeff &gt; 10.10-3 W.m-2 Leff &gt; 100 W.m-2.sr-1
          </td>
          <td className="border p-2">Eeff &gt; 1,0.10-3 W.m-2</td>
          <td className="border p-2 text-center" rowSpan={2}>
            Laser source class* 3B (5-500 mW)
          </td>
        </tr>
        <tr>
          <td className="border p-2 text-center">UV ~ 6-7</td>
        </tr>
        <tr>
          <td className="border p-2 text-center" rowSpan={2}>
            3
          </td>
          <td className="border p-2" rowSpan={2}>
            &lt;100 W.m-2
          </td>
          <td className="border p-2" rowSpan={2}>
            Eeff &lt; 10.10-3 W.m-2 Leff &lt; 100 W.m-2.sr-1
          </td>
          <td className="border p-2">Eeff &lt; 1,0.10-3 W.m-2</td>
          <td className="border p-2 text-center" rowSpan={2}>
            Laser source class* 3R (1-5 mW)
          </td>
        </tr>
        <tr>
          <td className="border p-2 text-center">
            UV 200-300 J/m² (2-3 SED) UV index 3-5
          </td>
        </tr>
        <tr>
          <td className="border p-2 text-center" rowSpan={2}>
            1
          </td>
          <td className="border p-2" rowSpan={2}>
            &lt; 33 W.m-2
          </td>
          <td className="border p-2" rowSpan={2}>
            Eeff &lt; 1,0.10-3 W.m-2 Leff &lt; 10 W.m-2.sr-1
          </td>
          <td className="border p-2">Eeff &lt; 0.1.10-3 W.m-2</td>
          <td className="border p-2 text-center" rowSpan={2}>
            Laser source class* 1, 1M, 2, 2M (&lt; 1 mW)
          </td>
        </tr>
        <tr>
          <td className="border p-2 text-center">
            UVABC &gt; 30 J/m² (0.3 SED) (skin) UVA &gt; 10 000 J/m² (100 SED)
            (eyes)
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const HeatCold = () => {
  return (
    <table border={0} cellSpacing={0} cellPadding={0}>
      <thead className="bg-blue-400 text-white">
        <tr>
          <th className="py-10 px-4 border">Rating</th>
          <th className="py-10 px-4 border">Heat source</th>
          <th className="py-10 px-4 border">Cold source</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">15</td>
          <td className="py-4 px-4 border" colSpan={2}>
            <u className="font-semibold">
              Third degree burn (damage to the dermis and the epidermis) over
              more than 10% of the body
            </u>
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border"></td>
          <td className="py-4 px-4 border">
            - Unintentional contact with a hot part: T° &gt; 70°C (bare metal),
            &gt; 80°C (ceramics/glass), &gt; 95°C (plastic).
            <br />
            - Contact with a hot product
            <br />
            E.g. boiling oil, steam, flashback, bitumen, drain protection,
            vacuum/atmospheric residues, distillation furnace, etc.
          </td>
          <td className="py-4 px-4 border">
            <strong>H281</strong> Contains refrigerated gas; can cause cryogenic
            burns or injuries.
            <br />
            - Involuntary contact with gases compressed at very low boiling
            temperatures (liquid nitrogen, liquid oxygen, liquid ethylene,
            etc.).
            <br />- Prolonged contact with propylene and propane.
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">7</td>
          <td className="py-4 px-4 border" colSpan={2}>
            <u className="font-semibold">
              Third degree burn over less than 10% of the body or deep second
              degree burn (deep damage to the dermis).
            </u>
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border"></td>
          <td className="py-4 px-4 border">
            - Unintentional contact with a hot part: &gt; 70°C (bare metal) or
            &gt; 80°C (ceramics/ glass) or &gt; 95°C (plastic) if less than 10%
            of the body makes contact.
            <br />
            65-70°C* (bare metal) if more than 10% of the body makes contact.
            <br />
            - Handling an object at a temperature of: 50-52°C* (bare metal).
            <br />
            - Contact with a hot product.
            <br />
            E.g. plates/shelves from the oven, high temperature equipment,
            plancha grill, double-boiler/dish warmer, arc welding, blowtorching,
            bitumen, autoclaves, etc.
          </td>
          <td className="py-4 px-4 border">
            - <strong>H281</strong> Contains refrigerated gas; can cause
            cryogenic burns or injuries.
            <br />- Unintentional contact with gases compressed at low boiling
            temperatures (propylene, propane, butane, etc.).
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">3</td>
          <td className="py-4 px-4 border" colSpan={2}>
            <u className="font-semibold">Second degree burn (blisters)</u>
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border"></td>
          <td className="py-4 px-4 border">
            - Unintentional contact with a hot part: 60-65°C* (bare metal).
            <br />
            - Handling an object at a temperature of: 44-50°C* (bare metal).
            <br />
            E.g. hot meals service, water-heater water, outside of a kitchen
            oven door, radiator, etc.
          </td>
          <td className="py-4 px-4 border">
            - Unintentional contact with a metallic part at: &lt; -20°C
            <br />
            - Handling a metallic object at a temperature of: &lt; -7°C
            <br />
            E.g. frozen products, chain wheels in periods of frost, etc.
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">1</td>
          <td className="py-4 px-4 border" colSpan={2}>
            <u className="font-semibold">
              First degree burn (red blotches/sunburn)
            </u>
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border"></td>
          <td className="py-4 px-4 border">
            - Unintentional contact with a hot part: 50-60°C* (bare metal).
          </td>
          <td className="py-4 px-4 border">
            - Work with water at &lt; 4°C
            <br />
            E.g. kitchen work, cleaning work during period of frost, fire water
            (firefighters), etc.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Electricity = () => {
  return (
    <table className="w-full border-collapse border">
      <thead className="bg-blue-400 text-white">
        <tr>
          <th className="py-10 px-4 border">Rating G</th>
          <th className="py-10 px-4 border " colSpan={2}>
            {" "}
            <strong>Electricity</strong>
            <br />
            (In humid conditions, divide the voltage values by two)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-4 px-4 border text-center font-bold">15</td>
          <td className="py-4 px-4 border">
            ▪ Body constant for irreversible cardiac fibrillation
            (electrocution):
            <br />- <strong>I ≥ 75 mA</strong> in case of brief contact (1/2 s)
            <br />- <strong>I &gt; 30 mA</strong> in case of prolonged contact
            (&gt; 5 s)
            <br />▪ Severe burns, organ injury: AC: &gt; 1000 V (high voltage)
            DC: &gt; 1500 V
          </td>
          <td className="py-4 px-4 border">
            E.g. power line, solar panel, HV transformer, 220 V** in humid
            conditions, direct lightning strike, etc.
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border text-center font-bold">7</td>
          <td className="py-4 px-4 border">
            ▪ Bodily constant for contractions (not loosening grip),
            respiratory paralysis, disruption of heart and breathing rate:
            <br />
            - 30 mA &gt; I &gt; 75 mA in case of brief contact (1/2 s)
            <br />
            - 10 mA &gt; I &gt; 30 mA in case of prolonged contact (5 s)
            <br />
            ▪ Burns: AC: 50 V (12 V in humid conditions) &lt; U ≤ 1000 V (low
            voltage)
            <br />
            DC: 120 &lt; U ≤ 1500 V
          </td>
          <td className="py-4 px-4 border">
            E.g. 220 V** in humid conditions, condensers (even after shutting
            off equipment), lightning strike at 30m, etc.
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border text-center font-bold">3</td>
          <td className="py-4 px-4 border">
            ▪ Bodily constant for an electric shock with reversible effects
            (muscle reflex with loosening of grip):
            <br />
            - 0.5 mA &gt; I* &gt; 10 mA in case of prolonged contact
            <br />- <strong>0.5 mA &gt; I* &gt; 30 mA</strong> in case of brief
            contact (½s)
            <br />
            However, the shock can result in a sudden reaction that leads to a
            minor injury
            <br />
            ▪ Burns related to strong intensity: AC &lt; 50 V
            <br />
            DC &lt; 120 V
          </td>
          <td className="py-4 px-4 border">
            The protection devices of a differential type 30 [mA] break the
            circuit in around one tenth of a second.
            <br />
            E.g. static electricity, etc.
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border text-center font-bold">1</td>
          <td className="py-4 px-4 border">
            ▪ Bodily constant of a human in AC without notable effect:{" "}
            <strong>I*</strong>
            <br />
            <strong>&lt; 0.5 mA</strong>
          </td>
          <td className="py-4 px-4 border">
            E.g. Use of electrical equipment recommended.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const getCategoryComponent = (subCategory: string) => {
  switch (subCategory) {
    case subCategoryList.mechanical:
      return Mechanical;
    case subCategoryList.traffic:
      return Traffic;
    case subCategoryList.pressure:
      return Optical;
    case subCategoryList.height:
      return Height;
    case subCategoryList.heatcold:
      return HeatCold;
    case subCategoryList.electricity:
      return Electricity;
    case subCategoryList.atmosphere:
      return null;
    // Add other categories here
    default:
      return null;
  }
};

export const SeverityRatingTable = () => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(
    subCategory || subCategoryList.mechanical
  );
  return <TestTable />;
  //   return <div>{CategoryComponent && <CategoryComponent />}</div>;
};
