import { render, screen } from "@testing-library/react";
import { AsyncListState } from "./AsyncListState";

describe("AsyncListState", () => {
  it("renders loading state", () => {
    render(<AsyncListState loading isEmpty={false} loadingText="Cargando items" />);

    expect(screen.getByText("Cargando items")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<AsyncListState loading={false} isEmpty emptyText="Sin resultados" />);

    expect(screen.getByText("Sin resultados")).toBeInTheDocument();
  });

  it("renders nothing when not loading and not empty", () => {
    const { container } = render(<AsyncListState loading={false} isEmpty={false} />);

    expect(container).toBeEmptyDOMElement();
  });
});
