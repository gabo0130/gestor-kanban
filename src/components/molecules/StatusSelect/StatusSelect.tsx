type StatusOption = {
  id: number | string;
  label: string;
};

type StatusSelectProps = {
  id?: string;
  label?: string;
  value: string;
  options: StatusOption[];
  onChange: (value: string) => void;
  required?: boolean;
};

export const StatusSelect = ({
  id = "task-status",
  label = "Estado",
  value,
  options,
  onChange,
  required = false,
}: StatusSelectProps) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        className="h-10 rounded-md border border-foreground/25 bg-background px-3 text-sm outline-none focus:border-foreground"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      >
        {options.map((status) => (
          <option key={status.id} value={status.label}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
};