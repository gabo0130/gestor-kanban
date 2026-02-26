import { fireEvent, render, screen } from "@testing-library/react";
import { InformativeModal } from "./InformativeModal";

describe("InformativeModal", () => {
  it("does not render when open is false", () => {
    const { container } = render(
      <InformativeModal
        open={false}
        title="Aviso"
        message="Mensaje"
        onClose={jest.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders content and handles close", () => {
    const onClose = jest.fn();

    render(
      <InformativeModal
        open
        title="Aviso"
        message="Operación completada"
        onClose={onClose}
      />
    );

    expect(screen.getByText("Aviso")).toBeInTheDocument();
    expect(screen.getByText("Operación completada")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Entendido" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
