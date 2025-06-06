import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import LoginForm from "./components/login-form";

const AuthenticationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    if (!session.user.clinic) {
      redirect("/clinic-form");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default AuthenticationPage;
