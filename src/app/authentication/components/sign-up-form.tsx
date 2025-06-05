"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Nome é obrigatório" })
      .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
    email: z
      .string()
      .trim()
      .min(1, { message: "Email é obrigatório" })
      .email({ message: "Email inválido" }),
    password: z
      .string()
      .trim()
      .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export default function SignUpForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      await authClient.signUp.email(
        {
          name: values.name,
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: () => {
            toast.success("Conta criada com sucesso");
            router.push("/dashboard");
          },
          onError: () => {
            form.setError("email", {
              type: "manual",
              message: "Este email já está cadastrado",
            });
            toast.error("Este email já está cadastrado");
          },
        },
      );
    } catch {
      toast.error("Erro ao criar conta");
    }
  }

  return (
    <Card className="w-full max-w-[580px] p-2 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-7">
          <CardHeader className="px-8 pt-8">
            <h1 className="text-foreground text-[32px] font-semibold">
              Crie sua conta
            </h1>
          </CardHeader>
          <CardContent className="space-y-6 px-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-base font-medium">
                    Nome completo
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background placeholder:text-muted-foreground mt-2 h-12 rounded-lg px-4 text-lg"
                      placeholder="Digite seu nome completo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      className="bg-background placeholder:text-muted-foreground mt-2 h-12 rounded-lg px-4 text-lg"
                      placeholder="seu@email.com"
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
                  <FormLabel className="text-foreground text-base font-medium">
                    Senha
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-base font-medium">
                    Confirme sua senha
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha novamente"
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

            <Button
              type="submit"
              className="h-12 w-full cursor-pointer text-lg font-medium"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Criar conta"
              )}
            </Button>
          </CardContent>

          <CardFooter className="bg-primary/5 flex w-full justify-center rounded-lg py-5">
            <p className="text-foreground text-base">
              Já tem uma conta?{" "}
              <Link
                href="/authentication"
                className="text-primary hover:text-primary/80"
              >
                Faça login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
