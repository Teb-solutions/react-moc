import { subCategoryList, useSubCategoryStore } from "./PhysicalRiskShortTerm";

interface PotentialRatingProps {
  potentialRating: number | null;
  setPotentialRating: (rating: number) => void;
}

const Mechanical = ({ potentialRating, setPotentialRating }: PotentialRatingProps) => {
  return (
    <table className="w-full border-collapse border border-gray-400">
      <thead className="bg-blue-400 text-white">
        <tr>
          <th className="py-10 px-4 text-center font-bold border border-gray-400">
            Rating
          </th>
          <th className="py-10 px-4 text-center font-bold border border-gray-400">
            Probability of potential exposure P to situations that can lead to
            shocks
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          className={`border border-gray-400 cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(10)}
        >
          <td className="py-4 px-4 text-center font-bold border border-gray-400">
            10
          </td>
          <td className="py-4 px-4 border border-gray-400">
            Passing through or changing a protective barrier: unblocking,
            stripping, picking up fallen/incorporated parts or any other
            intervention when the machine is not stopped, etc.
          </td>
        </tr>
        <tr 
          className={`border border-gray-400 cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(6)}
        >
          <td className="py-4 px-4 text-center font-bold border border-gray-400">6</td>
          <td className="py-4 px-4 border border-gray-400">
            Intervening on equipment at a standstill on a "blocked movement",
            etc. Make adjustments, etc. Maintenance with co-activity: without
            disconnecting all energy sources, etc. Use a machine that is not
            secured by a guard, etc.
          </td>
        </tr>
        <tr 
          className={`border border-gray-400 cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(3)}
        >
          <td className="py-4 px-4 text-center font-bold border border-gray-400">
            3
          </td>
          <td className="py-4 px-4 border border-gray-400">
            Use suitable tools or machines, possible access to moving parts,
            etc.
          </td>
        </tr>
        <tr 
          className={`border border-gray-400 cursor-pointer hover:bg-gray-100 ${potentialRating === 1 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(1)}
        >
          <td className="py-4 px-4 text-center font-bold border border-gray-400">
            1
          </td>
          <td className="py-4 px-4 border border-gray-400">
            Using a modified machine made secure by the operator, difficult
            access to moving parts, etc.
          </td>
        </tr>
        <tr 
          className={`border border-gray-400 cursor-pointer hover:bg-gray-100 ${potentialRating === 0.5 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(0.5)}
        >
          <td className="py-4 px-4 text-center font-bold border border-gray-400">
            0.5
          </td>
          <td className="py-4 px-4 border border-gray-400">
            Working on a machine made secure (no access to moving parts possible
            except for maintenance), etc.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Traffic = ({ potentialRating, setPotentialRating }: PotentialRatingProps) => {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border" rowSpan={2}>
            <strong>Rating</strong> <strong>P</strong>
          </th>
          <th className="py-10 px-4 border" colSpan={2}>
            <strong>Probability</strong>
            <strong>P of being exposed to level falls or collisions</strong>
          </th>
        </tr>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">
            <strong>Movement on site (pedestrians)</strong>
            (ground conditions, elevation, space/access/obstacle, lighting*)
          </th>
          <th className="py-10 px-4 border">
            <strong>Traffic</strong>
            <strong>on and off site</strong>
            (co-activité, visibilité suffisante, vitesse adaptée) (conducteurs &
            missions)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(10)}
        >
          <td className="border py-4 px-4 text-center font-bold">10</td>
          <td className="border py-4 px-4">
            - Moving on ice, in mud, oil, etc.
            <br />- Move with almost zero visibility near the void or
            significant drop in elevation.
          </td>
          <td className="border py-4 px-4">
            - Driving under the influence of psychoactive substances.
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(6)}
        >
          <td className="border py-4 px-4 text-center font-bold">6</td>
          <td className="border py-4 px-4">
            <strong>
              <u>Moving in poor conditions in relation to:</u>
            </strong>
            <br />- <u>State of the ground/floor:</u> slippery, irregular, very
            steep, etc., not maintained or irregularly maintained, etc.
            <br />- <u>Space:</u> moving in a blocked, cluttered or reduced zone
            (hoses, electric cables, boxes, tools, truck hatches, rail sleepers,
            etc.) etc.
            <br />- <u>Equipment:</u> ladder with narrow, irregular steps, etc.,
            defective duckboards, false ceilings, sloping roofs, unstable
            gangways, hatches, etc.
            <br />- <u>Vision:</u> poorly lit, half-light, unlit routes at
            night, obstructed view, etc.
            <br />- <u>HOF:</u> moving in a production unit while performing a
            task or with hand occupied in an unstable/cluttered/irregular zone,
            passing a protective barrier, etc.
          </td>
          <td className="border py-4 px-4">
            - Driving when tired
            <br />
            - Driving at excessive speed
            <br />
            - Driving while on the phone, etc.
            <br />
            - Driving a vehicle that has not been serviced (brakes or lights,
            worn tires, etc.)
            <br />
            - Driving where black ice, aquaplaning, etc. is common
            <br />- Driving when visibility is low, sight or hearing is
            impaired, etc.
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(3)}
        >
          <td className="border py-4 px-4 text-center font-bold">3</td>
          <td className="border py-4 px-4">
            <strong>
              <u>Moving in tricky conditions:</u>
            </strong>
            <br />
            - Moving on a site* while conducting a visual inspection in a
            traffic zone for vehicles, hand trollies, etc.
            <br />
            - Unmarked dangerous zone, etc.
            <br />
            - Outdoor stairways (see “Work at height” matrix)
            <br />- Movement on an unstable level (that moves or slides) with
            deteriorated covering, on gravel, narrow passage, poorly lit, etc.
          </td>
          <td className="border py-4 px-4">
            - Driving for a long time
            <br />
            - Driving in a parking lot, co-activity, production or logistics
            zone, hand trolley traffic zone, without up-to-date traffic plan
            and/or with faulty or no signage
            <br />
            - Driving on untarmacked tracks
            <br />- Driving heavy vehicles with reduced visibility (cranes,
            loaders, mechanical diggers).
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 1 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(1)}
        >
          <td className="border py-4 px-4 text-center font-bold">1</td>
          <td className="border py-4 px-4">
            <strong>
              <u>Moving in normal conditions:</u>
            </strong>
            <br />
            - Well-lit, daylight
            <br />
            - Regularly cleaned
            <br />- No obstacles, no height differences, etc.
          </td>
          <td className="border py-4 px-4">
            - Traffic controlled on site, etc.
            <br />- Moving in a zone with separate pedestrian/vehicle traffic,
            etc.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Height = ({ potentialRating, setPotentialRating }: PotentialRatingProps) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border" rowSpan={2}>
            Rating P
          </th>
          <th className="py-10 px-4 border" colSpan={2}>
            Probability of potential exposure P to situations that can lead to:
            falls from height or into water
          </th>
        </tr>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Work at height</th>
          <th className="py-10 px-4 border">Object at height</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(10)}
        >
          <td className="py-4 px-4 border text-center font-bold">10</td>
          <td className="py-4 px-4 border">
            <strong>Working in prohibited conditions:</strong>
            <p>- Use of a cradle that does not meet design conditions</p>
            <p>
              - Working on a ladder, a roof with a considerable slope, a truck
              hatch without side rail, passing a protective barrier, etc.
            </p>
            <strong>Working/moving above a body of water</strong>
          </td>
          <td className="py-4 px-4 border">
            <strong>Working below or close to:</strong>
            <p>
              - Objects that are likely to move significantly in the wind or
              poorly tied by rope when being lifted manually
            </p>
            <p>
              - Mechanical digger and material excavated less than a meter from
              excavation site, etc.
            </p>
            <p>
              Changing price boards on a non-electronic totem pole at a service
              station, etc.
            </p>
          </td>
        </tr>

        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(6)}
        >
          <td className="py-4 px-4 border text-center font-bold">6</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>Working in degraded conditions:</u>
            </strong>
            <p>
              - Working on corroded/poorly fixed equipment without a guard rail
              or anchoring point, etc.
            </p>
            <p>- Moving a deployed MEWP, etc.</p>
            <p>
              - Using an inappropriate ladder/stepladder/gangway to access a
              boat
            </p>
            <p>- Working at height when it is windy, snowing, icy, etc.</p>
            <p>
              - Working on ground/floors in poor condition, roofing and false
              ceilings, truck hatches, etc.
            </p>
            <strong>
              <u>Working/moving close to a body of water</u>
            </strong>
          </td>
          <td className="py-4 px-4 border">
            <strong>
              Working in unfavourable conditions <u>below</u> or{" "}
              <u>close to:</u>
            </strong>
            <p>
              - Scaffolding cluttered or without toeboards, tools not put away
            </p>
            <p>
              - Unstable storage of materials in bulk at a height (loose pieces
              of scaffolding, etc.)
            </p>
            <p>
              - Difficult to reach storage zones at a height (e.g. in stores),
              etc.
            </p>
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(3)}
        >
          <td className="py-4 px-4 border text-center font-bold">3</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>Delicate operations:</u>
            </strong>
            <p>- Putting up/taking down scaffolding</p>
            <p>- Working at a loading bay, close to a drop, etc.</p>
            <p>- Taking a fixed ladder, external stairway, etc.</p>
            <p>- Climbing into/out of a truck cabin, etc.</p>
            <p>
              - Using scaffolding that is in poor condition / poorly built, not
              level, uninspected
            </p>
            <p>
              - Riding on a palletizer or other equipment during maintenance
            </p>
            <p>
              - Working with inadequate collective protective barriers compared
              to the size of the truck (loading/unloading stations), uneven
              platform, etc.
            </p>
            <p>- Working in unfavourable weather: rain, etc.</p>
          </td>
          <td className="py-4 px-4 border">
            <strong>
              <u>Working below or close to:</u>
            </strong>
            <p>
              - Equipment installed at a height with corroded/damaged
              attachments (light support on platform)
            </p>
            <p>
              - Lifting objects above an activity zone when people are present,
              etc.
            </p>
            <p>Working in a warehouse/storeroom with:</p>
            <p>- Overloaded storage (weight and volume)</p>
            <p>
              - Storage in poor condition or inappropriate (racks, pallets...)
            </p>
            <p>- Parcels not secured on to pallets, not neatly stacked, etc.</p>
            <p>
              - Palettes, boxes etc. stacked too high and/or limited resistance
              of packaging over time, etc.
            </p>
            <p>
              - Bulk materials <u>Transfer of loads</u>
            </p>
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 1 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(1)}
        >
          <td className="py-4 px-4 border text-center font-bold">1</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>Working in normal conditions</u>
            </strong>
            <p>- Using a ladder, etc.</p>
            <p>- Moving on duckboard, etc.</p>
            <strong>
              <u>
                Working in a zone close to a body of water with aggravating
                factors (instability of the work zone, clutter, reduced
                accessibility, inadequate visibility, etc.).
              </u>
            </strong>
          </td>
          <td className="py-4 px-4 border">
            <strong>
              <u>Working below or close to:</u>
            </strong>
            <p>- Scaffolding not equipped with toeboards, etc.</p>
            <p>- Sling breaking during a lift, etc.</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Pressure = ({ potentialRating, setPotentialRating }: PotentialRatingProps) => {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border py-10 px-4" rowSpan={2}>
            Rating P
          </th>
          <th className="border py-10 px-4" colSpan={2}>
            Examples of tasks by type of potential exposure probability P for a
            pressure source
          </th>
        </tr>
        <tr className="bg-blue-400 text-white">
          <th className="border py-10 px-4">hydraulic</th>
          <th className="border py-10 px-4">pneumatic</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(10)}
        >
          <td className="border py-4 text-center font-bold">10</td>
          <td className="border py-4 px-4">
            <strong>Work in contact or in direct presence of pressure:</strong>
            <br />
            Working in HP in manual.
            <br />
            Intervene on poorly depressurized equipment, purge, etc...
          </td>
          <td className="border py-4 px-4">
            <strong>
              Work in contact or in the direct presence of pressure:
            </strong>
            <br />
            - when inerting pressure equipment (in degraded mode);
            <br />- during leak testing, testing, etc., (in degraded mode).
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(6)}
        >
          <td className="border py-4 text-center font-bold">6</td>
          <td className="border py-4 px-4">
            Working in HP manually (with a mechanism that fixes the equipment,
            the forces are not supported by the human body) (GM-GR-HSE-412),
            <br />
            Working with corroded or shocked equipment, etc.
          </td>
          <td className="border py-4 px-4">
            - Working with an old hose, an unpredictably overpressurized network
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(3)}
        >
          <td className="border py-4 text-center font-bold">3</td>
          <td className="border py-4 px-4">
            Travailler en HP semi-automatique dans la zone d’opération
            (GM-GR-HSE-412).
            <br />
            Intervenir sur un équipement vétuste ou mal entretenu, sur un
            flexible.
          </td>
          <td className="border py-4 px-4">
            - purge (with sprayed debris, knob, faucet, etc.), etc.
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 1 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(1)}
        >
          <td className="border py-4 text-center font-bold">1</td>
          <td className="border py-4 px-4">
            Working in semi-automatic HP out of operation area (GM-GR-HSE-412),
            etc.
            <br />
            Tare valves, perform tests or re-tests, etc.
          </td>
          <td className="border py-4 px-4"></td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 0.5 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(0.5)}
        >
          <td className="border py-4 text-center font-bold">0.5</td>
          <td className="border py-4 px-4">
            Working automatically with high pressure.
          </td>
          <td className="border py-4 px-4"></td>
        </tr>
      </tbody>
    </table>
  );
};

const HeatCold = ({ potentialRating, setPotentialRating }: PotentialRatingProps) => {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border py-[10px] px-4 text-center font-bold">
            Potential rating P
          </th>
          <th className="border py-[10px] px-4 text-center font-bold">
            Probability of potential exposure P to situations that can lead to:
            contact with a hot or cold source
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(10)}
        >
          <td className="border py-4 px-4 text-center font-bold">10</td>
          <td className="border py-4 px-4">
            Welding, flame working, etc.; Working on steam/condensate/hot
            product/hot product/propan/etc. unblocked pipe; Take a bitumen
            sample. Serve hot dishes coming out of the oven. Handling frozen
            products.
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(6)}
        >
          <td className="border py-4 px-4 text-center font-bold">6</td>
          <td className="border py-4 px-4">Purge LPG, ethylene, propylene.</td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(3)}
        >
          <td className="border py-4 px-4 text-center font-bold">3</td>
          <td className="border py-4 px-4">
            Utiliser une friteuse (contrôle température, filtrage et vidange) ou
            une étuve (équipement à point chaud).
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 1 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(1)}
        >
          <td className="border py-4 px-4 text-center font-bold">1</td>
          <td className="border py-4 px-4">
            Work on a blocked steam/hot product line. Work under normal
            conditions near hot or cold uninsulated/protected rooms, etc.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Electricity = ({ potentialRating, setPotentialRating }: PotentialRatingProps) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4 py-10">Rating</th>
          <th className="border p-4 py-10">
            Probability of potential exposure P to situations that can lead to:
            contact with an electricity source
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(10)}
        >
          <td className="border p-4 text-center font-bold">10</td>
          <td className="border p-4">
            Working in direct contact with an electricity source.
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(6)}
        >
          <td className="border p-4 text-center font-bold">6</td>
          <td className="border p-4">
            Co-activity: indirect contact with a part accidentally switched on.
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(3)}
        >
          <td className="border p-4 text-center font-bold">3</td>
          <td className="border p-4">
            General maintenance and repair work on circuits: looking for
            failures, taking measurements, tests, operations, replacing
            defective materials, etc.
            <br />
            Using temporary installations with poorly protected conductors or
            inappropriate provisional protective equipment.
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 1 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(1)}
        >
          <td className="border p-4 text-center font-bold">1</td>
          <td className="border p-4">
            Switching off or on of an equipment or an installation
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 0.5 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(0.5)}
        >
          <td className="border p-4 text-center font-bold">0.5</td>
          <td className="border p-4">
            Working on electrical equipment: replacing a light/switch/electric
            socket/bulb, etc.
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 0.2 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(0.2)}
        >
          <td className="border p-4 text-center font-bold">0.2</td>
          <td className="border p-4">Using electrical equipment, etc.</td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 0.1 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(0.1)}
        >
          <td className="border p-4 text-center font-bold">0.1</td>
          <td className="border p-4">No contact possible</td>
        </tr>
      </tbody>
    </table>
  );
};

const Atmosphere = ({ potentialRating, setPotentialRating }: PotentialRatingProps) => {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4 py-10">Rating</th>
          <th className="border p-4 py-10">
            Probability of potential exposure P to situations that can lead to:
            Respiratory failure
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(10)}
        >
          <td className="border p-4 text-center font-bold">10</td>
          <td className="border p-4">
            - Work in an uncleaned/undegassed/unventilated enclosure or during
            inerting.
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(6)}
        >
          <td className="border p-4 text-center font-bold">6</td>
          <td className="border p-4">
            - Work in inadequately cleaned/gassed/ventilated enclosure or in a
            sewer.
            <br />- Working in a vessel polluted by untimely arrivals of inert
            gas or hydrocarbons, etc. from hard/flexible connections on the
            enclosure (leakage due to a leak in the insulation device).
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(3)}
        >
          <td className="border p-4 text-center font-bold">3</td>
          <td className="border p-4">
            - Working in a perfectly provided/ventilated enclosure, but
            desorption of products by heat.
            <br />- Work in a poorly ventilated and highly corroded enclosure
            (slow consumption of O2 by chemical reaction).
          </td>
        </tr>
        <tr 
          className={`border cursor-pointer hover:bg-gray-100 ${potentialRating === 1 ? "bg-blue-100" : ""}`}
          onClick={() => setPotentialRating(1)}
        >
          <td className="border p-4 text-center font-bold">1</td>
          <td className="border p-4">
            - Working in an open vessel with unplanned arrivals of outdoor
            pollutants from neighbouring facilities.
            <br />
            - Working in pits, trenches, etc. at low points and possible arrival
            of pollutants.
            <br />
            - Working in a slightly polluted enclosure with suitable but failing
            respiratory protection.
            <br />- Working in a well-ventilated enclosure, but where a very
            specific type of chemical reaction can generate an oxygen-depleted
            atmosphere (absorption of O2 by wet activated carbon, reaction with
            oxidising catalyst remains,...).
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
      return Pressure;
    case subCategoryList.height:
      return Height;
    case subCategoryList.heatcold:
      return HeatCold;
    case subCategoryList.electricity:
      return Electricity;
    case subCategoryList.atmosphere:
      return Atmosphere;
    // Add other categories here
    default:
      return null;
  }
};

const PotentialRating = ({ potentialRating, setPotentialRating }: PotentialRatingProps) => {
  const { subCategory } = useSubCategoryStore();
  const Component = getCategoryComponent(subCategory);

  return <Component potentialRating={potentialRating} setPotentialRating={setPotentialRating} />;
};

export default PotentialRating;
