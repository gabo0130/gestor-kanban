import { fireEvent, render, screen } from "@testing-library/react";
import { StatusSelect } from "./StatusSelect";

describe("StatusSelect", () => {
  const options = [
    { id: 1, label: "Todo" },
    { id: 2, label: "Done" },
  ];

  it("renders options and selected value", () => {
    render(
      <StatusSelect value="Todo" options={options} onChange={jest.fn()} />
    );

    const select = screen.getByLabelText("Estado") as HTMLSelectElement;
    expect(select.value).toBe("Todo");
    expect(screen.getByRole("option", { name: "Todo" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Done" })).toBeInTheDocument();
  });

  it("calls onChange and supports required", () => {
    const onChange = jest.fn();

    render(
      <StatusSelect
        id="status"
        label="Estado tarea"
        value="Todo"
        options={options}
        onChange={onChange}
        required
      />
    );

    const select = screen.getByLabelText("Estado tarea");
    fireEvent.change(select, { target: { value: "Done" } });

    expect(onChange).toHaveBeenCalledWith("Done");
    expect(select).toBeRequired();
  });
});
