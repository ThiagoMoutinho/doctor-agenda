"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const SingOutButton = () => {
  const router = useRouter();

  function handleSignOut() {
    authClient.signOut();
    router.push("/authentication");
  }
  return (
    <>
      <Button onClick={handleSignOut}>Sair</Button>
    </>
  );
};

export default SingOutButton;
