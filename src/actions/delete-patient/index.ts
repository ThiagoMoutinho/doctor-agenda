"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { getClinicId } from "@/helpers/get-clinic-id";
import { actionClient } from "@/lib/next-safe-action";

import { deletePatientSchema } from "./schema";

const deletePatient = actionClient
  .schema(deletePatientSchema)
  .action(async ({ parsedInput: { id } }) => {
    const clinicId = await getClinicId();

    await db
      .delete(patientsTable)
      .where(
        and(eq(patientsTable.id, id), eq(patientsTable.clinicId, clinicId)),
      );

    revalidatePath("/patients");
  });

export default deletePatient;
