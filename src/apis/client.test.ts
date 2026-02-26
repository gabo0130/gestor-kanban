const requestUseMock = jest.fn();
const responseUseMock = jest.fn();

const uiStartLoadingMock = jest.fn();
const uiStopLoadingMock = jest.fn();
const uiShowModalMock = jest.fn();

const createMock = jest.fn(() => ({
  defaults: { headers: { common: { Authorization: "Bearer old" } } },
  interceptors: {
    request: {
      use: requestUseMock,
    },
    response: {
      use: responseUseMock,
    },
  },
}));

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: createMock,
  },
}));

jest.mock("@/hooks/ui-state", () => ({
  uiStartLoading: () => uiStartLoadingMock(),
  uiStopLoading: () => uiStopLoadingMock(),
  uiShowModal: (params: unknown) => uiShowModalMock(params),
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

    const onRejected = responseUseMock.mock.calls[0][1] as (error: unknown) => Promise<unknown>;

    await expect(onRejected({ response: { status: 401 } })).rejects.toEqual({
      response: { status: 401 },
    });

    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(apiClient.defaults.headers.common["Authorization"]).toBeUndefined();
    expect(uiStopLoadingMock).toHaveBeenCalled();
    expect(uiShowModalMock).toHaveBeenCalledWith({
      title: "Error",
      message: "Ocurrió un error en la solicitud.",
      variant: "warning",
    });
  });

  it("does not redirect when already in login route", async () => {
    window.history.replaceState({}, "", "/");

    await import("./client");
    const onRejected = responseUseMock.mock.calls[0][1] as (error: unknown) => Promise<unknown>;

    await expect(onRejected({ response: { status: 403 } })).rejects.toEqual({
      response: { status: 403 },
    });

  });

  it("does not clear session on non-auth status", async () => {
    localStorage.setItem("auth_token", "x");
    localStorage.setItem("auth_user", "{}");

    const { apiClient } = await import("./client");
    const onRejected = responseUseMock.mock.calls[0][1] as (error: unknown) => Promise<unknown>;

    await expect(onRejected({ response: { status: 500 } })).rejects.toEqual({
      response: { status: 500 },
    });

    expect(localStorage.getItem("auth_token")).toBe("x");
    expect(localStorage.getItem("auth_user")).toBe("{}");
    expect(apiClient.defaults.headers.common["Authorization"]).toBe("Bearer old");
  });

  it("injects auth header from localStorage when request has no authorization", async () => {
    localStorage.setItem("auth_token", "token-123");

    await import("./client");
    const onRequest = requestUseMock.mock.calls[0][0] as (config: {
      headers?: Record<string, string>;
    }) => { headers?: Record<string, string> };

    const config = onRequest({});

    expect(config.headers?.Authorization).toBe("Bearer token-123");
    expect(uiStartLoadingMock).toHaveBeenCalledTimes(1);
  });

  it("keeps existing authorization header on request", async () => {
    localStorage.setItem("auth_token", "token-123");

    await import("./client");
    const onRequest = requestUseMock.mock.calls[0][0] as (config: {
      headers?: Record<string, string>;
    }) => { headers?: Record<string, string> };

    const config = onRequest({ headers: { Authorization: "Bearer custom" } });

    expect(config.headers?.Authorization).toBe("Bearer custom");
  });

  it("handles request interceptor rejection", async () => {
    await import("./client");
    const onRequestRejected = requestUseMock.mock.calls[0][1] as (error: unknown) => Promise<unknown>;
    const requestError = new Error("request failed");

    await expect(onRequestRejected(requestError)).rejects.toThrow("request failed");
    expect(uiStopLoadingMock).toHaveBeenCalled();
  });

  it("shows success modal for mutating methods using backend message", async () => {
    await import("./client");
    const onFulfilled = responseUseMock.mock.calls[0][0] as (response: {
      config: { method?: string };
      data?: { message?: string };
    }) => unknown;

    onFulfilled({ config: { method: "post" }, data: { message: "Creado por API" } });

    expect(uiStopLoadingMock).toHaveBeenCalled();
    expect(uiShowModalMock).toHaveBeenCalledWith({
      title: "Éxito",
      message: "Creado por API",
      variant: "success",
    });
  });

  it("shows default success message for patch method", async () => {
    await import("./client");
    const onFulfilled = responseUseMock.mock.calls[0][0] as (response: {
      config: { method?: string };
      data?: { message?: string };
    }) => unknown;

    onFulfilled({ config: { method: "patch" }, data: {} });

    expect(uiShowModalMock).toHaveBeenCalledWith({
      title: "Éxito",
      message: "Operación actualizada correctamente.",
      variant: "success",
    });
  });

  it("does not show success modal for get responses", async () => {
    await import("./client");
    const onFulfilled = responseUseMock.mock.calls[0][0] as (response: {
      config: { method?: string };
      data?: { message?: string };
    }) => unknown;

    onFulfilled({ config: { method: "get" }, data: {} });

    expect(uiShowModalMock).not.toHaveBeenCalledWith(
      expect.objectContaining({ title: "Éxito" })
    );
  });

  it("maps server error status as error modal", async () => {
    await import("./client");
    const onRejected = responseUseMock.mock.calls[0][1] as (error: unknown) => Promise<unknown>;

    await expect(
      onRejected({ response: { status: 500, data: { message: "Server down" } } })
    ).rejects.toEqual({
      response: { status: 500, data: { message: "Server down" } },
    });

    expect(uiShowModalMock).toHaveBeenCalledWith({
      title: "Error del servidor",
      message: "Server down",
      variant: "error",
    });
  });

  it("maps network error as connection modal", async () => {
    await import("./client");
    const onRejected = responseUseMock.mock.calls[0][1] as (error: unknown) => Promise<unknown>;

    await expect(onRejected({})).rejects.toEqual({});

    expect(uiShowModalMock).toHaveBeenCalledWith({
      title: "Error de conexión",
      message: "No se pudo conectar con el servidor.",
      variant: "error",
    });
  });
});
