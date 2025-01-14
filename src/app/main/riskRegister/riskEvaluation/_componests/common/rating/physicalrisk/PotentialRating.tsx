import { subCategoryList, useSubCategoryStore } from "./PhysicalRiskNew";

interface Props {
  potentialRating: number | null;
  setPotentialRating: (rating: number | null) => void;
}

const Noise = ({ potentialRating, setPotentialRating }: Props) => {
  const handleClick = () => {
    setPotentialRating(10);
  };

  return (
    <table className="border-collapse border border-gray-400 w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="p-4 py-10 border border-gray-400">Rating</th>
          <th className="p-4 py-10 border border-gray-400">
            Probability of potential exposure to noise when working in or close
            to a noisy workplace
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? 'bg-blue-100' : ''}`}
          onClick={handleClick}
        >
          <td className="p-4 py-10 border border-gray-400 text-center font-bold">
            10
          </td>
          <td className="p-4 py-10 border border-gray-400">The potential exposure probability P of exposure to noise when working in or close to a noisy workplace is 10.</td>
        </tr>
      </tbody>
    </table>
  );
};

const Vibration = ({ potentialRating, setPotentialRating }: Props) => {
  const handleClick = () => {
    setPotentialRating(10);
  };

  return (
    <table className="border-collapse border border-gray-400 w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="p-4 py-10 border border-gray-400">Rating</th>
          <th className="p-4 py-10 border border-gray-400">
            Probability of potential exposure to vibrations when working with a
            vibrating tool and when driving a truck, forklift or machinery, etc.
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={handleClick}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="p-4 py-10 border border-gray-400">10</td>
          <td className="p-4 py-10 border border-gray-400">Working with a vibrating tool and when driving a truck, forklift or machinery, etc.</td>
        </tr>
      </tbody>
    </table>
  );
};

const Thermal = ({ potentialRating, setPotentialRating }: Props) => {
  const handleClick = () => {
    setPotentialRating(10);
  };

  return (
    <table className="border-collapse border border-gray-400 w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="p-4 py-10 border border-gray-400">Rating</th>
          <th className="p-4 py-10 border border-gray-400">
            Probability of potential exposure to extreme temperatures or
            thermal radiation when working in these conditions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={handleClick}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="p-4 py-10 border border-gray-400">10</td>
          <td className="p-4 py-10 border border-gray-400">
            The potential exposure probability P of exposure to extreme
            temperatures or thermal radiation when working in these conditions
            is 10.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Optical = ({ potentialRating, setPotentialRating }: Props) => {
  const handleRowClick = (rating: number) => {
    setPotentialRating(rating);
  };

  return (
    <table className="border-collapse border border-gray-400 w-full">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="p-4 py-10 border border-gray-400">Rating</th>
          <th className="p-4 py-10 border border-gray-400">
            Probability of potential exposure to a source of optical radiation
            (IR, visible, UV, laser)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleRowClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="p-4 border border-gray-400 font-bold text-center">
            10
          </td>
          <td className="p-4 border border-gray-400">
            <u>
              Tasks with direct contact with the source of optical radiation
              (IR, visible, UV, laser):
            </u>
            <ul>
              <li>Working outside (UV)</li>
              <li>Arc welding</li>
              <li>Use of a surgical light, etc.</li>
            </ul>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(6)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? 'bg-blue-100' : ''}`}
        >
          <td className="p-4 border border-gray-400 font-bold text-center">
            6
          </td>
          <td className="p-4 border border-gray-400">
            <u>Tasks with unpredictable exposure</u> (e.g. worksite surveillance
            using laser, UV, IR technology, arc welding), etc.
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="p-4 border border-gray-400 font-bold text-center">
            3
          </td>
          <td className="p-4 border border-gray-400">
            Use of laboratory equipment with laser, UV, IR technology, etc.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Electromagnetic = ({ potentialRating, setPotentialRating }: Props) => {
  const handleRowClick = (rating: number) => {
    setPotentialRating(rating);
  };

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white border">
          <th className="py-10 px-4 text-center font-bold border">Rating</th>
          <th className="py-10 px-4 text-center font-bold border">
            Probability of potential exposure to an EMF source
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? 'bg-blue-100' : ''} border`}
          onClick={() => handleRowClick(10)}
        >
          <td className="py-4 px-4 text-center font-bold border">10</td>
          <td className="py-4 px-4 border">
            <p>
              <u>Tasks with direct contact with the EMF source:</u>
            </p>
            <p>
              - Task working on electrical equipment that is switched on,
              high-voltage cables, induction heating, telecommunication
              equipment...
            </p>
            <p>- Task in the computer room...</p>
            <p>- Phone without hands-free mechanism...</p>
          </td>
        </tr>
        <tr 
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? 'bg-blue-100' : ''} border`}
          onClick={() => handleRowClick(6)}
        >
          <td className="py-4 px-4 text-center font-bold border">6</td>
          <td className="py-4 px-4 border">
            <p>
              All other tasks performed at a distance less than 3.2x the
              distance from the active field (see table 10).
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const IonizingRadiation = ({ potentialRating, setPotentialRating }: Props) => {
  const handleClick = (rating: number) => {
    setPotentialRating(rating);
  };

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          
          <th className="border py-[10px] px-4 text-center font-bold">
            Potential rating P
          </th>
          <th className="border py-[10px] px-4 text-center font-bold">
           Description
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          onClick={() => handleClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? 'bg-blue-100' : ''} border`}
        >
          
          <td className="py-4 px-4 text-center font-bold border">
            <strong className="mx-2">10</strong>
          </td>
          <td className="py-4 px-4 border">
            <p>
              The potential exposure probability of exposure to
              <strong className="mx-2">ionizing radiation</strong>
              when working with an unprotected/poorly protected radioactive source is
            </p>
            <p className="ml-10">
              ▪ Living in a granite region where exposure is more than 100 Bq/m³/life
              of Radon (check the map of the region, e.g.
            </p>
            <p className="ml-10">
              ▪ Manually cleaning a container that has held NORM (e.g. desalination
              machine during periodical maintenance).
            </p>
            <p className="ml-10">
              ▪ Taking the source from the container out of the insulation for use of
              a collimator or an X-ray inspection.
            </p>
            <p className="ml-10 mb-20">
              ▪ Taking the source out of the container while cleaning the container
              (HF unit)
            </p>
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 1 ? 'bg-blue-100' : ''} border`}
        >
         
          <td className="py-4 px-4 text-center font-bold border">
            <strong className="mx-2">1</strong>
          </td>
          <td className="py-4 px-4 border">
            <p>
              The potential probability of exposure to a{" "}
              <strong className="mx-2">sealed source</strong>inside a container in
              perfect condition is
            </p>
            <p>
              because the source is plated and shielded from the equipment, and the
              regulatory provisions also impose an obligation to indicate the
              location of the source with signs and/or markings, to train staff and
              to have a set operating mode, so the rating is reduced by 3 levels.
            </p>
          </td>
        </tr>
        <tr 
          onClick={() => handleClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? 'bg-blue-100' : ''} border`}
        >
          
          <td className="py-4 px-4 text-center font-bold border">
            <strong className="mx-2">3</strong>
          </td>
          <td className="py-4 px-4 border">
            <p>
              The potential probability of exposure to a{" "}
              <strong className="mx-2">mobile source</strong>with a container, a
              collimator and insulation in perfect condition is{" "}
            </p>
            <p>
              because the source is shielded, the regulatory provisions impose an
              obligation to indicate the location of the source with signs and/or
              markings, to train staff and to have a set operating mode, but a
              potential residual exposure remains when the source is removed from
              the insulation for the radiographic inspection, so the rating is
              reduced by 2 levels.
            </p>
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

export const PotentialRating = ({ potentialRating, setPotentialRating }: Props) => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(subCategory || subCategoryList.noise);

  if (!CategoryComponent) return null;
  
  return <CategoryComponent potentialRating={potentialRating} setPotentialRating={setPotentialRating} />;
};
