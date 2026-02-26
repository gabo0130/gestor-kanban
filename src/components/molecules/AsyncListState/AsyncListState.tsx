import { Spinner } from "@/components/atoms";

type AsyncListStateProps = {
  loading: boolean;
  isEmpty: boolean;
  loadingText?: string;
  emptyText?: string;
};

export const AsyncListState = ({
  loading,
  isEmpty,
  loadingText = "Cargando...",
  emptyText = "No hay elementos.",
}: AsyncListStateProps) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner size="sm" />
        <span className="text-sm opacity-80">{loadingText}</span>
      </div>
    );
  }

  if (isEmpty) {
    return <p className="text-sm opacity-75">{emptyText}</p>;
  }

  return null;
};