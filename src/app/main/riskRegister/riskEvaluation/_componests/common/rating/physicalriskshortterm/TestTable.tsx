export const TestTable = () => {
  return (
    <table className="w-full border-collapse border border-gray-400">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="py-10 px-4 border border-gray-400">Reduction of P</th>
          <th className="py-10 px-4 border border-gray-400">
            Means/measures of prevention/protection
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-4 px-4 border border-gray-400 text-center font-bold">
            -1
          </td>
          <td className="py-4 px-4 border border-gray-400">
            <p>
              <strong>
                At least two procedural or organizational measures from:
              </strong>
            </p>
            <p>- see Mp-type matrix;</p>
            <p>- apply golden rule 8;</p>
            <p>- have a permit to enter; implement an entry control process;</p>
            <p>
              - have a process for isolating product/pollutant arrivals;
              spot-check O2 levels and air pollutants;
            </p>
            <p>
              - Wear a cartridge mask adapted to the pollutant (except if O2
              level &lt; 19.5%);
            </p>
            <p>
              - monitor work in the vicinity of the confined space; have means
              of communication available;
            </p>
            <p>- limit the duration of the intervention;</p>
            <p>- have tested means of emergency evacuation, etc.</p>
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border border-gray-400 text-center font-bold">
            -2
          </td>
          <td className="py-4 px-4 border border-gray-400">
            <p>- Constantly check the atmosphere</p>
            <p>- Ensure continuous ventilation, etc.</p>
          </td>
        </tr>
        <tr>
          <td className="py-4 px-4 border border-gray-400 text-center font-bold">
            -3
          </td>
          <td className="py-4 px-4 border border-gray-400">
            <p>
              - Constantly check and continuously ventilate and have a permit
            </p>
            <p>
              - Physically disconnect the product/pollutant inlets on the
              capacity
            </p>
            <p>
              - Wear insulating breathing protection with air adduction for O2
              &lt; 19.5% and have the PPE certificates and staff aptitude
              certificates
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
