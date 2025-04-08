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
          <th className="border p-4">
            Tools/machines or other mechanical hazards
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 15 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-orange-500 p-4">15</td>
          <td className="border p-4">
            <strong>
              Rotating machines, unprotected moving parts that can have an
              impact on the whole body or a large part of the body:
            </strong>
            <br />- Pipe cutters, calenders, mixers, presses, roll benders,
            conveyers, movement of high kinetic loads (wagons), etc.
          </td>
        </tr>
        <tr
          onClick={() => handleClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 7 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-amber-500 p-4">7</td>
          <td className="border p-4">
            <strong>Small turning machines, unprotected moving parts:</strong>
            <br />
            - Clippers, drills, grinders, lathes, winches, hydraulic presses,
            etc.
            <br />
            <strong>Other energy sources:</strong>
            <br />
            - Air-driven ventilator blades, compressed springs, jacks, etc.
            <br />
          </td>
        </tr>
        <tr
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="border  font-bold text-yellow-500 p-4">3</td>
          <td className="border p-4">
            <strong> Manually operated tools or objects:</strong>
            <br />
            - Cutters, knives, scissors, staplers, hammers, small tools, saws,
            mincers, skips, bins, strapping, etc.
            <br />
            <strong>Energy of the body striking fixed objects:</strong>
            <br />
            - Corners of unprotected equipment, open drawers, low shelves,
            clutter, etc.
            <br />
            - Objects that hit, cut, pinch, jam, etc., such as windowpanes and
            springs.
            <br />
          </td>
        </tr>
        <tr
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-green-500 p-4">1</td>
          <td className="border p-4">-</td>
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
          <th className="border border-white text-white py-10" rowSpan={2}>
            <strong>Rating G</strong>
          </th>
          <th className="border border-white text-white py-10" colSpan={2}>
            <strong>Movement of pedestrians or vehicles</strong>
          </th>
        </tr>
        <tr className="bg-blue-400 text-white">
          <th className="border border-white text-white py-10">On foot</th>
          <th className="border border-white text-white py-10">
            Traffic on site and off sit
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 15 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-orange-500 p-4">15</td>

          <td className="border p-4">-</td>
          <td className="border p-4">
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
        <tr
          onClick={() => handleClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 7 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-amber-500 p-4">7</td>
          <td className="border p-4">-</td>
          <td className="border p-4">
            - Intersection of vehicle flow and unexpected obstacle/stationary
            vehicle, etc. or between vehicle flows with low visibility.
          </td>
        </tr>
        <tr
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-yellow-500 p-4">3</td>
          <td className="border p-4">-Movement on one level.</td>
          <td className="border p-4">
            - Cycle on gravel/irregular surface, etc.
            <br />- Ordinary conditions
          </td>
        </tr>
        <tr
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-green-500 p-4">1</td>
          <td className="border p-4">-</td>
          <td className="border p-4">
            - Reduced vehicle flow on separated, well-lit and well-maintained
            roads, etc.
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
          <th className="border border-white text-white py-10" rowSpan={2}>
            <strong>Rating G</strong>
          </th>
          <th className="border border-white text-white py-10" colSpan={2}>
            <strong>Height</strong>
          </th>
        </tr>
        <tr className="bg-blue-400 text-white">
          <th className="border border-white text-white py-10">
            <strong>Work at height </strong>
            <br />
            (distance from foot to floor)
          </th>
          <th className="border border-white text-white py-10">
            <strong>Object at height </strong>
            (with helmet) <br />
            (to be adapted based on the size and shape of the object)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleClick(40)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 40 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-red-500 p-4">40</td>
          <td className="border p-4">
            Work by several people at more than 3 metres from the ground or a
            body of water
          </td>
          <td className="border p-4">
            Simultaneous work:
            <br />
            - Scaffolding in a busy zone (during a major shutdown), etc.
            <br />
            - Cradle above a busy zone, etc.
            <br />
            - Loaded duckboard above an activity zone
            <br />- Wall of an excavation/pit/gallery (crush syndrome), etc.
          </td>
        </tr>
        <tr
          onClick={() => handleClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 15 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-orange-500 p-4">15</td>
          <td className="border p-4">
            -Working at a height of more than 3 metres above the ground <br />
            -Work above a body of water
          </td>
          <td className="border p-4">
            Objects from: <br />- 2m cabinet: {">"} 7kg
            <br />- 5m shelving: {">"} 2.5kg
            <br />- high shelving (7.2m): {">"} 2kg
            <br />- 12m scaffolding: {">"} 1kg
            <br />
          </td>
        </tr>
        <tr
          onClick={() => handleClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 7 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-amber-500 p-4">7</td>
          <td className="border p-4">
            Working at a height of 1.5 to 3 metres above the ground
          </td>
          <td className="border p-4">
            For objects of intermediate mass, use: <br />
            Electronic calculator:
            http://www.dropsonline.org/resources-and-guidance/drops-calculator/e-drops-calculator/
            or
            <br />
            DROPS METRIC table: see below
          </td>
        </tr>
        <tr
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-yellow-500 p-4">3</td>
          <td className="border p-4">
            Work performed at between 0.5 and 1.5 meters above the ground
          </td>
          <td className="border p-4">
            For objects of intermediate mass, use: <br />
            Electronic calculator:
            http://www.dropsonline.org/resources-and-guidance/drops-calculator/e-drops-calculator/
            or
            <br />
            DROPS METRIC table: see below
          </td>
        </tr>
        <tr
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-green-500 p-4">1</td>
          <td className="border p-4">
            Work performed at less than 0.5 meters above the ground
          </td>
          <td className="border p-4">
            Objects located at a distance of:
            <br />- 2m: {"<"} 3kg
            <br />- 5m: {"<"} 1kg
            <br />- 7.2m: {"<"} 0.6kg
            <br />- 12m: {"<"} 0.4kg
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
          <th className="border p-4">Heat Source</th>
          <th className="border p-4">Cold Source</th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 15 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-orange-500 p-4">15</td>
          <td className="border p-4">
            Third degree burn (damage to the dermis and the epidermis) over more
            than 10% of the body
            <br />- Unintentional contact with a hot part: T° {">"} 70°C (bare
            metal), {">"} 80°C (ceramics/glass), {">"} 95°C (plastic).
            <br />
            - Contact with a hot product
            <br />
            E.g. boiling oil, steam, flashback, bitumen, drain protection,
            vacuum/atmospheric residues, distillation furnace, etc.
          </td>
          <td className="border p-4">
            Third degree burn (damage to the dermis and the epidermis) over more
            than 10% of the body
            <br />
            - & H281 Contains refrigerated gas; can cause cryogenic burns or
            injuries.
            <br />
            - Involuntary contact with gases compressed at very low boiling
            temperatures (liquid nitrogen, liquid oxygen, liquid ethylene,
            etc.).
            <br />- Prolonged contact with propylene and propane.
          </td>
        </tr>
        <tr
          onClick={() => handleClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 7 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-amber-500 p-4">7</td>
          <td className="border p-4">
            Third degree burn over less than 10% of the body or deep second
            degree burn (deep damage to the dermis).
            <br />
            - Unintentional contact with a hot part:
            <br />
            {">"} 70°C (bare metal) or {">"} 80°C (ceramics/ glass) or {">"}{" "}
            95°C (plastic) if less than 10% of the body makes contact.
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
          <td className="border p-4">
            Third degree burn over less than 10% of the body or deep second
            degree burn (deep damage to the dermis).
            <br />
            - & H281 Contains refrigerated gas; can cause cryogenic burns or
            injuries.
            <br />- Unintentional contact with gases compressed at low boiling
            temperatures (propylene, propane, butane, etc.).
          </td>
        </tr>
        <tr
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-yellow-500 p-4">3</td>
          <td className="border p-4">
            Second degree burn (blisters)
            <br />
            - Unintentional contact with a hot part: 60-65°C* (bare metal).
            <br />
            - Handling an object at a temperature of: 44-50°C* (bare metal).
            <br />
            E.g. hot meals service, water-heater water, outside of a kitchen
            oven door, radiator, etc.
          </td>
          <td className="border p-4">
            Second degree burn (blisters)
            <br />- Unintentional contact with a metallic part at: {"<"} -20°C
            <br />- Handling a metallic object at a temperature of: {"<"} -7°C
            <br />
            E.g. frozen products, chain wheels in periods of frost, etc.
          </td>
        </tr>
        <tr
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-green-500 p-4">1</td>
          <td className="border p-4">
            First degree burn (red blotches/sunburn)
            <br />- Unintentional contact with a hot part: 50-60°C* (bare
            metal).
          </td>
          <td className="border p-4">
            First degree burn (red blotches/sunburn)
            <br />- Work with water at {" <"} 4°C <br />
            E.g. kitchen work, cleaning work during period of frost, fire water
            (firefighters), etc.
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
          <th className="border p-4" colSpan={2}>
            <strong>Electricity</strong>
            (In humid conditions, divide the voltage values by two)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 15 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-orange-500 p-4">15</td>
          <td className="border p-4">
            ▪Body constant for irreversible cardiac fibrillation
            (electrocution):
            <br />
            - I ≥ 75 mA in case of brief contact (1/2 s)
            <br />- I {">"} 30 mA in case of prolonged contact ({">"} 5 s)
            <br />
            ▪ Severe burns, organ injury:
            <br />
            AC: {">"} 1000 V (high voltage)
            <br />
            DC: {">"} 1500 V
          </td>
          <td className="border p-4">
            E.g. power line, solar panel, HV transformer, 220 V** in humid
            conditions, direct lightning strike, etc.
          </td>
        </tr>
        <tr
          onClick={() => handleClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 7 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-amber-500 p-4">7</td>
          <td className="border p-4">
            ▪ Bodily constant for contractions (not loosening grip),
            respiratory paralysis, disruption of heart and breathing rate:
            <br />- 30 mA {">"} I {">"} 75 mA in case of brief contact (1/2 s)
            <br />- 10 mA {">"} I {">"} 30 mA in case of prolonged contact (5 s)
            <br />
            ▪ Burns:
            <br />
            AC:
            <br />
            50 V (12 V in humid conditions) {"<"} U ≤ 1000 V (low voltage)
            <br />
            DC: 120 {"< "}U ≤ 1500 V
          </td>
          <td className="border p-4">
            E.g. 220 V** in humid conditions, condensers (even after shutting
            off equipment), lightning strike at 30m, etc.
          </td>
        </tr>
        <tr
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-yellow-500 p-4">3</td>
          <td className="border p-4">
            ▪ Bodily constant for an electric shock with reversible effects
            (muscle reflex with loosening of grip):
            <br />- 0.5 mA {"> "} I* {">"} 10 mA in case of prolonged contact
            <br />- 0.5 mA {">"} I* {">"} 30 mA in case of brief contact (½s)
            <br />
            However, the shock can result in a sudden reaction that leads to a
            minor injury
            <br />
            ▪ Burns related to strong intensity:
            <br />
            AC {"<"} 50 V<br />
            DC {"<"} 120 V
          </td>
          <td className="border p-4">
            The protection devices of a differential type 30 [mA] break the
            circuit in around one tenth of a second.
            <br /> E.g. static electricity, etc.
          </td>
        </tr>
        <tr
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-green-500 p-4">1</td>
          <td className="border p-4">
            ▪ Bodily constant of a human in AC without notable effect: I* {"<"}{" "}
            0.5 mA
          </td>
          <td className="border p-4">
            E.g. Use of electrical equipment recommended.
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
          <th className="border p-4">Hydraulic pressure</th>
          <th className="border p-4">Pneumatic pressure</th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleClick(40)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 40 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-red-500 p-4">40</td>
          <td className="border p-4">-</td>
          <td className="border p-4">
            <strong>H 280</strong>: Contains a pressurized gas; can explode
            under the influence of heat - Pneumatic test, HP steam piping,
            capacity (LPG truck, sphere...)
          </td>
        </tr>
        <tr
          onClick={() => handleClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 15 ? "bg-blue-100" : ""}`}
        >
          <td className="border  font-bold text-orange-500 p-4">15</td>
          <td className="border p-4">
            <strong>
              Hydraulic pressure {">"} 25 bar and more than 10 kW:
            </strong>{" "}
            <br />
            - Very high pressure industrial cleaner, etc. <br />
            <strong>Hydraulic pressure {">"} 250 bar:</strong> <br />
            - Pressurized water nozzle, snake, etc. <br />- Pressurized
            hydraulic hose with liquid flow, etc.
          </td>
          <td className="border p-4">
            Pressurized pneumatic hose with gas flow <br />
            Oversize tire inflation point (heavy vehicles/buses/tractors) at a
            service station
            <br />
            <strong>H 280: </strong>Contains a pressurized gas; can explode
            under the influence of heat
            <br />- Gas bottle ((nitrogen, acetylene, oxygen, breathable air for
            SCBA etc) in the event of high temperatures, etc.)
          </td>
        </tr>
        <tr
          onClick={() => handleClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 7 ? "bg-blue-100" : ""}`}
        >
          <td className="border  font-bold text-amber-500 p-4">7</td>
          <td className="border p-4">
            Hydraulic pressure (150-250 bar) and less than 10 kW:
            <br />
            - Industrial pressure cleaner, etc.
            <br />
            <br />
            Pressurized hydraulic equipment:
            <br />- Drainage for sampling or provision of equipment (water, oil,
            HCA), etc.
          </td>
          <td className="border p-4">
            - Sand blasting or shot-blasting
            <br />
            <br />
            Pressurized pneumatic equipment:
            <br />
            - Drainage for sampling or provision of equipment (air, steam, gas)
            <br />
            - Air compressors, blow nozzle, jacks, autoclaves, pressure cookers,
            boilers, exchangers, compressed air bottles, etc.
            <br />
            <br />
            Underwater welding of pipes or repairs of underwater oil and gas
            production equipment.
            <br /> Working at a relative pressure* higher than 100 hectopascals
            (0.1 bar) <br />
            <br />
            (*: absolute maximum pressure less the local atmospheric pressure
            around the airways during the work).
          </td>
        </tr>
        <tr
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="border  font-bold text-yellow-500 p-4">3</td>
          <td className="border p-4">
            Re-test of LPG bottles at a filling centre, projection of objects
            <br />
            Fire post, monitor nozzle, etc.
          </td>
          <td className="border p-4">
            Re-test of LPG bottles at a filling ceTargeted pressurized air or
            gas jet more than 7 bar
          </td>
        </tr>
        <tr
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="border  font-bold text-green-500 p-4">1</td>
          <td className="border p-4">
            Hydraulic pressure (25-150bar) and less than 10 kW
            <br />
            Household pressure cleaner, etc.
          </td>
          <td className="border p-4">
            Targeted pressurized air or gas jet {"<"} 7 bar
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
          onClick={() => handleClick(40)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 40 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-red-500 p-4">40</td>
          <td className="border p-4">
            Several people working in a confined space and:
            <br />
            - Presence of a non-breathable atmosphere (inert or other gases):
            oxygen level less than 10%.
            <br />- Presence of an explosive or oxygen-enriched atmosphere (LI{" "}
            {">"} 10 % LEL or oxygen level in the atmosphere greater than 23.5
            %).
            <br />- Presence in the atmosphere of a level of a gas with acute
            toxicity higher than IDHL (Immediately Dangerous for Life or Heath -
            threshold for irreversible effects)
          </td>
        </tr>
        <tr
          onClick={() => handleClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 15 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-orange-500 p-4">15</td>
          <td className="border p-4">
            - Presence of a non-breathable atmosphere (inert or other gases):
            oxygen level less than 10%. - Presence of an explosive or
            oxygen-enriched atmosphere (LI {">"} 10 % LEL or oxygen level in the
            atmosphere higher than 23.5 %). - Presence in the atmosphere of a
            level of a gas with acute toxicity higher than IDHL (Immediately
            Dangerous for Life or Heath - threshold of irreversible effects).
          </td>
        </tr>

        <tr
          onClick={() => handleClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 7 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-amber-500 p-4">7</td>
          <td className="border p-4">
            - Presence of an oxygen-depleted atmosphere: oxygen level between
            10% and 16%.
            <br />- Presence in the atmosphere of a level of acutely toxic gases
            between the 15-minute OEL and the IDHL.
          </td>
        </tr>
        <tr
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-yellow-500 p-4">3</td>
          <td className="border p-4">
            - Presence of an oxygen-depleted atmosphere: oxygen level between 16
            and 19.5 %.
            <br />- Presence in the atmosphere of a level of chronically toxic
            gases between the 8-hour OEL and the 15-minute OEL.
          </td>
        </tr>
        <tr
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="border font-bold text-green-500 p-4">1</td>
          <td className="border p-4">
            - Presence of an atmosphere around the normal: oxygen level between
            19.5% and 23.5%.
            <br />- Presence in the atmosphere of a level of chronic toxic gas
            below the 8-hour OEL.
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

export const SeverityRatingTable = ({
  severityRating,
  setSeverityRating,
}: Props) => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(
    subCategory || subCategoryList.mechanical
  );

  if (!CategoryComponent) return null;

  return (
    <CategoryComponent
      severityRating={severityRating}
      setSeverityRating={setSeverityRating}
    />
  );
};
