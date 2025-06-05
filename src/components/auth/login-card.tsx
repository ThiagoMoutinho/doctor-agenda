import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod";

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
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginCard() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      // Aqui você implementa a lógica de login
      console.log(values);
      toast.success("Login realizado com sucesso!");
    } catch {
      toast.error("Erro ao fazer login");
    }
  }

  return (
    <Card className="w-full max-w-[580px] shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
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
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seu@email.com"
                      className="h-12 rounded-lg px-4 text-lg"
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Senha</FormLabel>
                    <Link
                      href="/esqueci-senha"
                      className="text-primary hover:text-primary/90 text-base"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      className="h-12 rounded-lg px-4 text-lg"
                      placeholder="Digite sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-base leading-none font-medium">
                    Lembrar de mim neste dispositivo
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="h-12 w-full text-lg font-medium"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
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
              type="button"
              variant="outline"
              className="h-12 w-full text-base font-medium"
            >
              <FcGoogle className="mr-3 h-6 w-6" />
              Entrar com o Google
            </Button>
          </CardContent>

          <CardFooter className="border-border flex justify-center border-t p-8">
            <p className="text-foreground text-base">
              Novo por aqui?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary/90"
              >
                Crie uma conta
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
