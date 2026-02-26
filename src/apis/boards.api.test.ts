import {
  createBoard,
  createBoardLabel,
  deleteBoard,
  deleteBoardLabel,
  getBoard,
  getBoards,
  updateBoard,
  updateBoardLabel,
} from "./boards.api";
import { apiClient } from "./client";

jest.mock("./client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("boards.api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getBoards calls /boards", async () => {
    const expected = { boards: [{ id: "1", name: "Main", statuses: [] }] };
    (apiClient.get as jest.Mock).mockResolvedValue({ data: expected });

    const result = await getBoards();

    expect(apiClient.get).toHaveBeenCalledWith("/boards");
    expect(result).toEqual(expected);
  });

  it("createBoard posts payload", async () => {
    const payload = { name: "Main", statuses: ["Todo"] };
    const expected = { id: "1", name: "Main", statuses: [{ id: 1, label: "Todo" }] };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: expected });

    const result = await createBoard(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/boards", payload);
    expect(result).toEqual(expected);
  });

  it("updateBoard patches payload", async () => {
    const payload = { name: "Nuevo" };
    const expected = { id: "1", name: "Nuevo", statuses: [] };
    (apiClient.patch as jest.Mock).mockResolvedValue({ data: expected });

    const result = await updateBoard("1", payload);

    expect(apiClient.patch).toHaveBeenCalledWith("/boards/1", payload);
    expect(result).toEqual(expected);
  });

  it("deleteBoard calls endpoint", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);

    await deleteBoard("1");

    expect(apiClient.delete).toHaveBeenCalledWith("/boards/1");
  });

  it("getBoard calls /boards/:id", async () => {
    const expected = { statuses: [], tasks: [] };
    (apiClient.get as jest.Mock).mockResolvedValue({ data: expected });

    const result = await getBoard("22");

    expect(apiClient.get).toHaveBeenCalledWith("/boards/22");
    expect(result).toEqual(expected);
  });

  it("createBoardLabel posts payload", async () => {
    const payload = { name: "backend", color: "#000" };
    const expected = { id: "1", name: "backend", color: "#000" };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: expected });

    const result = await createBoardLabel("22", payload);

    expect(apiClient.post).toHaveBeenCalledWith("/boards/22/labels", payload);
    expect(result).toEqual(expected);
  });

  it("updateBoardLabel patches payload", async () => {
    const payload = { name: "frontend" };
    const expected = { id: "11", name: "frontend" };
    (apiClient.patch as jest.Mock).mockResolvedValue({ data: expected });

    const result = await updateBoardLabel("22", "11", payload);

    expect(apiClient.patch).toHaveBeenCalledWith("/boards/22/labels/11", payload);
    expect(result).toEqual(expected);
  });

  it("deleteBoardLabel calls endpoint", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);

    await deleteBoardLabel("22", "11");

    expect(apiClient.delete).toHaveBeenCalledWith("/boards/22/labels/11");
  });
});
