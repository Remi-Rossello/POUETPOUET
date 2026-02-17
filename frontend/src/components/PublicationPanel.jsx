import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

function PublicationPanel({ title, summary, sourceUrl, pdfUrl }) {
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  useEffect(() => {
    setPage(1);
    setNumPages(null);
    setIsPreviewVisible(false);
  }, [pdfUrl]);

  const handleDocumentLoad = ({ numPages: totalPages }) => {
    setNumPages(totalPages);
    setPage((currentPage) => Math.min(currentPage, totalPages));
  };

  const renderPageControls = (className = "") => (
    <div className={`publication-page-controls ${className}`.trim()} role="group" aria-label="PDF page controls">
      <button
        className="button button-secondary publication-page-button"
        type="button"
        disabled={page <= 1}
        onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
      >
        ←
      </button>
      <span className="publication-page-indicator">Page {page}{numPages ? ` / ${numPages}` : ""}</span>
      <button
        className="button button-secondary publication-page-button"
        type="button"
        disabled={Boolean(numPages && page >= numPages)}
        onClick={() => setPage((currentPage) => currentPage + 1)}
      >
        →
      </button>
    </div>
  );

  return (
    <section className="lagrangian-panel publication-panel" aria-label={title}>
      <h1 className="content-title">{title}</h1>

      <div className="lagrangian-intro">
        <p className="lagrangian-blogpost">{summary}</p>
      </div>

      {sourceUrl && (
        <div className="equation-tree-box publication-source-box">
          <p className="equation-tree-title">Source</p>
          <a className="button button-secondary" href={sourceUrl} target="_blank" rel="noreferrer">
            Open source
          </a>
        </div>
      )}

      <div className="lagrangian-equation publication-media-box">
        <div className="publication-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => setIsPreviewVisible((visible) => !visible)}
          >
            {isPreviewVisible ? "Hide preview" : "Preview"}
          </button>
          <a className="button button-secondary" href={pdfUrl} target="_blank" rel="noreferrer">
            Open
          </a>
          <a className="button button-secondary" href={pdfUrl} download>
            Download
          </a>
        </div>

        {isPreviewVisible && (
          <>
            {renderPageControls()}

            <div className="publication-document-wrap">
              <Document
                className="publication-document"
                file={pdfUrl}
                onLoadSuccess={handleDocumentLoad}
                loading={<p className="lagrangian-loading">Loading PDF...</p>}
                error={<p className="lagrangian-loading">Failed to load PDF.</p>}
              >
                <Page className="publication-page" pageNumber={page} renderAnnotationLayer={false} renderTextLayer={false} />
              </Document>
            </div>

            {renderPageControls("publication-page-controls-bottom")}
          </>
        )}
      </div>
    </section>
  );
}

export default PublicationPanel;
