"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { getClinicId } from "@/helpers/get-clinic-id";
import { actionClient } from "@/lib/next-safe-action";

const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  email: z
    .string()
    .email({ message: "Email inválido." })
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .min(10, { message: "Telefone inválido." })
    .optional()
    .or(z.literal("")),
  sex: z
    .enum(["male", "female"], { message: "Selecione um sexo válido." })
    .optional()
    .or(z.literal("")),
});

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(
    async ({
      parsedInput,
    }: {
      parsedInput: z.infer<typeof upsertPatientSchema>;
    }) => {
      const clinicId = await getClinicId();

      if (!clinicId) {
        throw new Error("Clinic ID not found.");
      }

      const { id, name, email, phoneNumber, sex } = parsedInput;

      if (id) {
        // Update existing patient
        await db
          .update(patientsTable)
          .set({
            name,
            email: email === "" ? null : email,
            phoneNumber: phoneNumber === "" ? null : phoneNumber,
            sex: sex === "" ? null : sex,
            updatedAt: new Date(),
          })
          .where(eq(patientsTable.id, id));
      } else {
        // Create new patient
        await db.insert(patientsTable).values({
          clinicId,
          name,
          email: email === "" ? null : email,
          phoneNumber: phoneNumber === "" ? null : phoneNumber,
          sex: sex === "" ? null : sex,
        });
      }

      revalidatePath("/patients");
      return {
        message: id
          ? "Paciente atualizado com sucesso!"
          : "Paciente adicionado com sucesso!",
      };
    },
  );
