// This test verifies that PublicationPanel shows summary/source information and opens the PDF preview with pagination controls.
import { fireEvent, render, screen } from "@testing-library/react";
import PublicationPanel from "../PublicationPanel";

vi.mock("react-pdf", () => ({
  pdfjs: { GlobalWorkerOptions: {} },
  Document: ({ children, onLoadSuccess }) => {
    onLoadSuccess?.({ numPages: 3 });
    return <div data-testid="pdf-document">{children}</div>;
  },
  Page: ({ pageNumber }) => <div data-testid="pdf-page">Page {pageNumber}</div>,
}));

describe("PublicationPanel", () => {
  it("renders summary and optional source link", () => {
    render(
      <PublicationPanel
        title="Lunar geology"
        summary="Summary"
        sourceUrl="https://example.com"
        pdfUrl="/assets/docs/example.pdf"
      />
    );

    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open source" })).toBeInTheDocument();
  });

  it("opens preview with page controls", () => {
    render(<PublicationPanel title="Spectroscopy" summary="Summary" pdfUrl="/assets/docs/example.pdf" />);

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByTestId("pdf-document")).toBeInTheDocument();
    expect(screen.getAllByText(/Page 1 \/ 3/i).length).toBeGreaterThan(0);
  });
});
