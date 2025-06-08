"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
});

const deleteDoctor = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;

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
      await db.delete(doctorsTable).where(eq(doctorsTable.id, id));

      revalidatePath("/(protected)/doctors");
      return { success: true };
    } catch (error) {
      console.error("Error deleting doctor:", error);
      throw new Error("Erro ao deletar médico");
    }
  });

export default deleteDoctor;
