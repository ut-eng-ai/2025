import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';

// PDF.jsのワーカースクリプトを設定
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFInfo {
  date: string;
  title: string;
  filename: string;
}

interface HomeProps {
  pdfs: PDFInfo[];
}

export default function Home({ pdfs = [] }: HomeProps) {
  const [selectedPdf, setSelectedPdf] = useState<PDFInfo | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const getPageWidth = () => {
    if (windowWidth === 0) return 1200;
    return Math.min(windowWidth - 40, 1200);
  };

  if (!pdfs || pdfs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-4xl p-4">
          <p className="text-center text-[#231815]">PDFファイルが見つかりません。</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>AI時代の計算機と人間</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-4xl p-4">
          <div className="flex justify-center items-center mb-8">
            <div className="flex items-center">
              <Image
                src="/images/title.svg"
                alt="AI時代の計算機と人間"
                width={400}
                height={100}
                className="h-12 w-auto"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {selectedPdf && (
              <div className="mb-8">
                <div className="flex justify-center">
                  <Document
                    file={`/pdfs/${selectedPdf.filename}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center"
                    loading={<div className="text-center">PDFを読み込み中...</div>}
                    error={<div className="text-center text-red-500">PDFの読み込みに失敗しました</div>}
                  >
                    <Page
                      pageNumber={pageNumber}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="shadow-lg"
                      width={getPageWidth()}
                      loading={<div className="text-center">ページを読み込み中...</div>}
                      error={<div className="text-center text-red-500">ページの読み込みに失敗しました</div>}
                    />
                  </Document>
                </div>

                <div className="flex justify-center mt-4 space-x-4 items-center">
                  <button
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-neumorphism-light text-primary shadow-neumorphism hover:shadow-neumorphism-inset disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <span className="px-4 py-2 text-primary text-sm flex items-center font-bold">
                    {pageNumber} / {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                    disabled={pageNumber >= numPages}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-neumorphism-light text-primary shadow-neumorphism hover:shadow-neumorphism-inset disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {pdfs.map((pdf) => (
              <div
                key={pdf.filename}
                className="p-3 shadow-neumorphism rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-primary font-bold">{pdf.date}</p>
                    <h2 className="text-lg font-medium text-primary font-bold">{pdf.title}</h2>
                  </div>
                  {pdf.filename && (
                    <button
                      onClick={() => {
                        setSelectedPdf(pdf);
                        setPageNumber(1);
                      }}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-neumorphism-light text-primary shadow-neumorphism hover:shadow-neumorphism-inset disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'pdfs.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    return {
      props: {
        pdfs: jsonData.pdfs || [],
      },
    };
  } catch (error) {
    console.error('Error loading PDF data:', error);
    return {
      props: {
        pdfs: [],
      },
    };
  }
}