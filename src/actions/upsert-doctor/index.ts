"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertDoctorSchema } from "./schema";

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
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
      const { id, ...rest } = parsedInput;

      await db
        .insert(doctorsTable)
        .values({
          ...rest,
          id: id,
          clinicId: session.user.clinic.id,
        })
        .onConflictDoUpdate({
          target: [doctorsTable.id],
          set: rest,
        });

      return { success: true };
    } catch (error) {
      console.error("Error upserting doctor:", error);
      throw new Error("Erro ao salvar médico");
    }
  });
