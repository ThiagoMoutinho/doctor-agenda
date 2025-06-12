"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { upsertPatient } from "@/actions/upsert-patient";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patientsTable } from "@/db/schema";
import React from "react";

const formSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Telefone inválido." })
    .max(11, { message: "Telefone inválido." }),
  sex: z.enum(["male", "female"], { message: "Selecione um sexo válido." }),
});

interface UpsertPatientFormProps {
  isOpen: boolean;
  patient?: typeof patientsTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertPatientForm = ({ patient, onSuccess }: UpsertPatientFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: patient?.id,
      name: patient?.name ?? "",
      email: patient?.email ?? "",
      phoneNumber: patient?.phoneNumber ?? "",
      sex: patient?.sex ?? undefined,
    },
  });

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess() {
      toast.success("Paciente salvo com sucesso");
      onSuccess?.();
    },
    onError() {
      toast.error("Ocorreu um erro ao salvar o paciente");
    },
  });

  React.useEffect(() => {
    if (patient) {
      form.reset({
        id: patient.id,
        name: patient?.name ?? "",
        email: patient?.email ?? "",
        phoneNumber: patient?.phoneNumber ?? "",
        sex: patient.sex ?? undefined,
      });
    } else {
      form.reset();
    }
  }, [patient, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    upsertPatientAction.execute({
      ...values,
      id: patient?.id,
    });
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {patient?.id ? "Editar Paciente" : "Novo Paciente"}
        </DialogTitle>
        <DialogDescription>
          {patient
            ? "Edite as informações desse paciente."
            : "Adicione um novo paciente."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Paciente</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome Completo"
                    {...field}
                    disabled={upsertPatientAction.isPending}
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    type="email"
                    {...field}
                    disabled={upsertPatientAction.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="(##) #####-####"
                    mask="_"
                    placeholder="(99) 99999-9999"
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.value);
                    }}
                    customInput={Input}
                    disabled={upsertPatientAction.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={upsertPatientAction.isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={upsertPatientAction.isPending}
            >
              {upsertPatientAction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertPatientForm;
