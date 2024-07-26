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
import { UserFormValidation } from "@/lib/validation";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";

import { getAppointmentSchema } from "@/lib/validation";

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
  CREATE = "create",
  CANCEL = "cancel",
}

export default function AppointmentForm({
  type,
  userId,
  patientId,
}: AppointmentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentSchema = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentSchema>>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      scheduledTime: new Date(Date.now()),
    },
  });

  async function onSubmit(values: z.infer<typeof AppointmentSchema>) {
    setIsLoading(true);

    setIsLoading(false);
  }

  let buttonLabel;

  switch (type) {
    case RequestType.CREATE:
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
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">Schedule a new appointment.</p>
        </section>

        {type === RequestType.CREATE && (
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
              dateFormat="dd/MM/yyyy"
              timeFormat="hh:mm"
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
