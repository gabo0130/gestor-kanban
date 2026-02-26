const useMock = jest.fn();

const createMock = jest.fn(() => ({
  defaults: { headers: { common: { Authorization: "Bearer old" } } },
  interceptors: {
    response: {
      use: useMock,
    },
  },
}));

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: createMock,
  },
}));

describe("apiClient", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    localStorage.clear();
    window.history.replaceState({}, "", "/dashboard");
  });

  it("configures axios instance and handles unauthorized responses", async () => {
    localStorage.setItem("auth_token", "x");
    localStorage.setItem("auth_user", "{}");

    const { apiClient } = await import("./client");

    expect(createMock).toHaveBeenCalledWith({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
    });

    const onRejected = useMock.mock.calls[0][1] as (error: unknown) => Promise<unknown>;

    await expect(onRejected({ response: { status: 401 } })).rejects.toEqual({
      response: { status: 401 },
    });

    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(apiClient.defaults.headers.common["Authorization"]).toBeUndefined();
  });

  it("does not redirect when already in login route", async () => {
    window.history.replaceState({}, "", "/");

    await import("./client");
    const onRejected = useMock.mock.calls[0][1] as (error: unknown) => Promise<unknown>;

    await expect(onRejected({ response: { status: 403 } })).rejects.toEqual({
      response: { status: 403 },
    });

  });

  it("does not clear session on non-auth status", async () => {
    localStorage.setItem("auth_token", "x");
    localStorage.setItem("auth_user", "{}");

    const { apiClient } = await import("./client");
    const onRejected = useMock.mock.calls[0][1] as (error: unknown) => Promise<unknown>;

    await expect(onRejected({ response: { status: 500 } })).rejects.toEqual({
      response: { status: 500 },
    });

    expect(localStorage.getItem("auth_token")).toBe("x");
    expect(localStorage.getItem("auth_user")).toBe("{}");
    expect(apiClient.defaults.headers.common["Authorization"]).toBe("Bearer old");
  });
});
