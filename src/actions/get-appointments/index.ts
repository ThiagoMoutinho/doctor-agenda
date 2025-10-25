"use server";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { getClinicId } from "@/helpers/get-clinic-id";

export async function getAppointments() {
  const clinicId = await getClinicId();

  if (!clinicId) {
    throw new Error("Clinic ID not found.");
  }

  const appointments = await db.query.appointmentsTable.findMany({
    where: eq(appointmentsTable.clinicId, clinicId),
    orderBy: [asc(appointmentsTable.date)],
    with: {
      patient: true,
      doctor: true,
    },
  });

  return appointments;
}
