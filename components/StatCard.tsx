import clsx from "clsx";
import Image from "next/image";

interface StatCardProps {
  count: number;
  label: string;
  icon: string;
  type: "appointments" | "pending" | "cancelled";
}

export default function StatCard({ count, label, icon, type }: StatCardProps) {
  return (
    <div
      className={clsx("stat-card", {
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          alt={`${type} icon`}
          width={32}
          height={32}
          className="w-8 h-8"
        />
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>
      <div>
        <p className="text-14-regular">{label}</p>
      </div>
    </div>
  );
}
