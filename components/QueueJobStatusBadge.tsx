import { Badge } from "@/components/ui/badge";

export type JobState = "waiting" | "active" | "completed" | "failed";

interface StatusBadgeProps {
  status: JobState;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants = {
    waiting: "bg-background text-foreground border-border",
    active: "bg-primary/10 text-primary border-primary/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    failed: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Badge variant="outline" className={`${variants[status]} rounded-full px-3`}>
      <span className="capitalize">{status}</span>
    </Badge>
  );
};
