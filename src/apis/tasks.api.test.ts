import { createTask, deleteTask, updateTask, updateTaskStatus } from "./tasks.api";
import { apiClient } from "./client";

jest.mock("./client", () => ({
  apiClient: {
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("tasks.api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("createTask posts payload", async () => {
    const payload = { boardId: "1", title: "Task", status: "Todo" };
    const expected = { id: "1", title: "Task", status: "Todo" };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: expected });

    const result = await createTask(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/tasks", payload);
    expect(result).toEqual(expected);
  });

  it("updateTask patches payload", async () => {
    const payload = { title: "Updated" };
    const expected = { id: "1", title: "Updated", status: "Done" };
    (apiClient.patch as jest.Mock).mockResolvedValue({ data: expected });

    const result = await updateTask("1", payload);

    expect(apiClient.patch).toHaveBeenCalledWith("/tasks/1", payload);
    expect(result).toEqual(expected);
  });

  it("deleteTask calls endpoint", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);

    await deleteTask("9");

    expect(apiClient.delete).toHaveBeenCalledWith("/tasks/9");
  });

  it("updateTaskStatus returns data when patch succeeds", async () => {
    const expected = { task: { id: "1", title: "A", status: "Done" } };
    (apiClient.patch as jest.Mock).mockResolvedValue({ data: expected });

    const result = await updateTaskStatus("1", { status: "Done", position: 1 });

    expect(apiClient.patch).toHaveBeenCalledWith("/tasks/1/status", {
      status: "Done",
      position: 1,
    });
    expect(result).toEqual(expected);
  });

  it("updateTaskStatus logs and rethrows when patch fails", async () => {
    const error = new Error("boom");
    (apiClient.patch as jest.Mock).mockRejectedValue(error);

    await expect(updateTaskStatus("1", { status: "Done" })).rejects.toThrow("boom");
    expect(console.error).toHaveBeenCalled();
  });
});
