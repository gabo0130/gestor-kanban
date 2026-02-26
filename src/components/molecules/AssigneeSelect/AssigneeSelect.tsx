type AssigneeOption = {
  id: string;
  name: string;
};

type AssigneeSelectProps = {
  id?: string;
  label?: string;
  value: string;
  members: AssigneeOption[];
  onChange: (value: string) => void;
};

export const AssigneeSelect = ({
  id = "task-assignee",
  label = "Asignar a miembro",
  value,
  members,
  onChange,
}: AssigneeSelectProps) => {
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
      >
        <option value="">Sin asignar</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
    </div>
  );
};