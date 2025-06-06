"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
});

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof loginSchema>) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: async () => {
          toast.success("Login realizado com sucesso");
          const session = await authClient.getSession();
          if (!session?.data?.user?.clinic) {
            router.push("/clinic-form");
          } else {
            router.push("/dashboard");
          }
        },
        onError: () => {
          toast.error("E-mail ou senha inválidos");
        },
      },
    );
  }

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <Card className="w-full max-w-[550px] p-2 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-7">
          <CardHeader className="px-8 pt-8">
            <h1 className="text-foreground text-[32px] font-semibold">
              Acesse sua conta
            </h1>
          </CardHeader>
          <CardContent className="space-y-6 px-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-base font-medium">
                    E-mail
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      className="bg-background placeholder:text-muted-foreground mt-2 h-12 rounded-lg px-4 text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground flex items-center justify-between text-base font-medium">
                    Senha
                    <Link
                      href="/esqueci-senha"
                      className="text-primary hover:text-primary/90 text-base"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        className="bg-background placeholder:text-muted-foreground mt-2 h-12 rounded-lg px-4 text-lg"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-5 right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-3">
              <Checkbox id="remember" className="border-input h-5 w-5" />
              <label
                htmlFor="remember"
                className="text-foreground text-base leading-none font-medium"
              >
                Lembrar de mim neste dispositivo
              </label>
            </div>

            <Button
              type="submit"
              className="h-12 w-full cursor-pointer text-lg font-medium"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background text-muted-foreground px-4 text-base">
                  OU
                </span>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              type="button"
              variant="outline"
              className="h-12 w-full cursor-pointer text-base font-medium"
            >
              <FcGoogle className="mr-3 h-6 w-6" />
              Entrar com o Google
            </Button>
          </CardContent>

          <CardFooter className="bg-primary/5 flex w-full justify-center rounded-lg py-5">
            <p className="text-foreground text-base">
              Novo por aqui?{" "}
              <Link
                href="/authentication/sign-up"
                className="text-primary hover:text-primary/80"
              >
                Crie uma conta
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
