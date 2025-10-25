"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Clock, DollarSign, Eye, Trash2, User, UserCheck } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { toast } from "sonner";

import { deleteAppointment } from "@/actions/delete-appointment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

import UpsertAppointmentForm from "./upsert-appointment-form";

interface AppointmentCardProps {
  appointment: typeof appointmentsTable.$inferSelect & {
    patient: typeof patientsTable.$inferSelect;
    doctor: typeof doctorsTable.$inferSelect;
  };
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  onRefresh?: () => void;
}

const AppointmentCard = ({ appointment, patients, doctors, onRefresh }: AppointmentCardProps) => {
  const [isUpsertAppointmentFormOpen, setIsUpsertAppointmentFormOpen] = React.useState(false);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  const formatTime = (date: Date) => {
    return format(new Date(date), "HH:mm", { locale: ptBR });
  };

  const formatWeekday = (date: Date) => {
    return format(new Date(date), "EEEE", { locale: ptBR });
  };

  const patientInitials = appointment.patient.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  const deleteAppointmentAction = useAction(deleteAppointment, {
    onSuccess: () => {
      toast.success("Agendamento excluído com sucesso!");
      onRefresh?.();
    },
    onError: () => {
      toast.error("Erro ao excluir agendamento");
    },
  });

  const handleDeleteAppointment = () => {
    if (!appointment) return;
    deleteAppointmentAction.execute({ id: appointment.id });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{patientInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{appointment.patient.name}</h3>
            <p className="text-muted-foreground text-sm">{appointment.doctor.name}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline">
          <CalendarDays className="h-4 w-4" />
          {formatDate(appointment.date)} - {formatWeekday(appointment.date)}
        </Badge>
        <Badge variant="outline">
          <Clock className="h-4 w-4" />
          {formatTime(appointment.date)}
        </Badge>
        <Badge variant="outline">
          <UserCheck className="h-4 w-4" />
          {appointment.doctor.specialty}
        </Badge>
        <Badge variant="outline">
          <DollarSign className="h-4 w-4" />
          {formatCurrency(appointment.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardContent>
        <Dialog
          open={isUpsertAppointmentFormOpen}
          onOpenChange={setIsUpsertAppointmentFormOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full mb-3 cursor-pointer">
              <Eye className="h-4 w-4" />
              Ver detalhes
            </Button>
          </DialogTrigger>
          <UpsertAppointmentForm
            appointment={appointment}
            patients={patients}
            doctors={doctors}
            onSuccess={() => {
              setIsUpsertAppointmentFormOpen(false);
              onRefresh?.();
            }}
          />
        </Dialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full cursor-pointer">
              <Trash2 className="h-4 w-4" />
              Deletar agendamento
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja excluir o agendamento?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso irá deletar o agendamento permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer"
                onClick={handleDeleteAppointment}
              >
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
