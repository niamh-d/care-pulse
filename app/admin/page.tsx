import Image from "next/image";
import Link from "next/link";

import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/columns";
import StatCard from "@/components/StatCard";
import { getRecentAppointments } from "@/lib/actions/appointment.actions";

export default async function AdminPage() {
  const apppointments = await getRecentAppointments();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={162}
            height={32}
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Admin panel</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day by managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="new"
            count={apppointments.newCount || 0}
            label="Appointment requests"
            icon="/assets/icons/status-new.svg"
          />
          <StatCard
            type="scheduled"
            count={apppointments.scheduledCount || 0}
            label="Scheduled appointments"
            icon="/assets/icons/status-scheduled.svg"
          />
          <StatCard
            type="cancelled"
            count={apppointments.cancelledCount || 0}
            label="Cancelled appointments"
            icon="/assets/icons/status-cancelled.svg"
          />
        </section>

        <DataTable data={apppointments.documents} columns={columns} />
      </main>
    </div>
  );
}
