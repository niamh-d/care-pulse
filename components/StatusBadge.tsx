import { StatusIcon } from "@/constants";
import clsx from "clsx";
import Image from "next/image";

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": status === "scheduled",
        "bg-blue-600": status === "new",
        "bg-red-600": status === "cancelled",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt={status}
        width={20}
        height={20}
        className="h-full w-full"
      />
    </div>
  );
}
