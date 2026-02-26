import { fireEvent, render, screen } from "@testing-library/react";
import { TaskLabelsSelector } from "./TaskLabelsSelector";

describe("TaskLabelsSelector", () => {
  it("shows empty message when there are no labels", () => {
    render(
      <TaskLabelsSelector labels={[]} selectedLabels={[]} onToggle={jest.fn()} />
    );

    expect(screen.getByText("Etiquetas")).toBeInTheDocument();
    expect(
      screen.getByText("Este tablero no tiene etiquetas creadas.")
    ).toBeInTheDocument();
  });

  it("renders labels and toggles checkbox", () => {
    const onToggle = jest.fn();

    render(
      <TaskLabelsSelector
        labels={[
          { id: "1", name: "frontend" },
          { id: "2", name: "backend" },
        ]}
        selectedLabels={["frontend"]}
        onToggle={onToggle}
      />
    );

    const frontendCheckbox = screen.getByRole("checkbox", { name: "frontend" });
    const backendCheckbox = screen.getByRole("checkbox", { name: "backend" });

    expect(frontendCheckbox).toBeChecked();
    expect(backendCheckbox).not.toBeChecked();

    fireEvent.click(backendCheckbox);
    expect(onToggle).toHaveBeenCalledWith("backend");
  });
});
