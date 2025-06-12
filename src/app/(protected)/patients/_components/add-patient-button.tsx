"use client";

import { PlusIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertPatientForm from "./upsert-patient-form";

export function AddPatientButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <PlusIcon className="h-4 w-4" />
          Adicionar Paciente
        </Button>
      </DialogTrigger>
      <UpsertPatientForm
        onSuccess={() => {
          setIsOpen(false);
        }}
      />
    </Dialog>
  );
}
