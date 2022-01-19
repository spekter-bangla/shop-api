import { v4 } from "uuid";
import * as fs from "fs";
import { parse } from "csv-parse";
import { finished } from "stream/promises";
import { createObjectCsvWriter } from "csv-writer";
import toStream = require("buffer-to-stream");

export const parseCsv = async (buffer: Buffer) => {
  const records: any[] = [];
  const parser = toStream(buffer).pipe(
    parse({
      columns: true,
    }),
  );
  parser.on("readable", function () {
    let record;
    while ((record = parser.read()) !== null) {
      // Work with each record
      records.push(record);
    }
  });
  await finished(parser);
  return records;
};

export const writeCsv = async (data: any[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync("./csv")) {
        fs.mkdirSync("./csv");
      }
      const filePath = `./csv/${v4()}.csv`;
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: Object.keys(data[0]).map((h) => ({ id: h, title: h })),
      });

      csvWriter.writeRecords(data).then(() => {
        return resolve(filePath);
      });
    } catch (err) {
      return reject(err);
    }
  });
};
