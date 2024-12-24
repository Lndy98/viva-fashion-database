import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx';

// szükséges könyvtár: npm install xlsx
@Injectable()
export class FileReaderUtil
{
    constructor(){}
    
    readExcel(event:any):any{
         // Olvasd be a fájl bináris tartalmát
      const binaryData: string = event.target.result;

      // Használd az xlsx csomagot az Excel fájl feldolgozására
      const workbook: XLSX.WorkBook = XLSX.read(binaryData, { type: 'binary' });

      // Az első munkalap beolvasása
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Az Excel tartalmának konvertálása JSON formátumba
      let jsonData : string[][]= XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      return jsonData;
    }

    transferJsonToObject<T>(jsonOfData: string[][], keys: (keyof T)[]): T[] {
    let output:T[] = jsonOfData.map((row) => {
        const obj: any = {};
        keys.map((key, index)=>{
            obj[key] = row[index];
        })
        return obj as T;
    });
    return output;
    }

    validateHeader<T>(header: string[], keys: (keyof T)[]): boolean {
        return keys.every((key) => header.includes(key as string));
    }

}