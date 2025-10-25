"use client";

import { PlusIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { doctorsTable, patientsTable } from "@/db/schema";

import UpsertAppointmentForm from "./upsert-appointment-form";

interface AddAppointmentButtonProps {
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
}

export function AddAppointmentButton({
  patients,
  doctors,
}: AddAppointmentButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <PlusIcon className="h-4 w-4" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <UpsertAppointmentForm
        patients={patients}
        doctors={doctors}
        onSuccess={() => {
          setIsOpen(false);
          // Refresh the page to show the new appointment
          window.location.reload();
        }}
      />
    </Dialog>
  );
}