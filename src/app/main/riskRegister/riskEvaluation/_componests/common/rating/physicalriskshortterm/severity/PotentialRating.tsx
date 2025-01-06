import { subCategoryList, useSubCategoryStore } from "../PhysicalRiskShortTerm";

const Noise = () => {
  return (
    <div>
      <h4 className="font-semibold px-10">
        The potential exposure probability P of exposure to noise when working
        in or close to a noisy workplace is 10.{" "}
      </h4>
    </div>
  );
};

const Vibration = () => {
  return (
    <div>
      <h4 className="font-semibold px-10">
        The potential exposure probability P of exposure to vibrations when
        working with a vibrating tool and when driving a truck, forklift or
        machinery, etc. is 10.
      </h4>
    </div>
  );
};

const Thermal = () => {
  return (
    <div>
      <h4 className="font-semibold px-10">
        {" "}
        The potential exposure probability P of exposure to extreme temperatures
        or thermal radiation when working in these conditions is 10.{" "}
      </h4>
    </div>
  );
};

const Optical = () => {
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
        <tr>
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
        <tr>
          <td className="p-4 border border-gray-400 font-bold text-center">
            6
          </td>
          <td className="p-4 border border-gray-400">
            <u>Tasks with unpredictable exposure</u> (e.g. worksite surveillance
            using laser, UV, IR technology, arc welding), etc.
          </td>
        </tr>
        <tr>
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

const Electromagnetic = () => {
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
        <tr className="border">
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
        <tr className="border">
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

const IonizingRadiation = () => {
  return (
    <>
      <p className="mb-20">
        The potential exposure probability of exposure to
        <strong className="mx-2">ionizing radiation</strong>
        when working with an unprotected/poorly protected radioactive source is
        <strong className="mx-2">10</strong>. Examples:
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
      <p className="mb-20">
        The potential probability of exposure to a{" "}
        <strong className="mx-2">sealed source</strong>inside a container in
        perfect condition is
        <strong className="mx-2">1</strong>, because the source is plated and
        shielded from the equipment, and the regulatory provisions also impose
        an obligation to indicate the location of the source with signs and/or
        markings, to train staff and to have a set operating mode, so the rating
        is reduced by 3 levels.
      </p>
      <p className="mb-20">
        The potential probability of exposure to a{" "}
        <strong className="mx-2">mobile source</strong>with a container, a
        collimator and insulation in perfect condition is{" "}
        <strong className="mx-2">3</strong>, because the source is shielded, the
        regulatory provisions impose an obligation to indicate the location of
        the source with signs and/or markings, to train staff and to have a set
        operating mode, but a potential residual exposure remains when the
        source is removed from the insulation for the radiographic inspection,
        so the rating is reduced by 2 levels.
      </p>
      <p>
        If the sealed or mobile source is no longer airtight, increase the
        probability level, based on the results of the surface contamination
        tests
      </p>
    </>
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

export const PotentialRatingTable = () => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(
    subCategory || subCategoryList.noise
  );

  return <div>{CategoryComponent && <CategoryComponent />}</div>;
};
