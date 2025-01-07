import { subCategoryList, useSubCategoryStore } from "./ChemicalRisk";
import { TestTable } from "./TestTable"; // Update the path to the correct location of TestTable

const SafetyTable = () => {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4 py-10">G</th>
          <th className="border p-4 py-10">Safety hazard category</th>
          <th className="border p-4 py-10">Phrases H 2xx</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-4 text-center font-bold" rowSpan={8}>
            40
          </td>
          <td className="border p-4">Explosives cat. 1.1 to 1.5</td>
          <td className="border p-4">
            <strong>H200</strong> Unstable explosive,
            <br />
            <strong>H201</strong> Explosive: mass explosion hazard,
            <br />
            <strong>H202</strong> Explosive: serious projection hazard,
            <br />
            <strong>H203</strong> Explosive: fire, blast injury or projection
            hazard,
            <br />
            <strong>H204</strong> Fire or projection hazard,
            <br />
            <strong>H205</strong> Mass explosion hazard in the event of fire
          </td>
        </tr>
        <tr>
          <td className="border p-4">Flammable gas cat. 1 & 2 (e.g. LPG)</td>
          <td className="border p-4">
            <strong>H220</strong> Extremely flammable liquids,
            <br />
            <strong>H221</strong> Flammable gas
          </td>
        </tr>
        <tr>
          <td className="border p-4">Flammable aerosol cat. 1</td>
          <td className="border p-4">
            <strong>H222</strong> Extremely flammable aerosol
          </td>
        </tr>
        <tr>
          <td className="border p-4">
            Flammable liquids cat. 1 (ex. : High octane gasoline SP)
          </td>
          <td className="border p-4">
            <strong>H224</strong> Extremely flammable liquids and vapor
          </td>
        </tr>
        <tr>
          <td className="border p-4">Flammable gases</td>
          <td className="border p-4">
            <strong>H280</strong> Contains a pressurized gas; can explode under
            the influence of heat
          </td>
        </tr>
        <tr>
          <td className="border p-4">
            Self-reactive substances and mixtures cat. A/B
          </td>
          <td className="border p-4">
            <strong>H240</strong> Can explode under the influence of heat,
            <br />
            <strong>H241</strong> Can ignite under the influence of heat
          </td>
        </tr>
        <tr>
          <td className="border p-4">Organic peroxides cat. A/B</td>
          <td className="border p-4"></td>
        </tr>
        <tr>
          <td className="border p-4 text-center">
            Combustible powder substances suspended in the air (dust) cat. 1
          </td>
          <td className="border p-4">Diameter &lt; 50µm</td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold" rowSpan={5}>
            15
          </td>
          <td className="border p-4">Oxidizing gases cat. 1</td>
          <td className="border p-4">
            <strong>H270</strong> Can cause or aggravate a fire; oxidizer
          </td>
        </tr>
        <tr>
          <td className="border p-4">Oxidizing liquids cat. 1, 2 & 3</td>
          <td className="border p-4">
            <strong>H271</strong> Can cause a fire or an explosion; powerful
            oxidizer,
            <br />
            <strong>H272</strong> Can cause a fire; oxidizer
          </td>
        </tr>
        <tr>
          <td className="border p-4">Flammable liquids cat. 2</td>
          <td className="border p-4">
            <strong>H225</strong> Highly flammable liquid and vapor
          </td>
        </tr>
        <tr>
          <td className="border p-4">Flammable aerosol cat. 2</td>
          <td className="border p-4">
            <strong>H223</strong> Flammable aerosol
          </td>
        </tr>
        <tr>
          <td className="border p-4">Flammable solids cat. 1 & 2</td>
          <td className="border p-4">
            <strong>H228</strong> Flammable solid cat.
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold" rowSpan={7}></td>
          <td className="border p-4">Oxidizing solids cat. 1, 2 & 3</td>
          <td className="border p-4"></td>
        </tr>
        <tr>
          <td className="border p-4">
            Self-reactive substances and mixtures cat. C, D, E & F
          </td>
          <td className="border p-4">
            <strong>H242</strong> Can ignite under the influence of heat
          </td>
        </tr>
        <tr>
          <td className="border p-4">Pyrophoric liquids and solids</td>
          <td className="border p-4">
            <strong>H250</strong> Ignites spontaneously in contact with the air
          </td>
        </tr>
        <tr>
          <td className="border p-4">Self-heating substances and mixtures</td>
          <td className="border p-4">
            <strong>H251</strong> Self-heating matter; can ignite,
            <br />
            <strong>H252</strong> Self-heating matter in large quantities; can
            ignite
          </td>
        </tr>
        <tr>
          <td className="border p-4">
            Substances/mixtures that can release, in contact with water,
            flammable gases cat. 1, 2 & 3
          </td>
          <td className="border p-4">
            <strong>H260</strong> Releases, in contact with water, flammable
            gases that can ignite spontaneously,
            <br />
            <strong>H261</strong> Releases, in contact with water, flammable
            gases
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center">
            Organic peroxides cat. C, D, E & F
          </td>
          <td className="border p-4"></td>
        </tr>
        <tr>
          <td className="border p-4">Combustible dust cat. 2</td>
          <td className="border p-4">
            Diameter: 50-300µm
            <br />
            E.g. wood dust, polyethylene/polystyrene, methylcellulose,
            paraformaldehyde, epoxide resin, pigment, etc.
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold">7</td>
          <td className="border p-4 text-center">-</td>
          <td className="border p-4">-</td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold" rowSpan={2}>
            3
          </td>
          <td className="border p-4">
            Flammable liquids cat. 3 (E.g. gasoil, heating oil)
          </td>
          <td className="border p-4">
            <strong>H226</strong> Flammable liquids and vapor
          </td>
        </tr>
        <tr>
          <td className="border p-4">Combustible dust cat. 3</td>
          <td className="border p-4">
            Diameter: 300-500µm
            <br />
            E.g. wood dust, sulfur, carbon/carbon black, PVC, starch, etc.
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold" rowSpan={2}>
            1
          </td>
          <td className="border p-4">Liquids not subject to labeling</td>
          <td className="border p-4">No phrase H2xx.</td>
        </tr>
        <tr>
          <td className="border p-4 text-center">Dust</td>
          <td className="border p-4">Diameter &gt; 0.5mm</td>
        </tr>
      </tbody>
    </table>
  );
};

const HealthTable = () => {
  const scrollToTable = (tableId: string) => {
    const element = document.getElementById(tableId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
                scrollToTable("table1");
              }}
            >
              Severity rating G (general case)
            </a>
          </li>
          <li>
            <a
              href="#table2"
              className="text-blue-500 hover:underline  font-semibold text-lg"
              onClick={(e) => {
                e.preventDefault();
                scrollToTable("table2");
              }}
            >
              Severity rating G (particular case)
            </a>
          </li>
        </ul>
      </nav>
      <h2 className="my-10 underline">Severity rating G (general case)</h2>
      <table
        id="table1"
        className="w-full border-collapse border border-gray-400"
      >
        <thead className="bg-blue-400 text-white">
          <tr>
            <th className="py-2 px-4 border border-gray-400">G</th>
            <th className="py-2 px-4 border border-gray-400">
              Health hazard category
            </th>
            <th className="py-2 px-4 border border-gray-400">
              Phrases H 3xx and EUHxxx (CLP/GHS regulations)
            </th>
            <th className="py-2 px-4 border border-gray-400">Exposure path</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">
              3
            </td>
            <td className="py-1 px-4 border border-gray-400">
              Serious eye injuries and eye irritation cat. 1
            </td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>H318</strong> – Causes serious eye injuries
            </td>
            <td className="py-1 px-4 border border-gray-400"></td>
          </tr>
          <tr>
            <td
              className="py-1 px-4 border border-gray-400 text-center font-bold"
              rowSpan={7}
            >
              15
            </td>
            <td className="py-1 px-4 border border-gray-400">
              Acute toxicity cat. 4
            </td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>H302</strong> – Noxious if swallowed
              <br />
              <strong>H332</strong> – Noxious if inhaled
            </td>
            <td className="py-1 px-4 border border-gray-400" rowSpan={3}>
              mixed
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              Carcinogens cat. 1A &amp; 1B
            </td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>H350</strong> – Can cause cancer
              <br />
              <strong>H350i</strong> – Can cause an allergic skin reaction
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              Mutagens cat. 1A &amp; 1B
            </td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>H340</strong> – Causes serious genetic abnormalities
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              Reproductive toxicants cat 1A &amp; 1B
            </td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>H360</strong> – Can damage fertility or the unborn child
              <br />
              <strong>H360F</strong> – Can damage fertility.
              <br />
              <strong>H360D</strong> – Can damage the unborn child.
              <br />
              <strong>H360FD</strong> – Can damage fertility. Can damage the
              unborn child
              <br />
              <strong>H360Fd</strong> – Can damage fertility Likely to damage
              the unborn child
              <br />
              <strong>H360Df</strong> – Can damage the unborn child Likely to
              damage fertility
            </td>
            <td className="py-1 px-4 border border-gray-400" rowSpan={4}>
              mixed
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              STOT – single exposure cat. 1
            </td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>H370</strong> – Proven risk of serious effects on the
              organs
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              CMR dust and aerosols
            </td>
            <td className="py-1 px-4 border border-gray-400">
              Asbestos, FCR CMR, hardwood dust, diesel particles, soot, tar and
              pitch, some nanoparticles, mercury, lead, silica (quartz,
              cristobalite, tridymite…), chrome VI…
              <br />
              <strong>EUH207</strong> – Important! Contains cadmium - Hazardous
              fumes are formed during use.
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">Contains lead</td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>EUH201</strong> – Contains lead. Should not be used on
              surfaces liable to be chewed or sucked by children
              <br />
              <strong>EUH201A</strong> – Important! Contains lead
            </td>
          </tr>
          <tr>
            <td
              className="py-1 px-4 border border-gray-400 text-center font-bold"
              rowSpan={14}
            >
              7
            </td>
            <td className="py-1 px-4 border border-gray-400">
              Acute toxicity cat. 3
            </td>
            <td className="py-1 px-4 border border-gray-400">
              H301 – Toxic if swallowed
              <br />
              H331 – Toxic if inhaled
              <br />
              EUH029 – Contact with water releases a toxic gas
              <br />
              EUH031 – Contact with acids releases a toxic gas
            </td>
            <td className="py-1 px-4 border border-gray-400">mixed</td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              Respiratory or skin sensitizers cat. 1
            </td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>H334</strong> – Can cause allergic symptoms or asthma or
              breathing difficulties if inhaled
            </td>
            <td className="py-1 px-4 border border-gray-400">inhalation</td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              Carcinogens cat. 2
            </td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>H351</strong> – Likely to cause cancer
            </td>
            <td className="py-1 px-4 border border-gray-400" rowSpan={3}>
              mixed
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              Mutagens cat. 2
            </td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>H341</strong> – Likely to cause serious genetic
              abnormalities
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              Reproductive toxicants cat. 2
            </td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>H361</strong> – Likely to damage fertility or the unborn
              child
              <br />
              <strong>H361f</strong> – Likely to damage fertility
              <br />
              <strong>H361d</strong> – Likely to damage the unborn child
              <br />
              <strong>H361fd</strong> – Likely to damage fertility and the
              unborn child
              <br />
              <strong>H362</strong> – Can be noxious for babies feeding on
              breastmilk
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              STOT* – single exposure cat. 2
            </td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>H371</strong> – Presumed risk of serious effects on the
              organs
            </td>
            <td className="py-1 px-4 border border-gray-400">mixed</td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              STOT – repeated exposure cat. 1 & 2
            </td>
            <td className="py-1 px-4 border border-gray-400">
              <strong>H372</strong> – Proven risk of serious effects on the
              organs following repeated or prolonged exposure
              <br />
              <strong>H373</strong> – Presumed risk of serious effects on the
              organs following repeated or prolonged exposure
            </td>
            <td className="py-1 px-4 border border-gray-400" rowSpan={2}>
              mixed
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              Toxic if inhaled
            </td>
            <td className="py-1 px-4 border border-gray-400">
              H304 – May be fatal if swallowed and enters airways
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">Corrosion</td>
            <td className="py-1 px-4 border border-gray-400">
              EUH071 – Corrosive for the airways
            </td>
            <td>inhalation</td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              Alveolar dust without specific effect and aerosols
            </td>
            <td className="py-1 px-4 border border-gray-400">
              Fiber less than 5µm, ceramic/vegetable fiber… Fumes: paraffin,
              bitumen... Oil spray, machining with oil, cutting oils... Sanding,
              grinding products...
            </td>
            <td>-</td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400">
              Acute toxicity cat. 3
            </td>
            <td className="py-1 px-4 border border-gray-400">
              H311 – Toxic in contact with skin EUH 070 – Toxic in contact with
              eyes
            </td>
            <td rowSpan={3}>Skin</td>
          </tr>

          <tr>
            <td className="py-1 px-4 border border-gray-400">
              Skin corrosion Skin irritation cat. 1ABC
            </td>
            <td className="py-1 px-4 border border-gray-400">
              H314 – Serious skin burns and eye injuries EUH202 – Cyanoacrylate
              - Hazard - Bonds skin and eyes in seconds. Keep out of the reach
              of children
            </td>
          </tr>
          <tr>
            <td className="py-4 px-4 border border-gray-400 text-center ">
              Respiratory or skin sensitizers cat. 1
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <strong>H317</strong> – Can cause a skin allergy
              <br />
              <strong>EUH203</strong> – Contains chromium VI - Can cause an
              allergic reaction
              <br />
              <strong>EUH204</strong> – Contains isocyanates. Can cause an
              allergic reaction
              <br />
              <strong>EUH205</strong> – Contains epoxydic compounds. Can cause
              an allergic reaction
              <br />
              <strong>EUH208</strong> – Contains “name of sensitizing substance”
              <br />- Can cause an allergic reaction
            </td>
          </tr>
          <tr>
            <td className="py-4 px-4 border border-gray-400 text-center ">
              Serious eye injuries and eye irritation cat. 1
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <strong>H318</strong> – Causes serious eye injuries
            </td>
          </tr>
          <tr>
            <td
              className="py-4 px-4 border border-gray-400 text-center font-bold"
              rowSpan={7}
            >
              3
            </td>
            <td className="py-4 px-4 border border-gray-400">
              Acute toxicity cat. 4
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <strong>H302</strong> – Noxious if swallowed
              <br />
              <strong>H332</strong> – Noxious if inhaled
            </td>
            <td className="py-4 px-4 border border-gray-400" rowSpan={3}>
              mixed
            </td>
          </tr>
          <tr>
            <td className="py-4 px-4 border border-gray-400" rowSpan={2}>
              STOT – single exposure cat 3
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <strong>H335</strong> – Can irritate the airways
            </td>
          </tr>
          <tr>
            <td className="py-4 px-4 border border-gray-400">
              <strong>H336</strong> – Can cause drowsiness or dizziness
            </td>
          </tr>
          <tr>
            <td className="py-4 px-4 border border-gray-400">
              Breathable dust without specific effect
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <strong>Fibre greater than 5µm,</strong>
              <br />
              glass/rock fibre, stone/brick/concrete/composite/graphite dust...
              combustion fumes...
            </td>
          </tr>
          <tr>
            <td className="py-4 px-4 border border-gray-400">
              Acute toxicity cat. 4
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <strong>H312</strong> – Noxious in contact with the skin
            </td>
            <td className="py-4 px-4 border border-gray-400" rowSpan={3}>
              skin
            </td>
          </tr>
          <tr>
            <td className="py-4 px-4 border border-gray-400">
              Skin corrosion Skin irritation cat. 2
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <strong>H315</strong> – Causes skin irritation
              <br />
              <strong>EUH066</strong> – Repeated exposure can cause skin dryness
              or cracking
            </td>
          </tr>
          <tr>
            <td className="py-4 px-4 border border-gray-400">
              Serious eye injuries and eye irritation cat. 2
            </td>
            <td className="py-4 px-4 border border-gray-400">
              <strong>H319</strong> – Causes serious eye irritation
            </td>
          </tr>
          <tr>
            <td className="py-4 px-4 border border-gray-400 text-center font-bold">
              1
            </td>
            <td className="py-4 px-4 border border-gray-400">
              Unlabeled substances and mixtures
            </td>
            <td className="py-4 px-4 border border-gray-400">
              No OEL. If OEL, see § 3.2
            </td>
            <td className="py-4 px-4 border border-gray-400">mixed</td>
          </tr>
        </tbody>
      </table>

      <h2 className="my-10 underline"> Severity rating G (particular case)</h2>
      <table
        id="table2"
        className="w-full border-collapse border border-gray-400"
      >
        <thead className="bg-blue-400 text-white">
          <tr>
            <th className="py-10 px-4 border border-gray-400">G</th>
            <th className="py-10 px-4 border border-gray-400">OEL</th>
            <th className="py-10 px-4 border border-gray-400">
              Note the units!
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">
              40
            </td>
            <td className="py-1 px-4 border border-gray-400">
              OEL &lt; 0.1mg/m3
            </td>
            <td className="py-1 px-4 border border-gray-400" rowSpan={5}>
              <strong>mg/m</strong>
              <strong>3</strong>= (molar mass/V) x ppm
              <br />
              <strong>ppm</strong>= (V/molar mass) x mg/m3 where:
              <br />
              V: 24.05 at 20°C and atmospheric pressure
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">
              15
            </td>
            <td className="py-1 px-4 border border-gray-400">
              0.1 &lt; OEL &lt; 1mg/m3
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">
              7
            </td>
            <td className="py-1 px-4 border border-gray-400">
              1 &lt; OEL &lt; 10mg/m3
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">
              3
            </td>
            <td className="py-1 px-4 border border-gray-400">
              10 &lt; OEL &lt; 100mg/m3
            </td>
          </tr>
          <tr>
            <td className="py-1 px-4 border border-gray-400 text-center font-bold">
              1
            </td>
            <td className="py-1 px-4 border border-gray-400 text-center">-</td>
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

export const SeverityRatingTable = () => {
  const { subCategory } = useSubCategoryStore();
  const CategoryComponent = getCategoryComponent(
    subCategory || subCategoryList.health
  );
  return <TestTable />;
  return <div>{CategoryComponent && <CategoryComponent />}</div>;
};
