"use client";

import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { CustomFormField } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Doctors, getAppointmentDefaultValues } from "@/constants";
import { SelectItem } from "@/components/ui/select";
import { getAppointmentSchema } from "@/lib/validation";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";

export enum FormFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

enum RequestType {
  UPDATE = "update",
  REQUEST = "request",
  CANCEL = "cancel",
}

enum StatusType {
  SCHEDULED = "scheduled",
  NEW = "new",
  CANCELLED = "cancelled",
}

export default function AppointmentForm({
  type,
  userId,
  patientId,
  appointment,
  setOpen,
}: AppointmentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentSchema = getAppointmentSchema(type);
  const appointmentDefaultValues = getAppointmentDefaultValues(type);

  const form = useForm<z.infer<typeof AppointmentSchema>>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      ...appointmentDefaultValues,
      selectedDoctor:
        appointment?.selectedDoctor || appointmentDefaultValues.selectedDoctor,
      scheduledTime:
        appointment?.scheduledTime || appointmentDefaultValues.scheduledTime,
      visitReason:
        appointment?.visitReason || appointmentDefaultValues.visitReason,
      notes: appointment?.notes || appointmentDefaultValues.notes,
    },
  });

  async function onSubmit(values: z.infer<typeof AppointmentSchema>) {
    setIsLoading(true);

    let statusType;

    switch (type) {
      case RequestType.UPDATE:
        statusType = StatusType.SCHEDULED;
        break;
      case RequestType.CANCEL:
        statusType = StatusType.CANCELLED;
        break;
      case RequestType.REQUEST:
        statusType = StatusType.NEW;
      default:
        statusType = StatusType.NEW;
    }

    try {
      if (patientId && type === RequestType.REQUEST) {
        const appointmentData = {
          userId,
          patient: patientId,
          selectedDoctor: values.selectedDoctor,
          scheduledTime: new Date(values.scheduledTime),
          visitReason: values.visitReason!,
          notes: values.notes,
          status: statusType as Status,
        };

        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      } else {
        const apppointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            selectedDoctor: values?.selectedDoctor,
            scheduledTime: new Date(values?.scheduledTime),
            status: statusType as Status,
            cancelltionReason: values?.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(
          apppointmentToUpdate
        );

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.error(
        "An error occurred while creating a new appointment:",
        error
      );
    }

    setIsLoading(false);
  }

  let buttonLabel;

  switch (type) {
    case RequestType.REQUEST:
      buttonLabel = "Schedule appointment";
      break;
    case RequestType.CANCEL:
      buttonLabel = "Cancel appointment";
      break;
    default:
      buttonLabel = "Submit";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === RequestType.REQUEST && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">Request a new appointment.</p>
          </section>
        )}

        {type !== RequestType.CANCEL && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="selectedDoctor"
              label="Select a doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="scheduledTime"
              label="Expected Appointment Date"
              showTimeSelect
              dateFormat="dd/MM/yyyy  -  h:mm aa"
            />
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="visitReason"
                label="Reason for visit"
                placeholder="Enter reason for visit"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="notes"
                label="Notes (if any)"
                placeholder="Enter notes (if any)"
              />
            </div>
          </>
        )}

        {type === RequestType.CANCEL && (
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === RequestType.CANCEL ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
}
