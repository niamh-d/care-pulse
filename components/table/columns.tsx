"use client";

import Image from "next/image";

import { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "../StatusBadge";
import { Appointment } from "@/types/appwrite.types";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import AppointmentModal from "@/components/AppointmentModal";
import { truncateId } from "@/lib/utils";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "No.",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    header: "ID",
    cell: ({ row }) => (
      <p className="text-14-medium">{truncateId(row.original.$id)}</p>
    ),
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {row.original.patient.name} ({truncateId(row.original.patient.$id)})
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "scheduledTime",
    header: "Appointment",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <p className="text-14-medium">
          {formatDateTime(row.original.scheduledTime).dateTime}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "selectedDoctor",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doctor) => doctor.name === row.original.selectedDoctor
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image}
            alt={doctor?.name}
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      if (data.status !== "cancelled")
        return (
          <div className="flex gap-1">
            <AppointmentModal
              type="schedule"
              patientId={data.patient.$id}
              userId={data.userId}
              appointment={data}
            />
            <AppointmentModal
              type="cancel"
              patientId={data.patient.$id}
              userId={data.userId}
              appointment={data}
            />
          </div>
        );
      else return null;
    },
  },
];
