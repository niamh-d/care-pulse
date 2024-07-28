"use client";

import { useState } from "react";

import { Appointment } from "@/types/appwrite.types";
import AppointmentForm from "./forms/AppointmentForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

export default function AppointmentModal({
  type,
  patientId,
  userId,
  appointment,
}: {
  type: "schedule" | "cancel";
  title: string;
  description: string;
  appointment: Appointment;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${type === "schedule" && "text-green-500"}`}
        >
          {type === "schedule" ? "Schedule" : "Cancel"}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            {type === "schedule"
              ? "Review the below details to confirm the appointment."
              : "Note: This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
