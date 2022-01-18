import { finished } from "stream/promises";
import { parse } from "csv-parse";
import toStream = require("buffer-to-stream");

export const parseCsv = async (buffer: Buffer) => {
  const records: any = [];
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
