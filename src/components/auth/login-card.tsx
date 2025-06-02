import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { colors } from "@/styles/colors";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export function LoginCard() {
  return (
    <Card className="w-full max-w-[600px] shadow-lg">
      <CardHeader className="px-8 pt-8">
        <h1
          className="text-[32px] font-semibold"
          style={{ color: colors.text.primary }}
        >
          Acesse sua conta
        </h1>
      </CardHeader>
      <CardContent className="space-y-6 px-8">
        <div className="space-y-3">
          <label
            className="text-base font-medium"
            style={{ color: colors.text.primary }}
          >
            E-mail
          </label>
          <Input
            type="email"
            placeholder="seu@email.com"
            className="placeholder:text-muted-foreground h-14 rounded-lg bg-white px-4 text-lg"
            style={
              {
                borderColor: colors.ui.border,
                "--focus-border": colors.ui.focus,
                "--focus-ring": colors.ui.focus,
              } as React.CSSProperties
            }
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              className="text-base font-medium"
              style={{ color: colors.text.primary }}
            >
              Senha
            </label>
            <Link
              href="/esqueci-senha"
              className="text-base hover:text-[#0a2540]"
              style={{ color: colors.primary.purple }}
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <Input
            type="password"
            className="placeholder:text-muted-foreground h-14 rounded-lg bg-white px-4 text-lg"
            style={
              {
                borderColor: colors.ui.border,
                "--focus-border": colors.ui.focus,
                "--focus-ring": colors.ui.focus,
              } as React.CSSProperties
            }
          />
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="remember"
            className="h-5 w-5 border-[#e6e8eb]"
            style={
              {
                "--checked-bg": colors.primary.purple,
                "--checked-border": colors.primary.purple,
              } as React.CSSProperties
            }
          />
          <label
            htmlFor="remember"
            className="text-base leading-none font-medium"
            style={{ color: colors.text.primary }}
          >
            Lembrar de mim neste dispositivo
          </label>
        </div>

        <Button
          className="h-14 w-full text-lg font-medium hover:bg-[#0a2540]"
          style={{ backgroundColor: colors.primary.purple }}
        >
          Entrar
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <Separator style={{ backgroundColor: colors.ui.border }} />
          </div>
          <div className="relative flex justify-center">
            <span
              className="bg-white px-4 text-base"
              style={{ color: colors.text.muted }}
            >
              OU
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-14 w-full text-base font-medium"
          style={{ borderColor: colors.ui.border }}
        >
          <FcGoogle className="mr-3 h-6 w-6" />
          Entrar com o Google
        </Button>

        <Button
          variant="outline"
          className="h-14 w-full text-base font-medium"
          style={{ borderColor: colors.ui.border }}
        >
          Fazer login com chave de acesso
        </Button>

        <Button
          variant="outline"
          className="h-14 w-full text-base font-medium"
          style={{ borderColor: colors.ui.border }}
        >
          Entrar com SSO
        </Button>
      </CardContent>

      <CardFooter
        className="flex justify-center border-t p-8"
        style={{ borderColor: colors.ui.border }}
      >
        <p className="text-base" style={{ color: colors.text.primary }}>
          Novo na Stripe?{" "}
          <Link
            href="/signup"
            className="hover:text-[#0a2540]"
            style={{ color: colors.primary.purple }}
          >
            Crie uma conta
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
