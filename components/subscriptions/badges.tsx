import { Badge } from "@/components/ui/badge";
import { CATEGORY_COLORS } from "@/lib/constants";
import type { Category, Status } from "@/lib/types";
import { CircleDot, PauseCircle, XCircle } from "lucide-react";

export function CategoryBadge({ category }: { category: Category }) {
  const color = CATEGORY_COLORS[category];
  return (
    <Badge
      variant="outline"
      className="gap-1.5"
      style={{ borderColor: `${color}40`, color }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {category}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  if (status === "Active")
    return (
      <Badge variant="success">
        <CircleDot className="h-3 w-3" aria-hidden /> Active
      </Badge>
    );
  if (status === "Paused")
    return (
      <Badge variant="warning">
        <PauseCircle className="h-3 w-3" aria-hidden /> Paused
      </Badge>
    );
  return (
    <Badge variant="muted">
      <XCircle className="h-3 w-3" aria-hidden /> Cancelled
    </Badge>
  );
}
