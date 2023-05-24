import { ReactNode } from 'react';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

interface ExportCSVProps<T> {
  csvData: T[];
  fileName: string;
  children?: ReactNode;
  //onPrepareData?: (exportedData: T[]) => [Partial<{ [Key in keyof T]: T[Key] }>];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPrepareData?: any;
}

const ExportCSV = <T,>({ csvData, fileName, children, onPrepareData }: ExportCSVProps<T>) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (dataArray: T[], fileNameIn: string) => {
    let dataToExport: ExportCSVProps<T>['onPrepareData'] | [] = [];
    if (onPrepareData) dataToExport = onPrepareData([...dataArray]);
    if (dataToExport?.length > 0) {
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      // // Define data types for specific columns
      // ws.B1.t = 's'; // Column B as number data type
      // ws.B2.t = 's'; // Column C as string data type
      //       var range = XLSX.utils.decode_range(worksheet["!ref"]);
      // for(var C = 2; C <= 5; ++C) { // "C" -> 2 ... "F" -> 5
      //   for(var R = range.s.r; R <= range.e.r; ++R) {
      //     var addr = XLSX.utils.encode_cell({r:R, c:C});
      //     if(worksheet[addr] && worksheet[addr].t != "n" && worksheet[addr].v) {
      //       worksheet[addr].t = "n"; worksheet[addr].v = Number(n);
      //     }
      //   }
      // }
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileNameIn + fileExtension);
    }
  };

  return <div onClick={() => exportToCSV(csvData, fileName)}>{children}</div>;
};

export default ExportCSV;
