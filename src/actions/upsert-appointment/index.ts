"use server";

import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { getClinicId } from "@/helpers/get-clinic-id";
import { actionClient } from "@/lib/next-safe-action";

import { upsertAppointmentSchema } from "./schema";

export const upsertAppointment = actionClient
  .schema(upsertAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const { id, date, time, ...rest } = parsedInput;
    const clinicId = await getClinicId();

    if (!clinicId) {
      throw new Error("Clinic ID not found.");
    }

    // Combinar data e horário em um timestamp
    const appointmentDateTime = dayjs(date)
      .set("hour", parseInt(time.split(":")[0]))
      .set("minute", parseInt(time.split(":")[1]))
      .set("second", 0)
      .toDate();

    const appointmentData = {
      ...rest,
      clinicId,
      date: appointmentDateTime,
    };

    if (id) {
      // Atualizar agendamento existente
      await db
        .update(appointmentsTable)
        .set(appointmentData)
        .where(eq(appointmentsTable.id, id));
    } else {
      // Inserir novo agendamento
      await db.insert(appointmentsTable).values(appointmentData);
    }

    revalidatePath("/appointments");
    return {
      message: id
        ? "Agendamento atualizado com sucesso!"
        : "Agendamento adicionado com sucesso!",
    };
  });

export default upsertAppointment;