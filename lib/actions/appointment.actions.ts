"use server";

import { ID, Query } from "node-appwrite";

import {
  DATABASE_ID,
  databases,
  APPOINTMENT_COLLECTION_ID,
} from "../appwrite.config";

import { parseStringify } from "../utils";

import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error("An error occurred while getting an appointment:", error);
  }
};

export const getRecentAppointments = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!
    );

    const initialCounts = {
      scheduledCount: 0,
      newCount: 0,
      cancelledCount: 0,
    };

    console.log("Appointments", appointments);

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount++;
        } else if (appointment.status === "new") {
          acc.newCount++;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount++;
        }

        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while getting recent appointments:",
      error
    );
  }
};

export const updateAppointment = async (
  appointment: UpdateAppointmentParams
) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointment.appointmentId!,
      appointment.appointment
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    // TODO: SMS notification

    revalidatePath("/admin");

    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while updating an appointment:", error);
  }
};
