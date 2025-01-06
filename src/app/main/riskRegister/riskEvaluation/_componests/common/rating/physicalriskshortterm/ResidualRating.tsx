import { subCategoryList, useSubCategoryStore } from "./PhysicalRiskShortTerm";

const Mechanical = () => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-2 px-4 border">Reduction of P</th>
          <th className="py-2 px-4 border">
            Shock prevention/protection measures
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-4 px-4 border text-center font-bold">-1</td>
          <td className="py-4 px-4 border">
            <strong>
              <u>At least two procedural or organizational measures from:</u>
            </strong>
            <ul className="list-disc list-inside">
              <li>See Mp-type matrix</li>
              <li>
                Apply the golden rules 3, 5 and 7 the manufacturer’s
                instructions, provide user training, etc.
              </li>
              <li>
                Machine/tool inspected and marked as compliant in accordance
                with a recognized standard (EC in Europe), etc.
              </li>
              <li>Use of appropriate PPE</li>
              <li>Authorization covering the task to be performed</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border text-center font-bold">-2</td>
          <td className="py-4 px-4 border">
            Safety of installations and machinery provided for in the design and
            installation rules AND appropriate maintenance AND consignment of
            installations and machinery when they are not in use
            (holster/box/container/sharp part protection device when the
            equipment is not in use, separate storage, ...).
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Traffic = () => {
  return (
    <table className="w-full border border-collapse border-gray-400">
      <thead className="bg-blue-500">
        <tr>
          <th className="border border-white text-white py-10" rowSpan={2}>
            <strong>Reduction of P</strong>
          </th>
          <th className="border border-white text-white py-10" colSpan={2}>
            <strong>Means/measures of prevention/protection</strong>
          </th>
        </tr>
        <tr>
          <th className="border border-white text-white py-10">
            <strong>Movements</strong>
          </th>
          <th className="border border-white text-white py-10">
            <strong>Traffic on and off site</strong>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-400 text-center">
            <strong>-1</strong>
          </td>
          <td className="border border-gray-400">
            <strong>
              <u>At least two procedural or organizational measures from:</u>
            </strong>
            <p>- See Mp-type matrix</p>
            <p>
              - Cleaning and clearing ground/floors and traffic roads, checking
              the duckboards, gritting or sanding in winter, absorbing
              spreading, clean and tidy audit, 5S
            </p>
            <p>- Wearing appropriate shoes in a good state of repair</p>
            <p>
              - Setting up and maintaining appropriate lighting (permanent and
              temporary)
            </p>
            <p>
              - Organizing the work so that tasks can be performed without hurry
            </p>
            <p>
              - Ensuring best practices are followed (hold the hand-rail, do not
              walk while using a smartphone, avoid moving when performing
              another task, keep office drawers and cabinets closed), etc.
            </p>
          </td>
          <td className="border border-gray-400">
            <strong>
              <u>At least two procedural or organizational measures from:</u>
            </strong>
            <p>- See Mp-type matrix, apply golden rule 2, CR-GR-HSE-404;</p>
            <p>- Demarcating the ground/floor of pedestrian zones</p>
            <p>- Limiting movements (video conferences, etc.)</p>
            <p>- Taking the train rather than the car, etc.</p>
            <p>- Displaying a site traffic plan and associated signs</p>
            <p>- Gritting/sanding in winter</p>
            <p>- Servicing vehicles and checking vehicles before use</p>
            <p>
              - Taking sufficient regular breaks when driving for a long time,
              etc.
            </p>
            <p>
              - Specific training (CACES...), regular preventive driving
              training, traffic risk awareness and prevention programs, alcohol,
              drug and addiction approach, etc.
            </p>
            <p>
              - Medical surveillance (e.g. sight, hearing, sleep apnoea, stress,
              etc.)
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-400 text-center">
            <strong>-2</strong>
          </td>
          <td className="border border-gray-400">
            <p>
              - Provide anti-slip floor covering, sufficient working space, etc.
            </p>
            <p>- Fill holes, repair coverings</p>
            <p>
              - Install ramps and handrails for stairways and to get down from
              trucks and forklifts
            </p>
            <p>
              - Install cable ducts for electrical cables to improve traffic,
              etc.
            </p>
          </td>
          <td className="border border-gray-400">
            <p>- Optimize the state and layout of roads and crossings:</p>
            <p>
              o Protect pedestrian zones with physical obstacles, install paths
              that can be used by cyclists, etc.
            </p>
            <p>
              o Install and maintain traffic lights/signs/markings, restrict
              access (place blocks)
            </p>
            <p>- Adapt the lighting to the working hours</p>
            <p>- Equip the forklift with an obstacle detection system</p>
            <p>- Equip trucks with an alcohol interlock</p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-400 text-center">
            <strong>-3</strong>
          </td>
          <td className="border border-gray-400">
            <p>
              - Design access to the workplace with due consideration for the
              ergonomic, lighting and traffic flow segregation rules, etc.
            </p>
            <p>- Sheathe electrical cables on the ground, etc.</p>
          </td>
          <td className="border border-gray-400" width="282">
            <p>- Physically separate pedestrian and vehicle flows, etc.</p>
            <p>
              - Implement anti-collision/warning/speed restriction systems, etc.
            </p>
            <p>- Ban personal cars from the site, etc.</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Thermal = () => {
  return (
    <table className="border-collapse border border-gray-400 w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border border-gray-400 p-4 py-10">Reduction of P</th>
          <th className="border border-gray-400 p-4 py-10">
            Means/measures of prevention/protection against extreme temperatures
            and thermal radiation
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-400 p-4 text-center">-1</td>
          <td className="border border-gray-400 p-4">
            <p>
              <u>At least two procedural or organizational measures from:</u>
            </p>
            <p>
              - See Mp-type matrix (generic table 4 of the method (generic
              part))
            </p>
            <p>- Warm or cold water fountain</p>
            <p>- Adapted work schedule</p>
            <p>- Adapted breaks (number and duration)</p>
            <p>- Provision of drinks with a high mineral content</p>
            <p>- Technical clothing adapted to the conditions</p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-4 text-center">-2</td>
          <td className="border border-gray-400 p-4">
            <p>
              - Site roofing, ventilation, air-conditioned break room, curtains
              between workshops, etc.
            </p>
            <p>- Technical clothing adapted to severe cold (multiple layers)</p>
            <p>- Technical clothing adapted to thermal radiation or heat</p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-4 text-center">-3</td>
          <td className="border border-gray-400 p-4">
            <p>- Air conditioning, heating, etc.</p>
            <p>
              - Technical clothing adapted to very severe cold (multiple layers)
            </p>
            <p>- Technical cooling clothing for severe heatwaves</p>
            <p>- Moving away or insulation from the thermal radiation source</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Height = () => {
  return (
    <table className="w-full border-collapse border border-gray-400">
      <thead className="bg-blue-400 text-white">
        <tr>
          <th className="py-10 px-4 border border-gray-400" rowSpan={2}>
            Reduction of P
          </th>
          <th className="py-10 px-4 border border-gray-400" colSpan={2}>
            Measures to prevent/protect against falls from height
          </th>
        </tr>
        <tr>
          <th className="py-10 px-4 border border-gray-400">Work at height</th>
          <th className="py-10 px-4 border border-gray-400">
            Object at height
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-4 px-4 border border-gray-400 text-center font-bold">
            -1
          </td>
          <td className="py-4 px-4 border border-gray-400">
            <strong>At least two measures from:</strong>
            <ul className="list-disc pl-20">
              <li>Apply golden rule 10</li>
              <li>Wedge/attach/stabilize the ladder/scaffolding/MEWP, etc.</li>
              <li>
                Ladder/scaffolding/MEWP user training and inspection, etc.
              </li>
              <li>Inspect scaffolding, ladders, etc.</li>
              <li>
                Set up an access restriction system (signposting, marking, etc.)
              </li>
              <li>Wear a safety harness with appropriate connecting devices</li>
              <li>Provide sufficient life preservers, etc.</li>
              <li>
                Working in twos, do not work when the wind is strong, ensure
                three attachment points, etc.
              </li>
              <li>
                Perform periodical inspections/servicing (duckboards, harness,
                etc.)
              </li>
              <li>
                Warn about the risk of drowning with a sign and control access,
                etc.
              </li>
            </ul>
          </td>
          <td className="py-4 px-4 border border-gray-400">
            <strong>At least two measures from:</strong>
            <ul className="list-disc pl-20">
              <li>Apply the golden rules 6 and 10</li>
              <li>Hold an excavation permit</li>
              <li>Use of toeboards, signage, net, etc.</li>
              <li>Tie packages to pallets</li>
              <li>Maintain storage shelves/racks</li>
              <li>Wear a helmet and safety shoes</li>
              <li>Prohibit storage on top of cabinets</li>
              <li>
                Neatness and tidiness: store tools/materials on work equipment
                at a height; implement storage rules in storerooms, etc.
              </li>
              <li>Transport tools safely (rucksacks, tool belts, etc.)</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border border-gray-400 text-center font-bold">
            -2
          </td>
          <td className="py-4 px-4 border border-gray-400">
            <ul className="list-disc pl-20">
              <li>
                Access to a well-anchored lifeline that meets the regulations
              </li>
              <li>
                Put permanent protective equipment in place (1m guard-rail,
                fixed platform in the installations, access stairways, etc.)
              </li>
              <li>
                Use temporary equipment that is safer than
                ladders/stepladders/stools (IMP/ILMP, mobile scaffolding, MEWP,
                etc.)
              </li>
              <li>
                Put temporary protective equipment in place (nets on the
                underside, etc.)
              </li>
              <li>Put nets in place around the basins, safety vests, etc.</li>
              <li>Build an embankment or reinforce the trench, etc.</li>
            </ul>
          </td>
          <td className="py-4 px-4 border border-gray-400">
            <ul className="list-disc pl-20">
              <li>Use a wrist-strap for hand tools</li>
              <li>
                Use nets along the guard-rails, 10cm toeboards, groundsheets on
                duckboard, etc.
              </li>
              <li>
                Use a cable to secure objects at height (lights, chain wheels,
                etc.)
              </li>
              <li>
                Organize storage (appropriate shelving/racking, manoeuvring
                space, etc.)
              </li>
              <li>
                Limit heights (&lt; 7.2m for pallets, &lt; 2m for parcels), etc.
              </li>
              <li>
                Adapt and check the lifting means (ropes, winches, slings etc.)
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border border-gray-400 text-center font-bold">
            -3
          </td>
          <td className="py-4 px-4 border border-gray-400">
            <ul className="list-disc pl-20">
              <li>
                Implement technical changes to allow work to be done at ground
                level (mechanism to change light bulbs from the ground,
                measuring/control instruments at ground level for equipment at
                height, replacement of service station totem poles by electronic
                systems, etc.)
              </li>
              <li>
                Build on the ground, then lift hydraulically (e.g. FAST canopy),
                etc.
              </li>
            </ul>
          </td>
          <td className="py-4 px-4 border border-gray-400">
            <ul className="list-disc pl-20">
              <li>
                Use a permanent tool attachment system, including when switching
                from hand to hand, etc.
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const HeatCold = () => {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-[10px] px-4 border">Reduction of P</th>
          <th className="py-[10px] px-4 border">
            Burn prevention/protection measures
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-4 px-4 border text-center font-bold">-1</td>
          <td className="py-4 px-4 border">
            <p>
              <strong>
                <u>At least two procedural or organizational measures from:</u>
              </strong>
            </p>
            <p>- See Mp-type matrix</p>
            <p>- Apply golden rule 7</p>
            <p>
              - Use appropriate thermal protective gloves, goggles and special
              clothing
            </p>
            <p>- Use insulated tools/chain wheels, etc.</p>
            <p>- Use showers close to the Bitumen station, etc.</p>
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border text-center font-bold">-2</td>
          <td className="py-4 px-4 border">
            <p>- Specific PPE (soldering equipment, etc)</p>
            <p>
              - Use thermal screens to protect the neighbouring workplace, etc.
            </p>
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border text-center font-bold">-3</td>
          <td className="py-4 px-4 border">
            <p>
              - Insulating/weather stripping equipment (collective protection),
              etc.
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Electricity = () => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4 py-[10px]">Reduction of P</th>
          <th className="border p-4 py-[10px]">
            Means/measures of prevention/protection against electrical risk
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-4 text-center font-bold">-1</td>
          <td className="border p-4">
            <p>
              <strong>
                <u>At least two procedural or organizational measures from:</u>
              </strong>
            </p>
            <p>- See Mp-type matrix</p>
            <p>
              - Stay at least five meters away from power lines (Golden rule 7),
              distances from neighbours, mark off hazardous zones, etc.
            </p>
            <p>
              - Following the safety rules (disconnect equipment before starting
              work, etc.)
            </p>
            <p>- Giving adequate training, etc.</p>
            <p>- Periodically checking electrical installations, etc.</p>
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold">-2</td>
          <td className="border p-4">
            <p>- Holding authorization covering the task to be performed</p>
            <p>
              - Making electrical installations and materials safe (locking),
              etc.
            </p>
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold">-3</td>
          <td className="border p-4">
            <p>
              - Having electrical installations and materials made safe in
              accordance with the design and installation rules AND maintained
              appropriately in accordance with the schedule, etc.
            </p>
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
      return Thermal;
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

export const ResidualRatingTable = () => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(
    subCategory || subCategoryList.mechanical
  );

  return <div>{CategoryComponent && <CategoryComponent />}</div>;
};
