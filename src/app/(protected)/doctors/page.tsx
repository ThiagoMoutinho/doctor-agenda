import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader, 
  PageHeaderContent, 
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const DoctorsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session?.user.clinic) {
    redirect("/clinic-form");
  }
  

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button className="cursor-pointer">
            <PlusIcon className="h-4 w-4" />
            Novo médico
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="flex flex-col gap-4">Médicos</div>
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
