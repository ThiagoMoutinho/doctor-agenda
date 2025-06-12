"use client";

import { ColumnDef } from "@tanstack/react-table";

import { patientsTable } from "@/db/schema";

import PatientsTableAction from "./table-actions";


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
      const patient = params.row.original;
      return (
        <PatientsTableAction patient={patient}/>
      );
    },
  },
];
