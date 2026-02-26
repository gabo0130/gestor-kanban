import { login } from "./auth.api";
import { apiClient } from "./client";

jest.mock("./client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("auth.api", () => {
  it("login should call /auth/login and return response data", async () => {
    const payload = { email: "admin@empresa.com", password: "secret" };
    const expected = { token: "jwt", user: { id: "1", name: "Admin", email: payload.email } };

    (apiClient.post as jest.Mock).mockResolvedValue({ data: expected });

    const result = await login(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/auth/login", payload);
    expect(result).toEqual(expected);
  });
});
