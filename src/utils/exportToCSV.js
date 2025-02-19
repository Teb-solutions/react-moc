
import Papa from 'papaparse';
import dayjs from 'dayjs';
export const exportToCSV = (data, fields, filename) => {
  const selectedData = data.map(item => {
    const newItem = {};
    fields.forEach(field => {
      let value = item[field];
      // Check if the value is a date string and convert it
      if (dayjs(value, dayjs.ISO_8601, true).isValid()) {
        value = dayjs(value).format('DD-MM-YYYY'); // Change the format as needed
      }
      newItem[field] = value;
    });
    return newItem;
  });

  const csv = Papa.unparse(selectedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  // saveAs(blob, `${filename}.csv`);
  // Create a link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;

  // Append the link to the document body and click it to trigger the download
  document.body.appendChild(link);
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);
};