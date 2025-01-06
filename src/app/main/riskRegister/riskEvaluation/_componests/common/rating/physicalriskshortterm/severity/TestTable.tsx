export const TestTable = () => {
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
