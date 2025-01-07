import { subCategoryList, useSubCategoryStore } from "./PhysicalRiskNew";
import { TestTable } from "./TestTable";

const Vibration = () => {
  return (
    <table className="w-full border border-black border-collapse">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="p-4 border border-black">Rating</th>
          <th className="p-4 border border-black text-center">
            Vibrations (EU directive 2002/44/EC)
          </th>
          <th className="p-4 border border-black">Examples</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            className="p-4 border border-black text-center font-bold"
            rowSpan={2}
          >
            7
          </td>
          <td className="p-4 border border-black">Arm-hand &gt; 5 m/s2</td>
          <td className="p-4 border border-black">
            Hammers, jackhammers, perforators, brush cutters, power saws, etc.
          </td>
        </tr>
        <tr>
          <td className="p-4 border border-black">Whole body &gt; 1.15 m/s2</td>
          <td className="p-4 border border-black">Loader, etc.</td>
        </tr>
        <tr>
          <td
            className="p-4 border border-black  text-center font-bold"
            rowSpan={2}
          >
            3
          </td>
          <td className="p-4 border border-black">Arm-hand 2.5-5 m/s2</td>
          <td className="p-4 border border-black">
            Rotating machines (drills, grinders), etc.
          </td>
        </tr>
        <tr>
          <td className="p-4 border border-black">Whole body 0.5-1.15 m/s2</td>
          <td className="p-4 border border-black">
            Forklifts, trucks, road tractors (semitrailers), utility vehicles,
            clippers, (manual/electric) transpallets, etc.
          </td>
        </tr>
        <tr>
          <td
            className="p-4 border border-black  text-center font-bold"
            rowSpan={2}
          >
            1
          </td>
          <td className="p-4 border border-black">Arm-hand &lt; 2.5 m/s2</td>
          <td className="p-4 border border-black">
            Electric screwdrivers, etc.
          </td>
        </tr>
        <tr>
          <td className="p-4 border border-black">Whole body &lt; 0.5 m/s2</td>
          <td className="p-4 border border-black">
            Metro train, train, bus, car on road in good condition, etc.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Noise = () => {
  return (
    <table className="w-full border-1" cellSpacing={10} cellPadding={5}>
      <tbody>
        <tr className="w-full border-1 bg-blue-400 text-white">
          <td
            width="76"
            valign="top"
            style={{ border: "1px solid black" }}
            className="text-center"
          >
            <strong>Rating</strong> <strong>G</strong>
          </td>
          <td width="289" valign="top" style={{ border: "1px solid black" }}>
            <p style={{ textAlign: "left" }}>
              <strong>Noise level over 8 hours</strong>
            </p>
            <p style={{ textAlign: "left" }}>
              <strong>(EU directive 2003/10/EC)</strong>
            </p>
          </td>
          <td width="304" valign="top" style={{ border: "1px solid black" }}>
            <p style={{ textAlign: "left" }}>
              <strong>Examples</strong>
            </p>
          </td>
        </tr>
        <tr className="w-full border-1">
          <td
            width="76"
            valign="top"
            style={{ border: "1px solid black" }}
            className="text-center"
          >
            <strong>15</strong>
          </td>
          <td width="289" valign="top" style={{ border: "1px solid black" }}>
            <p style={{ textAlign: "left" }}>&gt; 87 dB(A) OR</p>
            <p style={{ textAlign: "left" }}>
              Peak sound pressure &gt; 140 dBC
            </p>
          </td>
          <td width="304" valign="top" style={{ border: "1px solid black" }}>
            Conversation impossible.
          </td>
        </tr>
        <tr>
          <td
            width="76"
            valign="top"
            style={{ border: "1px solid black" }}
            className="text-center"
          >
            <strong>7</strong>
          </td>
          <td width="289" valign="top" style={{ border: "1px solid black" }}>
            <p style={{ textAlign: "left" }}>85-87 dB(A) OR</p>
            <p style={{ textAlign: "left" }}>
              Peak sound pressure: 137-140 dBC
            </p>
          </td>
          <td width="304" valign="top" style={{ border: "1px solid black" }}>
            Working in conditions in which you have to shout to be heard at a
            distance of less than one meter from the other person, difficulty or
            inability to hear alarms.
          </td>
        </tr>
        <tr>
          <td
            width="76"
            valign="top"
            style={{ border: "1px solid black" }}
            className="text-center"
          >
            <strong>3</strong>
          </td>
          <td width="289" valign="top" style={{ border: "1px solid black" }}>
            <p style={{ textAlign: "left" }}>80 à 85 dB(A) OR</p>
            <p style={{ textAlign: "left" }}>
              Peak sound pressure: 135-137 dBC
            </p>
          </td>
          <td width="304" valign="top" style={{ border: "1px solid black" }}>
            Working in conditions in which you have to speak loudly to be heard
            at a distance of one meter from the other person.
          </td>
        </tr>
        <tr>
          <td
            width="76"
            valign="top"
            style={{ border: "1px solid black" }}
            className="text-center"
          >
            <strong>1</strong>
          </td>
          <td width="289" valign="top" style={{ border: "1px solid black" }}>
            <p style={{ textAlign: "left" }}>&gt; 80 dB(A) OR</p>
            <p style={{ textAlign: "left" }}>
              Peak sound pressure &lt; 135 dBC
            </p>
          </td>
          <td width="304" valign="top" style={{ border: "1px solid black" }}>
            Working in conditions in which you do not have to speak loudly to be
            heard at a distance of one meter from the other person.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Thermal = () => {
  return (
    <table className="border border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white ">
          <th className="border p-10">Rating</th>
          <th className="border p-10">
            Extreme temperatures and thermal radiation
          </th>
          <th className="border p-10 text-center">Remarks</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-4 text-center">15</td>
          <td className="border p-4">
            <p>
              The thermal environment and ambient environment make the task
              painful:
            </p>
            <ul className="list-disc list-inside">
              <li>T° &lt; -10°C or T° &gt; 40°C</li>
              <li>
                Wearing special coveralls with gloves, balaclava, special shoes
                (e.g. coveralls for blast furnaces)
              </li>
              <li>
                Thermal radiation: Immediate burning sensation Thermal flow*
                &gt; 10.4 kW/m²
              </li>
            </ul>
          </td>
          <td className="border p-4">
            <ul className="list-disc list-inside">
              <li>Negative cold room (- 18°C), blast furnace, etc.</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center">7</td>
          <td className="border p-4">
            <p>
              The thermal environment and ambient environment make the task
              difficult:
            </p>
            <ul className="list-disc list-inside">
              <li>- 10°C &lt; T° &lt; 10°C or 32°C &lt; T° &lt; 40°C</li>
              <li>High relative humidity: major perspiration</li>
              <li>Bad weather: monsoon, storm</li>
              <li>
                Wearing clothing that considerably hampers the work or clothing
                specially treated against radiation or humidity (e.g. SCBA,
                waterproof coveralls for high-pressure cleaning, chemical
                coveralls)
              </li>
              <li>
                Thermal radiation: Impossible to hold hands/face exposed to
                radiation for 2 mins. 2.5 kW/m² &lt; Thermal flow* &lt; 10.4
                kW/m²
              </li>
            </ul>
          </td>
          <td className="border p-4">
            <ul className="list-disc list-inside">
              <li>Hot or cold barren zone</li>
              <li>Steam cracking and refinery furnace</li>
              <li>Frost, heatwave, etc.</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center">3</td>
          <td className="border p-4">
            <p>
              The thermal environment and ambient environment make the task more
              difficult:
            </p>
            <ul className="list-disc list-inside">
              <li>10°C &lt; T° &lt; 18°C or 25°C &lt; T° &lt; 32°C</li>
              <li>Relative humidity: &lt; 30% or &gt; 70% (sweaty skin)</li>
              <li>Wind &gt; 35 km/h</li>
              <li>Bad weather: rain, etc.</li>
              <li>
                Wearing clothing that slightly hampers the work (e.g. disposable
                coveralls, cartridge-type respirator or powered air respirator,
                dust mask, airtight goggles, etc.)
              </li>
              <li>
                Thermal radiation: Hot sensation on the hands and face after 2-3
                mins. 1.6 kW/m² &lt; Thermal flow* &lt; 2.5 kW/m²
              </li>
            </ul>
          </td>
          <td className="border p-4">
            <ul className="list-disc list-inside">
              <li>
                Workplaces exposed to draughts, in front of a window, close to a
                heat source (catering, etc.), temperature variation, etc.
              </li>
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

const Electromagnetic = () => {
  return (
    <table className="border-collapse w-full">
      <thead>
        <tr className="bg-blue-400 text-white border border-white p-4">
          <th className="p-10 border">Rating</th>
          <th className="p-10">Electromagnetic fields (EMF)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-4 text-center align-middle font-bold">15</td>
          <td className="border p-4">
            EMF at values considerably higher than the health impact values*.
          </td>
        </tr>
        <tr>
          <td
            className="border p-4 text-center align-middle font-bold"
            rowSpan={5}
          >
            7
          </td>
          <td className="border p-4">
            EMF at values higher than the health impact values*.
          </td>
        </tr>
        <tr>
          <td className="border p-4">
            EMF at values higher than the values set for exposure of members of
            the general public at particular risk (people with an implanted
            device, pregnant person).
          </td>
        </tr>
        <tr>
          <td className="border p-4">EMF causing sparks.</td>
        </tr>
        <tr>
          <td className="border p-4">EMF generating contact currents.</td>
        </tr>
        <tr>
          <td className="border p-4">
            EMF causing attraction/repulsion of metallic materials.
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center align-middle font-bold">3</td>
          <td className="border p-4">
            EMF at values higher than the values that trigger action (AV**).
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center align-middle font-bold">1</td>
          <td className="border p-4">
            EMF at values lower than the impact values and the values that
            trigger action (AV**). Values set for the exposure of the general
            public.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const IonizingRadiation = () => {
  return (
    <div className="font-semibold">
      All radioelements are carcinogenic, G = 15.
    </div>
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

    // Add other categories here
    default:
      return null;
  }
};

export const SeverityRatingTable = () => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(
    subCategory || subCategoryList.noise
  );
  return <TestTable />;
  //   return <div>{CategoryComponent && <CategoryComponent />}</div>;
};
