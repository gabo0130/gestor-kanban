import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./users.api";
import { apiClient } from "./client";

jest.mock("./client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("users.api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getUsers should request /users", async () => {
    const expected = { users: [{ id: "1", name: "Ana", email: "ana@x.com", role: "member" }] };
    (apiClient.get as jest.Mock).mockResolvedValue({ data: expected });

    const result = await getUsers();

    expect(apiClient.get).toHaveBeenCalledWith("/users");
    expect(result).toEqual(expected);
  });

  it("getUserById should request /users/:id", async () => {
    const expected = { id: "22", name: "Luis", email: "luis@x.com", role: "manager" };
    (apiClient.get as jest.Mock).mockResolvedValue({ data: expected });

    const result = await getUserById("22");

    expect(apiClient.get).toHaveBeenCalledWith("/users/22");
    expect(result).toEqual(expected);
  });

  it("createUser should post to /users", async () => {
    const payload = {
      name: "Marta",
      email: "marta@x.com",
      password: "Secret123*",
      role: "member" as const,
    };
    const expected = { id: "3", name: "Marta", email: payload.email, role: payload.role };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: expected });

    const result = await createUser(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/users", payload);
    expect(result).toEqual(expected);
  });

  it("updateUser should patch /users/:id", async () => {
    const payload = { role: "admin" as const };
    const expected = { id: "9", name: "Diego", email: "d@x.com", role: "admin" };
    (apiClient.patch as jest.Mock).mockResolvedValue({ data: expected });

    const result = await updateUser("9", payload);

    expect(apiClient.patch).toHaveBeenCalledWith("/users/9", payload);
    expect(result).toEqual(expected);
  });

  it("deleteUser should delete /users/:id", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);

    await deleteUser("14");

    expect(apiClient.delete).toHaveBeenCalledWith("/users/14");
  });
});
