type TaskInfoProps = {
  title: string;
  description?: string;
  status: string;
  assignee: string;
  labels?: string[];
};

export const TaskInfo = ({ title, description, status, assignee, labels = [] }: TaskInfoProps) => {
  return (
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm opacity-80">{description ?? "Sin descripción"}</p>
      <p className="text-xs opacity-70">Estado: {status}</p>
      <p className="text-xs opacity-70">Asignado: {assignee}</p>

      {labels.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {labels.map((label) => (
            <span
              key={`${title}-${label}`}
              className="rounded-full border border-foreground/20 px-2 py-0.5 text-xs"
            >
              #{label}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs opacity-70">Etiquetas: Sin etiquetas</p>
      )}
    </div>
  );
};