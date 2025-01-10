// components/QueueStatsButton.tsx
interface QueueStatsButtonProps {
  label: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}

export const QueueStatsButton: React.FC<QueueStatsButtonProps> = ({
  label,
  count,
  isSelected,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`text-left p-2 rounded-lg transition-colors ${isSelected ? "bg-muted" : ""}`}
  >
    <div className="text-xs text-muted-foreground">{label}</div>
    <div>{count}</div>
  </button>
);
