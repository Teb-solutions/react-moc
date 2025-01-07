export const TestTable = () => {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4 py-10" rowSpan={2}>
            Reduction of P
          </th>
          <th className="border p-4 py-10" colSpan={3}>
            Means/measures of prevention/protection
          </th>
        </tr>
        <tr className="bg-blue-400 text-white">
          <th className="border p-4 py-10">
            Ambient temperature and relative humidity
          </th>
          <th className="border p-4 py-10">Noise</th>
          <th className="border p-4 py-10">Lighting</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-4 text-center font-bold">-1</td>
          <td className="border p-4">
            - Blind
            <br />
            - Hot/cold water fountain
            <br />
            - Ventilator
            <br />- Adjustable heating for the offices, etc.
          </td>
          <td className="border p-4">
            - Noise-cancelling headphones
            <br />
            - Have the occupants set the rules in an open-plan office
            <br />- Make spaces available for phoning, meetings in an open-plan
            office, etc.
          </td>
          <td className="border p-4">
            - Blind
            <br />- Additional light, etc.
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold">-2</td>
          <td className="border p-4">
            - Locations of thermal radiation sources away from employees, etc.
          </td>
          <td className="border p-4">
            - Acoustic partition in open-plan office
            <br />
            - Spacing of workspaces
            <br />- Remoteness of noisy machines, etc.
          </td>
          <td className="border p-4">
            - Restriction of radiating surfaces (screens, surface treatment,
            blinds, appropriate colours, etc.)
            <br />
            - Moving disturbing sources of light
            <br />- Introduction of supplementary light sources, etc.
          </td>
        </tr>
        <tr>
          <td className="border p-4 text-center font-bold">-3</td>
          <td className="border p-4">
            - Insulation/weather stripping, air-conditioning, enclosure,
            elimination of leaks that can create humidity, etc.
          </td>
          <td className="border p-4">
            - Partitions
            <br />- Enclosing noisy machines, etc.
          </td>
          <td className="border p-4">-</td>
        </tr>
      </tbody>
    </table>
  );
};
