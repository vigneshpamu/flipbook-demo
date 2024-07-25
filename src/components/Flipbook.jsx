import React, { useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PageContent = React.forwardRef(({ pageNumber, width }, ref) => {
  return (
    <div className="page" ref={ref} data-density="soft">
      <div className="page-content">
        <div className="page-image">
          <Page
            pageNumber={pageNumber}
            width={width}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading=" "
          />
        </div>
        <div className="page-footer">{pageNumber}</div>
      </div>
    </div>
  );
});

PageContent.displayName = "PageContent";

function Flipbook() {
  const [numPages, setNumPages] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);
  const [allPagesLoaded, setAllPagesLoaded] = useState(false);
  const pageWidth = 400;

  function onDocumentLoadSuccess({ numPages }) {
    console.log("PDF loaded successfully with", numPages, "pages");
    setNumPages(numPages);
    setPdfLoading(false);
  }

  function onDocumentLoadError(error) {
    console.error("Error loading PDF:", error);
    setPdfError(error);
    setPdfLoading(false);
  }

  useEffect(() => {
    if (!pdfLoading && numPages) {
      const loadPages = async () => {
        const pagePromises = Array.from({ length: numPages }, (_, i) =>
          pdfjs
            .getDocument(
              "https://static.packt-cdn.com/downloads/9781800560635_ColorImages.pdf"
            )
            .promise.then((pdf) => pdf.getPage(i + 1))
        );
        await Promise.all(pagePromises);
        setAllPagesLoaded(true);
      };
      loadPages();
    }
  }, [pdfLoading, numPages]);

  if (pdfError) {
    return (
      <div className="text-white text-xl">
        Error loading PDF: {pdfError.message}
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col gap-5 justify-center items-center bg-gray-900 overflow-hidden">
      <h1 className="text-3xl text-white text-center font-bold">FlipBook</h1>
      <Document
        file={{
          url: "https://static.packt-cdn.com/downloads/9781800560635_ColorImages.pdf",
        }}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="text-white text-xl flex items-center justify-center h-[570px] w-[800px] bg-gray-800 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mr-3"></div>
            Loading PDF...
          </div>
        }
      >
        {allPagesLoaded ? (
          <HTMLFlipBook
            width={pageWidth}
            height={570}
            size="stretch"
            minWidth={pageWidth}
            maxWidth={pageWidth * 2}
            minHeight={570}
            maxHeight={800}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            className="demo-book"
            startPage={0}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={false}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={0}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <PageContent
                key={index}
                pageNumber={index + 1}
                width={pageWidth}
              />
            ))}
          </HTMLFlipBook>
        ) : (
          <div className="text-white text-xl flex items-center justify-center h-[570px] w-[800px] bg-gray-800 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mr-3"></div>
            Preparing pages...
          </div>
        )}
      </Document>
    </div>
  );
}

export default Flipbook;
