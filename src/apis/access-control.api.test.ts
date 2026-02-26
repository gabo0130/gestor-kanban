import { getRolesCatalog } from "./access-control.api";
import { apiClient } from "./client";

jest.mock("./client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("access-control.api", () => {
  it("getRolesCatalog should call /roles and return data", async () => {
    const expected = {
      roles: [
        { id: "1", key: "admin", name: "Admin" },
        { id: "2", key: "manager", name: "Manager" },
      ],
    };

    (apiClient.get as jest.Mock).mockResolvedValue({ data: expected });

    const result = await getRolesCatalog();

    expect(apiClient.get).toHaveBeenCalledWith("/roles");
    expect(result).toEqual(expected);
  });
});
