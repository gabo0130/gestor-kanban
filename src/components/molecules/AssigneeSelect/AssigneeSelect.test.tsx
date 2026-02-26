import { fireEvent, render, screen } from "@testing-library/react";
import { AssigneeSelect } from "./AssigneeSelect";

describe("AssigneeSelect", () => {
  it("renders default label and options", () => {
    render(
      <AssigneeSelect
        value=""
        members={[
          { id: "1", name: "Ana" },
          { id: "2", name: "Luis" },
        ]}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByLabelText("Asignar a miembro")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Sin asignar" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Ana" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Luis" })).toBeInTheDocument();
  });

  it("calls onChange with selected value", () => {
    const onChange = jest.fn();

    render(
      <AssigneeSelect
        id="assignee"
        label="Responsable"
        value=""
        members={[{ id: "1", name: "Ana" }]}
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Responsable"), { target: { value: "1" } });

    expect(onChange).toHaveBeenCalledWith("1");
  });
});
