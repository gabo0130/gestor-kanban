import { renderHook, act, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";
import { useKanban } from "./useKanban";
import * as boardsApi from "@/apis/boards.api";
import * as tasksApi from "@/apis/tasks.api";

jest.mock("@/apis/boards.api");
jest.mock("@/apis/tasks.api");

describe("useKanban", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads board data and maps statuses/tasks", async () => {
    (boardsApi.getBoard as jest.Mock).mockResolvedValue({
      statuses: [
        { id: 1, label: "Todo" },
        { id: 2, label: "Done" },
      ],
      tasks: [
        {
          id: "10",
          title: "Task A",
          description: "Desc",
          status: "Todo",
          assigneeId: 7,
          assigneeName: "Ana",
          labels: ["frontend"],
        },
      ],
    });

    const { result } = renderHook(() => useKanban("board-1", true));

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    expect(result.current.error).toBeNull();
    expect(result.current.statuses).toEqual([
      { id: "Todo", label: "Todo" },
      { id: "Done", label: "Done" },
    ]);
    expect(result.current.tasks).toEqual([
      {
        id: "10",
        title: "Task A",
        description: "Desc",
        status: "Todo",
        assigneeId: "7",
        assigneeName: "Ana",
        labels: ["frontend"],
      },
    ]);
    expect(boardsApi.getBoard).toHaveBeenCalledWith("board-1");
  });

  it("resets state and skips fetch when disabled", async () => {
    const { result } = renderHook(() => useKanban("board-1", false));

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    expect(boardsApi.getBoard).not.toHaveBeenCalled();
    expect(result.current.statuses).toEqual([]);
    expect(result.current.tasks).toEqual([]);
    expect(result.current.error).toBeNull();

    const persistResult = await result.current.persistTaskStatus("1", "Done", 0);
    expect(persistResult).toEqual({ error: "Sesión no disponible." });
    expect(tasksApi.updateTaskStatus).not.toHaveBeenCalled();
  });

  it("maps backend axios error when fetch fails", async () => {
    const axiosErr = new AxiosError("fail");
    (axiosErr as AxiosError & { response?: unknown }).response = {
      data: { message: "No autorizado" },
    } as unknown;

    (boardsApi.getBoard as jest.Mock).mockRejectedValue(axiosErr);

    const { result } = renderHook(() => useKanban("board-2", true));

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    expect(result.current.error).toBe("No autorizado");
  });

  it("uses fallback fetch error message for non-Axios errors", async () => {
    (boardsApi.getBoard as jest.Mock).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useKanban("board-2", true));

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    expect(result.current.error).toBe("No se pudo cargar el tablero.");
  });

  it("returns error and stores hook error when persist fails", async () => {
    (boardsApi.getBoard as jest.Mock).mockResolvedValue({ statuses: [], tasks: [] });

    const axiosErr = new AxiosError("fail");
    (axiosErr as AxiosError & { response?: unknown }).response = {
      data: { message: "No se pudo mover" },
    } as unknown;

    (tasksApi.updateTaskStatus as jest.Mock).mockRejectedValue(axiosErr);

    const { result } = renderHook(() => useKanban("board-3", true));

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    let persistResult: { error: string | null } = { error: null };
    await act(async () => {
      persistResult = await result.current.persistTaskStatus("77", "Done", 2);
    });

    expect(tasksApi.updateTaskStatus).toHaveBeenCalledWith("77", {
      status: "Done",
      position: 2,
    });
    expect(persistResult).toEqual({ error: "No se pudo mover" });
    expect(result.current.error).toBe("No se pudo mover");
  });

  it("uses fallback persist error message for non-Axios errors", async () => {
    (boardsApi.getBoard as jest.Mock).mockResolvedValue({ statuses: [], tasks: [] });
    (tasksApi.updateTaskStatus as jest.Mock).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useKanban("board-3", true));

    await waitFor(() => expect(result.current.loading).toBeFalsy());

    let persistResult: { error: string | null } = { error: null };
    await act(async () => {
      persistResult = await result.current.persistTaskStatus("77", "Done", 2);
    });

    expect(persistResult).toEqual({ error: "No se pudo actualizar el estado." });
    expect(result.current.error).toBe("No se pudo actualizar el estado.");
  });

  it("exposes refresh function to reload data", async () => {
    (boardsApi.getBoard as jest.Mock)
      .mockResolvedValueOnce({ statuses: [{ id: 1, label: "Todo" }], tasks: [] })
      .mockResolvedValueOnce({
        statuses: [
          { id: 1, label: "Todo" },
          { id: 2, label: "Done" },
        ],
        tasks: [],
      });

    const { result } = renderHook(() => useKanban("board-4", true));

    await waitFor(() => expect(result.current.statuses).toHaveLength(1));

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.statuses).toHaveLength(2);
    expect(boardsApi.getBoard).toHaveBeenCalledTimes(2);
  });
});
