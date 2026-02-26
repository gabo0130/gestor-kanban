import { BoardLabelDTO } from "@/apis/interfaces/kanban.interface";

type TaskLabelsSelectorProps = {
  title?: string;
  labels: BoardLabelDTO[];
  selectedLabels: string[];
  onToggle: (labelName: string) => void;
  emptyMessage?: string;
};

export const TaskLabelsSelector = ({
  title = "Etiquetas",
  labels,
  selectedLabels,
  onToggle,
  emptyMessage = "Este tablero no tiene etiquetas creadas.",
}: TaskLabelsSelectorProps) => {
  return (
    <div className="md:col-span-2">
      <p className="text-sm font-medium">{title}</p>

      {labels.length === 0 ? (
        <p className="mt-1 text-xs opacity-70">{emptyMessage}</p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          {labels.map((label) => {
            const checked = selectedLabels.includes(label.name);

            return (
              <label
                key={label.id}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                  checked ? "border-foreground/60" : "border-foreground/20"
                }`}
              >
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5"
                  checked={checked}
                  onChange={() => onToggle(label.name)}
                />
                <span>{label.name}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};