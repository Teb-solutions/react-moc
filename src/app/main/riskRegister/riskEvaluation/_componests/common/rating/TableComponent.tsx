import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const TableComponent = (ratingObj, rows) => {
  return (
    <TableContainer component={Paper}>
      <Table className="border-1">
        <TableHead className="bg-blue-100 text-white">
          <TableRow>
            {ratingObj?.header.map((head, index) => (
              <TableCell key={index}>{head}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow className="border-2" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="border" align="left">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
