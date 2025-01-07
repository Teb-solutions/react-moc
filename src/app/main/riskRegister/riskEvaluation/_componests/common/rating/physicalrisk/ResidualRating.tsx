import { subCategoryList, useSubCategoryStore } from "./PhysicalRiskNew";

const Noise = () => {
  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border">Reduction of P</th>
          <th className="py-10 px-4 border">
            Means/measures of prevention/protection against noise
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2 border text-center">
            <strong>-1</strong>
          </td>
          <td className="p-2 border">
            <strong>
              <u>At least two procedural or organizational measures from:</u>
            </strong>

            <li>See Mp-type matrix,</li>
            <li>Signage, regular audit, inspections, calls to order, etc.</li>
            <li>Earplugs</li>
          </td>
        </tr>
        <tr>
          <td className="p-2 border text-center">
            <strong>-2</strong>
          </td>
          <td className="p-2 border">
            Wearing appropriate PPE and training on use and maintenance, helmet
            and earplugs for exposure above 120 dBA, etc.
          </td>
        </tr>
        <tr>
          <td className="p-2 border text-center p-2">
            <strong>-3</strong>
          </td>
          <td className="p-2 border p-2">Insulation and enclosure, etc.</td>
        </tr>
      </tbody>
    </table>
  );
};

const Vibration = () => {
  return (
    <table className="border-collapse border border-gray-400 w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="p-2 py-4 border border-gray-400">Reduction of P</th>
          <th className="p-2 py-4 border border-gray-400">
            Means/measures of prevention/protection against vibrations
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-4 border border-gray-400 text-center">
            <strong>-1</strong>
          </td>
          <td className="p-4 border border-gray-400">
            <strong>
              <u>At least two procedural or organizational measures from:</u>
            </strong>
            <p>
              - See Mp-type matrix (generic table 4 of the method (generic
              part)),
            </p>
            <p>- Servicing of the vehicle, equipment, etc.</p>
          </td>
        </tr>
        <tr>
          <td className="p-4 border border-gray-400 text-center">
            <strong>-2</strong>
          </td>
          <td className="p-4 border border-gray-400">
            <p>- Mechanical or pneumatic seat suspension</p>
            <p>
              - Tire pressure check, vehicle speed adapted to the surface,
              maintenance of the road surface... for vehicles
            </p>
            <p>- Anti-vibration mats under vibrating machines, etc.</p>
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

const Optical = () => {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-2 px-4 border">Reduction of P</th>
          <th className="py-2 px-4 border">
            Means/measures of prevention/protection against optical radiation
            (IR, visible, UV, laser)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">-1</td>
          <td className="py-4 px-4 border">
            <p>
              <strong>
                <u>At least two procedural or organizational measures from:</u>
              </strong>
            </p>
            <p>
              See Mp-type matrix (generic table 4 of the method (generic part))
            </p>
            <p>
              - <u>Laser:</u>
            </p>
            <p>Definition of exclusion zone, labelling (pictogram, etc.)</p>
            <p>Only an authorized person can order the radiation emission</p>
            <p>
              The beam is lower than eye level in seated position, removal of
              reflective objects (smooth, shiny surfaces) and jewelry in the
              room
            </p>
            <p>
              Wearing of appropriate protective gloves and goggles Laser
              training, etc.
            </p>
            <p>
              - <u>UV:</u>
            </p>
            <p>
              Long-sleeved shirts, hat, sun cream, access to shade or indoor
              workplace during the hottest hours of the day, etc.
            </p>
            <p>Welding training</p>
            <p>Marking off of the welding workplace, etc.</p>
            <p>
              - <u>IR:</u>
            </p>
            <p>Wearing IR protective goggles</p>
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">-2</td>
          <td className="py-4 px-4 border">
            <p>
              - <u>Laser:</u>
            </p>
            <p>
              Special PPE: protective goggles adapted to the wavelength in
              question; special protective gloves, etc.
            </p>
            <p>
              Optical path length of a covered laser, protective screen, work
              distance.
            </p>
            <p>
              - <u>UV:</u>
            </p>
            <p>
              Special PPE: welding goggles, special welding coverall and gloves,
              welding guard, welding tent (to avoid additional exposure to solar
              rays), etc.
            </p>
            <p>
              - <u>IR:</u>
            </p>
            <p>
              Use of appropriate protective screens, visors and protective
              clothing, keeping an appropriate distance from the radiation
              source (marked off exclusion zones), etc.
            </p>
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">-3</td>
          <td className="py-4 px-4 border">
            <p>
              - <u>Laser:</u>
            </p>
            <p>
              Confinement of the laser beam, locking mechanism, emergency
              shutdown, etc.
            </p>
            <p>
              - <u>UV:</u>
            </p>
            <p>Automatic welding, etc.</p>
            <p>
              - <u>IR:</u>
            </p>
            <p>
              Confinement of the beam, view holes for ovens, insulation of
              equipment, etc.
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Electromagnetic = () => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-2 px-4 border">Reduction of P</th>
          <th className="py-2 px-4 border">
            Means/measures of prevention/protection against the EMF
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
            <p>- Special signage for the zones exceeding the AV:</p>

            <p>- Reduction in the intensity of the emission</p>
            <p>
              - Moving away from the source or manual reduction of the intensity
            </p>
            <p>
              - Reduction of the intensity when the operator is close to the
              emitting equipment (e.g. when the furnace is being stoked).
            </p>
            <p>
              - Verification of the intensity of the E field after any change to
              the workplace…
            </p>
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border text-center font-bold">-2</td>
          <td className="py-4 px-4 border">
            <p>- Moving of the workplace (or equipment)</p>
            <p>
              - Device reducing the intensity of the emission when the machine
              is being adjusted
            </p>
            <p>
              - Placing of non-conductive furniture and work surfaces to avoid
              the circulation of currents induced in metallic objects...
            </p>
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border text-center font-bold">-3</td>
          <td className="py-4 px-4 border">
            <p>
              - Insulation of the emission source by shielding (metallic
              protection can serve as a Faraday cage, metal rail panels...),
              etc.
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const IonizingRadiation = () => {
  return (
    <table className="w-full border-collapse">
      <thead className="bg-blue-400 text-white">
        <tr>
          <th className="py-10 px-4 text-center border font-bold">
            Reduction of P
          </th>
          <th className="py-10 px-4 text-center border font-bold">
            Means/measures of prevention/protection against ionizing radiation
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">-1</td>
          <td className="py-4 px-4 border">
            <p>
              <u>At least two procedural or organizational measures from:</u>
            </p>
            <p>
              Individual dosimetry for persons performing tasks who are likely
              to be exposed to ionizing radiation or &gt; 1 mSv. Measurement of
              an accredited body every year (+ report). Radiometer measurements.
            </p>
            <p>Adapted medical surveillance. Surface contamination tests.</p>
            <p>
              <u>Radon:</u> regular ventilation, measurements of exposition in
              the rooms…
            </p>
            <p>
              <u>NORM:</u> indication of the location of the source with signs
              and/or markings, moving away of the source during the work,
              training of staff, operating mode available, etc.
            </p>
            <p>
              <u>Mobile sources:</u> work performed at night or when the unit is
              closed, storage in a special room, insulation of the operator by
              means of a protective guard (e.g. concrete).
            </p>
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">-2</td>
          <td className="py-4 px-4 border">
            <p>
              <u>Radon:</u> reinforcement of the natural ventilation or
              installation of adapted mechanical ventilation if more than 100
              Bq/m3, sealing of cracks and holes in and around pipes with
              silicone glue or cement, placing of a membrane on a layer of
              chippings covered with a concrete slab, etc.
            </p>
            <p>
              <u>X-ray sources:</u> anti-radiation coverall, lead apron, etc.
            </p>
          </td>
        </tr>
        <tr className="border">
          <td className="py-4 px-4 text-center font-bold border">-3</td>
          <td className="py-4 px-4 border">
            <p>
              <u>Radon:</u> withdrawal from the inhabited space or the
              depressurization of the lower parts of the building (any basement
              or crawl space), or the floor itself.
            </p>
            <p>
              <u>X-ray sources:</u> insulation of the operator by means of a
              lead-lined control panel in the protection room.
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const getCategoryComponent = (subCategory: string) => {
  switch (subCategory) {
    case subCategoryList.noise:
      return Noise;
    case subCategoryList.vibration:
      return Vibration;
    case subCategoryList.thermal:
      return Thermal;
    case subCategoryList.optical:
      return Optical;
    case subCategoryList.electromagnetic:
      return Electromagnetic;
    case subCategoryList.ionizingRadiation:
      return IonizingRadiation;
    // Add other categories here
    default:
      return null;
  }
};

export const ResidualRatingTable = () => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(
    subCategory || subCategoryList.noise
  );

  return <div>{CategoryComponent && <CategoryComponent />}</div>;
};
