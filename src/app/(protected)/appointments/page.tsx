import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Dialog } from "@/components/ui/dialog";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AddAppointmentButton } from "./_components/add-appointment-button";

const AppointmentsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session?.user.clinic) {
    redirect("/clinic-form");
  }

  const [patients, doctors] = await Promise.all([
    db.query.patientsTable.findMany({
      where: eq(patientsTable.clinicId, session.user.clinic.id),
      orderBy: [asc(patientsTable.name)],
    }),
    db.query.doctorsTable.findMany({
      where: eq(doctorsTable.clinicId, session.user.clinic.id),
      orderBy: [asc(doctorsTable.name)],
    }),
  ]);

  return (
    <Dialog>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Agendamentos</PageTitle>
            <PageDescription>
              Gerencie os agendamentos da sua clínica.
            </PageDescription>
          </PageHeaderContent>
          <PageActions>
            <AddAppointmentButton patients={patients} doctors={doctors} />
          </PageActions>
        </PageHeader>
        <PageContent>
          {/* Lista de agendamentos será implementada posteriormente */}
          <div className="text-center text-muted-foreground py-8">
            Lista de agendamentos será implementada em breve.
          </div>
        </PageContent>
      </PageContainer>
    </Dialog>
  );
};

export default AppointmentsPage;