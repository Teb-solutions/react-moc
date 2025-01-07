export const TestTable = () => {
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
              Inhalation
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
          <tr>
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
          <tr>
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
          <tr>
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
          <tr>
            <td className="py-4 px-4 border border-gray-400 text-center font-bold">
              -1
            </td>
            <td className="py-4 px-4 border border-gray-400">
              - 10% OEL &lt; exposure measurements &lt; 50% OEL
            </td>
          </tr>
          <tr>
            <td className="py-4 px-4 border border-gray-400 text-center font-bold">
              -2
            </td>
            <td className="py-4 px-4 border border-gray-400">
              - Exposure measurements &lt; 10% OEL
            </td>
          </tr>
          <tr>
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
          <tr>
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
          <tr>
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
          <tr>
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
