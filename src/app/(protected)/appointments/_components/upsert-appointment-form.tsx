"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ptBR } from "date-fns/locale";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

import { useAction } from "next-safe-action/hooks";

import upsertAppointment from "@/actions/upsert-appointment";

const formSchema = z.object({
  id: z.string().uuid().optional(),
  patientId: z.string().uuid({ message: "Selecione um paciente." }),
  doctorId: z.string().uuid({ message: "Selecione um médico." }),
  appointmentPriceInCents: z
    .number()
    .min(1, { message: "Valor da consulta é obrigatório." }),
  date: z.date({ message: "Selecione uma data." }),
  time: z.string().min(1, {
    message: "Selecione um horário.",
  }),
});

interface UpsertAppointmentFormProps {
  isOpen: boolean;
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  appointment?: typeof appointmentsTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertAppointmentForm = ({
  patients,
  doctors,
  appointment,
  onSuccess,
}: UpsertAppointmentFormProps) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: appointment?.id,
      patientId: "",
      doctorId: "",
      appointmentPriceInCents: 0,
      date: appointment?.date ?? undefined,
      time: "",
    },
  });

  const watchedDoctorId = form.watch("doctorId");
  const watchedPatientId = form.watch("patientId");

  // Atualiza o médico selecionado e o preço quando o médico muda
  React.useEffect(() => {
    if (watchedDoctorId) {
      const doctor = doctors.find((d) => d.id === watchedDoctorId);
      if (doctor) {
        form.setValue(
          "appointmentPriceInCents",
          doctor.appointmentPriceInCents / 1,
        );
      }
    } else {
      form.setValue("appointmentPriceInCents", 0);
    }
  }, [watchedDoctorId, doctors, form]);

  // Reset form when appointment changes
  React.useEffect(() => {
    if (appointment) {
      form.reset({
        id: appointment?.id,
        patientId: appointment?.patientId,
        doctorId: appointment?.doctorId,
        appointmentPriceInCents: 0, // Will be set by doctor selection
        date: new Date(appointment.date),
        time: "",
      });
    } else {
      form.reset({
        patientId: "",
        doctorId: "",
        appointmentPriceInCents: 0,
        date: undefined,
        time: "",
      });
    }
  }, [appointment, form]);

  // Ação real de upsert para agendamentos
  const upsertAppointmentAction = useAction(upsertAppointment, {
    onSuccess: () => {
      toast.success("Agendamento salvo com sucesso!");
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao salvar agendamento");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertAppointmentAction.execute({
      ...values,
      id: appointment?.id,
    });
  };

  const isDateEnabled = watchedPatientId && watchedDoctorId;
  const isTimeSlotEnabled = watchedPatientId && watchedDoctorId;
  const isPriceEnabled = !!watchedDoctorId;

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>
          {appointment?.id ? "Editar Agendamento" : "Novo Agendamento"}
        </DialogTitle>
        <DialogDescription>
          {appointment
            ? "Edite as informações deste agendamento."
            : "Crie um novo agendamento."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={upsertAppointmentAction.isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={upsertAppointmentAction.isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPriceInCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da Consulta</FormLabel>
                <FormControl>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    value={field.value / 100}
                    onValueChange={(values) => {
                      field.onChange(
                        Math.round((values.floatValue || 0) * 100),
                      );
                    }}
                    customInput={Input}
                    placeholder="R$ 0,00"
                    disabled={
                      !isPriceEnabled || upsertAppointmentAction.isPending
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <div>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-full justify-between font-normal"
                          disabled={
                            !isDateEnabled || upsertAppointmentAction.isPending
                          }
                        >
                          {field.value
                            ? field.value.toLocaleDateString("pt-BR")
                            : "Selecione uma data"}
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpen(false);
                          }}
                          disabled={(date) => date < new Date()}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={
                    !isTimeSlotEnabled || upsertAppointmentAction.isPending
                  }
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="08:30">08:30</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="09:30">09:30</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="10:30">10:30</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="11:30">11:30</SelectItem>
                    <SelectItem value="13:00">13:00</SelectItem>
                    <SelectItem value="13:30">13:30</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="14:30">14:30</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="15:30">15:30</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="16:30">16:30</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                    <SelectItem value="17:30">17:30</SelectItem>
                    <SelectItem value="18:00">18:00</SelectItem>
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
              disabled={upsertAppointmentAction.isPending}
            >
              {upsertAppointmentAction.isPending ? (
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

export default UpsertAppointmentForm;
