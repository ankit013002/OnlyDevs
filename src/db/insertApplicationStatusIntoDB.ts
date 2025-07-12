import { ApplicationStatusPayloadType } from "./acceptApplication";
import { db } from "./database";
import { applicationStatusTable, InsertApplicationStatus } from "./schema";

export default async function InsertApplicationStatusIntoDB(
  data: InsertApplicationStatus
) {
  const res = await db.insert(applicationStatusTable).values(data);
  return res;
}
