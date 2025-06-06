"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertDoctorSchema } from "./schema";

dayjs.extend(utc);

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    console.log("Received input:", parsedInput);

    const { id, availableFromTime, availableToTime, ...rest } = parsedInput;

    const availableFromTimeUTC = dayjs()
      .set("hour", parseInt(availableFromTime.split(":")[0]))
      .set("minute", parseInt(availableFromTime.split(":")[1]))
      .set("second", 0)
      .utc();

    const availableToTimeUTC = dayjs()
      .set("hour", parseInt(availableToTime.split(":")[0]))
      .set("minute", parseInt(availableToTime.split(":")[1]))
      .set("second", 0)
      .utc();

    console.log("Parsed times:", {
      availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
      availableToTime: availableToTimeUTC.format("HH:mm:ss"),
    });

    if (availableFromTimeUTC.isAfter(availableToTimeUTC)) {
      throw new Error(
        "O horário de início deve ser anterior ao horário de término",
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (!session?.user.clinic?.id) {
      throw new Error("Clínica não encontrada");
    }

    try {
      await db
        .insert(doctorsTable)
        .values({
          id,
          ...rest,
          clinicId: session.user.clinic.id,
          availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
          availableToTime: availableToTimeUTC.format("HH:mm:ss"),
        })
        .onConflictDoUpdate({
          target: [doctorsTable.id],
          set: {
            ...rest,
            availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
            availableToTime: availableToTimeUTC.format("HH:mm:ss"),
          },
        });

      return { success: true };
    } catch (error) {
      console.error("Error upserting doctor:", error);
      throw new Error("Erro ao salvar médico");
    }
  });
