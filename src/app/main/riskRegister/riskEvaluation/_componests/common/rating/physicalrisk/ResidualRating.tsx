import { subCategoryList, useSubCategoryStore } from "./PhysicalRiskNew";

interface Props {
  residualRating: number | null;
  setResidualRating: (rating: number | null) => void;
}

const Noise = ({ residualRating, setResidualRating }: Props) => {
  const handleRowClick = (rating: number) => {
    setResidualRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Reduction of 
P</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleRowClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-1</td>
          <td className="border p-4">
            <p>At least two procedural or organizational measures from:</p>
            <li> See Mp-type matrix,</li>
            <li> Signage, regular audit, inspections, calls to order, etc.</li>
            <li>Earplugs</li>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-2</td>
          <td className="border p-4">
          Wearing appropriate PPE and training on use and maintenance, helmet and earplugs for 
          exposure above 120 dBA, etc.
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-3</td>
          <td className="border p-4">
          Insulation and enclosure, etc.
          </td>
        </tr>
        
      </tbody>
    </table>
  );
};

const Vibration = ({ residualRating, setResidualRating }: Props) => {
  const handleRowClick = (rating: number) => {
    setResidualRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Reduction of 
P</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
      <tr 
          onClick={() => handleRowClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-1</td>
          <td className="border p-4">
            <p>At least two procedural or organizational measures from:</p>
            <li> See Mp-type matrix (generic table 4 of the method (generic part)),
            </li>
            <li>Servicing of the vehicle, equipment, etc</li>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-2</td>
          <td className="border p-4">
          <li>Mechanical or pneumatic seat suspension</li>
          <li>Tire pressure check, vehicle speed adapted to the surface, maintenance of the road 
          surface... for vehicles</li>
          <li>Anti-vibration mats under vibrating machines, etc.</li>
          
          </td>
        </tr>
        
      </tbody>
    </table>
  );
};

const Thermal = ({ residualRating, setResidualRating }: Props) => {
  const handleRowClick = (rating: number) => {
    setResidualRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Reduction of 
P</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
      <tr 
          onClick={() => handleRowClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-1</td>
          <td className="border p-4">
            <p>At least two procedural or organizational measures from:</p>
            <ul className="ml-10">
            <li> See Mp-type matrix (generic table 4 of the method (generic part))
            </li>
            <li>Warm or cold water fountain</li>
           
              <li>Adapted work schedule</li>
              <li>Adapted breaks (number and duration)</li>
              <li>Provision of drinks with a high mineral content</li>
              <li>Technical clothing adapted to the conditions</li>
            </ul>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-2</td>
          <td className="border p-4">
          <ul  className="ml-10">
          <li>Site roofing, ventilation, air-conditioned break room, curtains between workshops, etc.</li>
          <li>Technical clothing adapted to severe cold (multiple layers)</li>
          <li>Technical clothing adapted to thermal radiation or heat</li>
         </ul>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-3</td>
          <td className="border p-4">
          <ul  className="ml-10">
            <li>Air conditioning, heating, etc.</li>
            <li>Technical clothing adapted to very severe cold (multiple layers)</li>
            <li>Technical cooling clothing for severe heatwaves</li>
            <li>Moving away or insulation from the thermal radiation source</li>
          </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Optical = ({ residualRating, setResidualRating }: Props) => {
  const handleRowClick = (rating: number) => {
    setResidualRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Reduction of 
P</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
      <tr 
          onClick={() => handleRowClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-1</td>
          <td className="border p-4">
            <p>At least two procedural or organizational measures from:</p>
            See Mp-type matrix (generic table 4 of the method (generic part))
            <ul style={{ listStyleType: "circle" }} className="ml-10">
              <li>Laser:</li>
              <ul  className="ml-10">
                <li>Definition of exclusion zone, labelling (pictogram, etc.)</li>
                <li>Only an authorized person can order the radiation emission</li>
                <li>The beam is lower than eye level in seated position, removal of reflective objects (smooth,
                  shiny surfaces) and jewelry in the room</li>
                <li>Wearing of appropriate protective gloves and goggles</li>
                <li>Laser training, etc.</li>
              </ul>
              <li>UV:</li>
              <ul  className="ml-10">
                <li>Long-sleeved shirts, hat, sun cream, access to shade or indoor workplace during the
                  hottest hours of the day, etc.</li>
                <li>Welding training</li>
                <li>Marking off of the welding workplace, etc.</li>
              </ul>
              <li>IR:</li>
              <ul  className="ml-10">
                <li>Wearing IR protective goggles</li>
              </ul>
            </ul>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-2</td>
          <td className="border p-4">
          <ul style={{ listStyleType: "circle" }} className="ml-10">
            <li>Laser:</li>
            <ul  className="ml-10">
              <li>Special PPE: protective goggles adapted to the wavelength in question;</li>
              <li>special protective gloves, etc.</li>
            </ul>
            <li>UV:</li>
            <ul  className="ml-10">
              <li>Special PPE: welding goggles, special welding coverall and gloves, welding 
                guard, welding tent (to avoid additional exposure to solar rays), etc.</li>
            </ul>
            <li>IR:</li>
            <ul  className="ml-10">
              <li>Use of appropriate protective screens, visors and protective clothing,</li>
              <li>keeping an appropriate distance from the radiation source (marked off 
                exclusion zones), etc.</li>
            </ul>
          </ul>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-3</td>
          <td className="border p-4">
          <ul style={{ listStyleType: "circle" }} className="ml-10">
            <li>Laser:</li>
            <ul  className="ml-10">
              <li>Confinement of the laser beam</li>
              <li>Locking mechanism</li>
              <li>Emergency shutdown, etc.</li>
            </ul>
            <li>UV:</li>
            <ul  className="ml-10">
              <li>Automatic welding, etc.</li>
            </ul>
            <li>IR:</li>
            <ul  className="ml-10">
              <li>Confinement of the beam</li>
              <li>View holes for ovens</li>
              <li>Insulation of equipment, etc.</li>
            </ul>
          </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Electromagnetic = ({ residualRating, setResidualRating }: Props) => {
  const handleRowClick = (rating: number) => {
    setResidualRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Reduction of 
P</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
      <tr 
          onClick={() => handleRowClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-1</td>
          <td className="border p-4">
            <p>At least two procedural or organizational measures from:</p>
            <ul className="ml-10">
            <li>See Mp-type matrix</li>
            <li>Special signage for the zones exceeding the AV:</li>
            <li>Reduction in the intensity of the emission</li>
            <li>Moving away from the source or manual reduction of the intensity</li>
            <li>Reduction of the intensity when the operator is close to the emitting equipment (e.g. when 
              the furnace is being stoked).</li>
            <li>Verification of the intensity of the E field after any change to the workplace…</li>
            </ul>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-2</td>
          <td className="border p-4">
          <ul  className="ml-10">
            <li>Moving of the workplace (or equipment)</li>
            <li>Device reducing the intensity of the emission when the machine is being adjusted</li>
            <li>Placing of non-conductive furniture and work surfaces to avoid the circulation of currents 
                induced in metallic objects...</li>
         </ul>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-3</td>
          <td className="border p-4">
          <ul  className="ml-10">
            <li>Insulation of the emission source by shielding (metallic protection can serve as a Faraday 
              cage, metal rail panels...), etc.</li>
            
          </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const IonizingRadiation = ({ residualRating, setResidualRating }: Props) => {
  const handleRowClick = (rating: number) => {
    setResidualRating(rating);
  };

  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4">Reduction of 
P</th>
          <th className="border p-4">Description</th>
        </tr>
      </thead>
      <tbody>
      <tr 
          onClick={() => handleRowClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-1</td>
          <td className="border p-4">
            <p>At least two procedural or organizational measures from:</p>
            <ul style={{ listStyleType: "circle" }} className="ml-10">
              <li>Individual dosimetry for persons performing tasks who are likely to be exposed to ionizing 
                radiation or greater than 1 mSv. Measurement of an accredited body every year (+ report).</li>
              <li>Radiometer measurements.</li>
              <li>Adapted medical surveillance.</li>
              <li>Surface contamination tests.</li>
              <li>
                Radon: 
                <ul  className="ml-10">
                  <li>regular ventilation</li>
                  <li>measurements of exposition in the rooms…</li>
                </ul>
              </li>
              <li>
                NORM: 
                <ul  className="ml-10">
                  <li>indication of the location of the source with signs and/or markings</li>
                  <li>moving away of the source during the work</li>
                  <li>training of staff</li>
                  <li>operating mode available, etc.</li>
                </ul>
              </li>
              <li>
                Mobile sources: 
                <ul  className="ml-10">
                  <li>work performed at night or when the unit is closed</li>
                  <li>storage in a special room</li>
                  <li>insulation of the operator by means of a protective guard (e.g. concrete)</li>
                </ul>
              </li>
            </ul>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-2</td>
          <td className="border p-4">
          <ul style={{ listStyleType: "circle" }} className="ml-10">
            <li>
              Radon: 
              <ul  className="ml-10">
                <li>reinforcement of the natural ventilation or installation of adapted mechanical 
                  ventilation if more than 100 Bq/m3</li>
                <li>sealing of cracks and holes in and around pipes with 
                  silicone glue or cement</li>
                <li>placing of a membrane on a layer of chippings covered with a 
                  concrete slab, etc.</li>
              </ul>
            </li>
            <li>
              X-ray sources: 
              <ul className="ml-10">
                <li>anti-radiation coverall</li>
                <li>lead apron, etc.</li>
              </ul>
            </li>
          </ul>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-4">-3</td>
          <td className="border p-4">
          <ul  className="ml-10">
            <li>Radon: withdrawal from the inhabited space or the depressurization of the lower parts of the 
            building (any basement or crawl space), or the floor itself.</li>
            <li>X-ray sources: insulation of the operator by means of a lead-lined control panel in the 
protection room.
</li>
            
          </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const getCategoryComponent = (category: string) => {
  switch (category) {
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
    default:
      return null;
  }
};

export const ResidualRating = ({ residualRating, setResidualRating }: Props) => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(subCategory || subCategoryList.noise);

  if (!CategoryComponent) return null;
  
  return <CategoryComponent residualRating={residualRating} setResidualRating={setResidualRating} />;
};
