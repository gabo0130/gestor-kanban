import { Button } from "@/components/atoms";

type TaskActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export const TaskActions = ({ onEdit, onDelete }: TaskActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={onEdit}>
        Editar
      </Button>
      <Button variant="secondary" onClick={onDelete}>
        Eliminar
      </Button>
    </div>
  );
};