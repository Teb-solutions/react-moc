import { subCategoryList, useSubCategoryStore } from "./ChemicalRisk";
import { TestTable } from "./TestTable";

interface Props {
  residualRating: number | null;
  setResidualRating: (rating: number | null) => void;
}

const SafetyTable = ({ residualRating, setResidualRating }: Props) => {
  const handleRowClick = (rating: number) => {
    setResidualRating(rating);
  };

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border py-2 px-4" rowSpan={2}>
            Reduction of P
          </th>
          <th className="border py-2 px-4" colSpan={3}>
            Means/measures of prevention/protection
          </th>
        </tr>
        <tr className="bg-blue-400 text-white">
          <th className="border py-2 px-4">
            Ambient temperature and relative humidity
          </th>
          <th className="border py-2 px-4">Noise</th>
          <th className="border py-2 px-4">Lighting</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleRowClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center font-bold">-1</td>
          <td className="border py-4 px-4">
            - Blind
            <br />
            - Hot/cold water fountain
            <br />
            - Ventilator
            <br />- Adjustable heating for the offices, etc.
          </td>
          <td className="border py-4 px-4">
            - Noise-cancelling headphones
            <br />
            - Have the occupants set the rules in an open-plan office
            <br />- Make spaces available for phoning, meetings in an open-plan
            office, etc.
          </td>
          <td className="border py-4 px-4">
            - Blind
            <br />- Additional light, etc.
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center font-bold">-2</td>
          <td className="border py-4 px-4">
            - Locations of thermal radiation sources away from employees, etc.
          </td>
          <td className="border py-4 px-4">
            - Acoustic partition in open-plan office
            <br />
            - Spacing of workspaces
            <br />- Remoteness of noisy machines, etc.
          </td>
          <td className="border py-4 px-4">
            - Restriction of radiating surfaces (screens, surface treatment,
            blinds, appropriate colours, etc.)
            <br />
            - Moving disturbing sources of light
            <br />- Introduction of supplementary light sources, etc.
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center font-bold">-3</td>
          <td className="border py-4 px-4">
            - Insulation/weather stripping, air-conditioning, enclosure,
            elimination of leaks that can create humidity, etc.
          </td>
          <td className="border py-4 px-4">
            - Partitions
            <br />
            - Enclosing noisy machines, etc.
          </td>
          <td className="border py-4 px-4"></td>
        </tr>
      </tbody>
    </table>
  );
};

const HealthTable = ({ residualRating, setResidualRating }: Props) => {
  const handleRowClick = (rating: number) => {
    setResidualRating(rating);
  };

  return (
    <>
      <nav className="mb-4">
        <ul className="flex flex-col">
          <li>
            <a
              href="#table1"
              className="text-blue-500 hover:underline font-semibold text-lg"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("table1");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Inhalation
            </a>
          </li>
          <li>
            <a
              href="#table2"
              className="text-blue-500 hover:underline  font-semibold text-lg"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("table2");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Contact with skin
            </a>
          </li>
        </ul>
      </nav>
      <h2 className="my-10 underline">
        {" "}
        Residual potential exposure probability rating by Inhalation
      </h2>
      <table
        id="table1"
        className="w-full border-collapse border border-gray-400"
      >
        <thead className="bg-blue-400 text-white">
          <tr>
            <th className="py-10 px-4 border border-gray-400">
              Reduction of P
            </th>
            <th className="py-10 px-4 border border-gray-400">
              Means/measures of prevention/protection against the chemical risk
              by inhalation
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            onClick={() => handleRowClick(-1)}
            className={`cursor-pointer hover:bg-gray-100 ${residualRating === -1 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-4 px-4 border border-gray-400 text-center font-bold">
              -1
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <strong>
                At least two procedural or organizational measures from:
              </strong>
              <ul>
                <li>See Mp-type matrix,</li>
                <li>cartridge-type respirator,</li>
                <li>move away vents in the direction of the dominant wind,</li>
                <li>rotation of staff at service station,</li>
                <li>presence of detection and alert systems etc.</li>
              </ul>
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(-2)}
            className={`cursor-pointer hover:bg-gray-100 ${residualRating === -2 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-4 px-4 border border-gray-400 text-center font-bold">
              -2
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <ul>
                <li>Temporary collective protection,</li>
                <li>
                  pulsed air, positive pressure breathing apparatus,
                  chemical-resistant gloves,
                </li>
                <li>self-service at the service station,</li>
                <li>VRU1.</li>
              </ul>
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(-3)}
            className={`cursor-pointer hover:bg-gray-100 ${residualRating === -3 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-4 px-4 border border-gray-400 text-center font-bold">
              -3
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <ul>
                <li>
                  Operating methods in place and site verification (application
                  and effectiveness) AND high-level PPE (self-contained
                  breathing apparatus, totally encapsulated suit, specific
                  chemical resistance gloves to ensure prevention of diffusion
                  through the glove).
                </li>
                <li>
                  Permanent CPE (VRU1 and VRU2, magnetic gauge, stop measuring
                  the volumeter rate with a level gauge, water-tightness of the
                  electrical conduits between the volumeter and the cash
                  register, etc.).
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <table className="w-full border-collapse border border-gray-400">
        <thead className="bg-blue-400 text-white">
          <tr>
            <th className="py-10 px-4 border border-gray-400">
              Reduction of P
            </th>
            <th className="py-10 px-4 border border-gray-400">
              Means/measures of prevention/protection against the chemical risk
              by inhalation
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            onClick={() => handleRowClick(-1)}
            className={`cursor-pointer hover:bg-gray-100 ${residualRating === -1 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-4 px-4 border border-gray-400 text-center font-bold">
              -1
            </td>
            <td className="py-4 px-4 border border-gray-400">
              - 10% OEL &lt; exposure measurements &lt; 50% OEL
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(-2)}
            className={`cursor-pointer hover:bg-gray-100 ${residualRating === -2 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-4 px-4 border border-gray-400 text-center font-bold">
              -2
            </td>
            <td className="py-4 px-4 border border-gray-400">
              - Exposure measurements &lt; 10% OEL
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(-3)}
            className={`cursor-pointer hover:bg-gray-100 ${residualRating === -3 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-4 px-4 border border-gray-400 text-center font-bold">
              -3
            </td>
            <td className="py-4 px-4 border border-gray-400">
              - Exposure measurements ~ RTV
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="my-10 underline">
        {" "}
        Residual potential exposure probability rating by contact with the skin
      </h2>
      <table
        id="table2"
        className="w-full border-collapse border border-gray-400"
      >
        <thead className="bg-blue-400 text-white">
          <tr>
            <th className="py-10 px-4 border border-gray-400">
              Reduction of P
            </th>
            <th className="py-10 px-4 border border-gray-400">
              Means/measures of prevention/protection against the chemical risk
              through skin contact
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            onClick={() => handleRowClick(-1)}
            className={`cursor-pointer hover:bg-gray-100 ${residualRating === -1 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-4 px-4 border border-gray-400 text-center font-bold">
              -1
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <strong>
                At least two procedural or organizational measures from:
              </strong>
              <ul>
                <li>See Mp-type matrix,</li>
                <li>
                  Adapted gloves, work trousers, long-sleeved work jacket,
                  product-resistant security shoes, face screen,
                </li>
                <li>Wash hands, do not eat on site, etc.</li>
              </ul>
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(-2)}
            className={`cursor-pointer hover:bg-gray-100 ${residualRating === -2 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-4 px-4 border border-gray-400 text-center font-bold">
              -2
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <ul>
                <li>
                  Device to check quality, cleanliness and/or effectiveness of
                  PPE (provision of spare PPE, periodic inspection of masks and
                  cartridges, etc.).
                </li>
              </ul>
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(-3)}
            className={`cursor-pointer hover:bg-gray-100 ${residualRating === -3 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-4 px-4 border border-gray-400 text-center font-bold">
              -3
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <ul>
                <li>
                  Airtight coveralls and procedure and training for putting on
                  and taking off contaminated clothing etc.
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

const getCategoryComponent = (subCategory: string) => {
  switch (subCategory) {
    case subCategoryList.health:
      return HealthTable;
    case subCategoryList.safety:
      return SafetyTable;
    default:
      return null;
  }
};

export const ResidualRatingTable = ({ residualRating, setResidualRating }: Props) => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(subCategory || subCategoryList.health);

  if (!CategoryComponent) return null;

  return <CategoryComponent residualRating={residualRating} setResidualRating={setResidualRating} />;
};
