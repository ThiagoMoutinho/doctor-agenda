import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";

import LoginForm from "./components/login-form";

const AuthenticationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Tabs defaultValue="login" className="w-full max-w-[580px] shadow-lg">
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationPage;
