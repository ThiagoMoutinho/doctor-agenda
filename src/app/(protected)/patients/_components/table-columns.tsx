"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { patientsTable } from "@/db/schema";
import { EditIcon, MoreHorizontal, TrashIcon } from "lucide-react";

type pacientes = typeof patientsTable.$inferSelect;

export const patientTableColumns: ColumnDef<pacientes>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Telefone",
    cell: (params) => {
      const patient = params.row.original;
      const phoneNumber = patient.phoneNumber;
      if (!phoneNumber) return null;
      const formattedPhoneNumber = phoneNumber.replace(
        /(\d{2})(\d{4})(\d{4})/,
        "($1) $2-$3",
      );
      return formattedPhoneNumber;
    },
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: "Sexo",
    cell: (params) => {
      const patiens = params.row.original;
      return patiens.sex === "male" ? "Masculino" : "Feminino";
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const patien = params.row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{patien.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <EditIcon />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TrashIcon />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
