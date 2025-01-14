import { subCategoryList, useSubCategoryStore } from "./ChemicalRisk";
import { TestTable } from "./TestTable";

interface Props {
  potentialRating: number | null;
  setPotentialRating: (rating: number | null) => void;
}

const SafetyTable = ({ potentialRating, setPotentialRating }: Props) => {
  const handleRowClick = (rating: number) => {
    setPotentialRating(rating);
  };

  return (
    <div className="mx-10">
      <p className="font-semibold mb-10">P depends on:</p>
      <div className="mx-10">
        <li>
          The daily quantity available at the workplace or the concentration of
          dust in the space in question;
        </li>
        <li>The storage (proximity of incompatible products);</li>
        <li>
          The physical state of the product at the working temperature
          (flashpoint of liquids, grain size of suspended dust, gas); The
          process (dispersive or non-dispersive: open, closed openable, closed
          for liquids, confined or non-confined for dust);
        </li>
        <li>The sources of inflammation close to the workplace;</li>
        <li>
          The conditions of use (e.g. friction of polymers against the loading
          chute produces static electricity);
        </li>
        <li>
          The presence of an explosive atmosphere: sufficient mixture of air and
          combustible gas/vapor/fog/dust;
        </li>
        <li>
          The existing, maintained ventilation or capture systems, the existing
          fixed storage conditions.
        </li>
      </div>
    </div>
  );
};

const HealthTable = ({ potentialRating, setPotentialRating }: Props) => {
  const handleRowClick = (rating: number) => {
    setPotentialRating(rating);
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
              className="text-blue-500 hover:underline font-semibold text-lg"
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
      <h2 className="my-10 underline">Potential exposure probability by Inhalation</h2>
      <table id="table1" className="w-full border-collapse border border-gray-400">
        <thead className="bg-blue-400 text-white">
          <tr>
            <th className="py-10 px-4 border border-gray-400">P</th>
            <th className="py-10 px-4 border border-gray-400">
              Potential exposure probability by inhalation
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            onClick={() => handleRowClick(10)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">10</td>
            <td className="py-1 px-4 border border-gray-400 text-center">
              S inhalation &gt; 50
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(6)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">6</td>
            <td className="py-1 px-4 border border-gray-400 text-center">
              10 &lt; S inhalation ≤ 50
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(3)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">3</td>
            <td className="py-1 px-4 border border-gray-400 text-center">
              1 &lt; S inhalation ≤ 10
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(1)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 1 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">1</td>
            <td className="py-1 px-4 border border-gray-400 text-center">
              0.5 &lt; S inhalation ≤ 1
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(0.5)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 0.5 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">0.5</td>
            <td className="py-1 px-4 border border-gray-400 text-center">
              0.1 &lt; S inhalation ≤ 0.5
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(0.2)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 0.2 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">0.2</td>
            <td className="py-1 px-4 border border-gray-400 text-center">
              0.001 &lt; S inhalation ≤ 0.1
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(0.1)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 0.1 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">0.1</td>
            <td className="py-1 px-4 border border-gray-400 text-center">
              S inhalation ≤ 0.001
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="my-10 underline">Potential exposure probability by contact with the skin</h2>
      <table id="table2" className="w-full border-collapse border border-gray-400">
        <thead className="bg-blue-400 text-white">
          <tr>
            <th className="py-10 px-4 border border-gray-400">P</th>
            <th className="py-10 px-4 border border-gray-400">
              Potential exposure probability through the skin
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            onClick={() => handleRowClick(10)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">10</td>
            <td className="py-1 px-4 border border-gray-400">
              Immersion of part of the body in the product. E.g. manually
              placing or removing pieces in chemical product baths, rinsing
              operations, degreasing.
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(6)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">6</td>
            <td className="py-1 px-4 border border-gray-400">
              Possible contact with part of the body (two hands, legs,
              body/face) during the task. E.g. sampling, drainage, product
              transfer.
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(3)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">3</td>
            <td className="py-1 px-4 border border-gray-400">
              Possible contact with the hand during the task. E.g. cleaning with
              soaked cloth, handling of tools contaminated by a product.
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(1)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 1 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">1</td>
            <td className="py-1 px-4 border border-gray-400">
              Possible splashes/occasional skin contact (marks, droplets, etc.).
              E.g. projection of drops during pouring, projection of oil sprays
              by rotating machines.
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(0.5)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 0.5 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">0.5</td>
            <td className="py-1 px-4 border border-gray-400">
              Possible splashes/occasional skin contact (marks, droplets, etc.).
              E.g. projection of drops during pouring, projection of oil sprays
              by rotating machines.
            </td>
          </tr>
          <tr 
            onClick={() => handleRowClick(0.2)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 0.2 ? 'bg-blue-100' : ''}`}
          >
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">0.2</td>
            <td className="py-1 px-4 border border-gray-400">
              No possibility of contact between skin and product.
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

export const PotentialRatingTable = ({ potentialRating, setPotentialRating }: Props) => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(subCategory || subCategoryList.health);

  if (!CategoryComponent) return null;

  return <CategoryComponent potentialRating={potentialRating} setPotentialRating={setPotentialRating} />;
};
