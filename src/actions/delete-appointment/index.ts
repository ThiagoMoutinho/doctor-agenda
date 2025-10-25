"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { getClinicId } from "@/helpers/get-clinic-id";
import { actionClient } from "@/lib/next-safe-action";
import { z } from "zod";

const deleteAppointmentSchema = z.object({
  id: z.string().uuid(),
});

export const deleteAppointment = actionClient
  .schema(deleteAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;
    const clinicId = await getClinicId();

    if (!clinicId) {
      throw new Error("Clinic ID not found.");
    }

    // Verificar se o agendamento pertence à clínica
    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, id),
    });

    if (!appointment || appointment.clinicId !== clinicId) {
      throw new Error("Agendamento não encontrado ou não pertence à sua clínica.");
    }

    await db.delete(appointmentsTable).where(eq(appointmentsTable.id, id));

    revalidatePath("/appointments");
    return {
      message: "Agendamento excluído com sucesso!",
    };
  });
