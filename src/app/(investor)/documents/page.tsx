'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, FileText, X, Eye } from 'lucide-react';
import Breadcrumbs from '@/components/investor/Breadcrumbs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Document {
  id: string;
  name: string;
  filePath: string;
  fileSize: number;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [markdownContent, setMarkdownContent] = useState<string>('');

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/documents');
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      setDocuments(data);
      if (data.length > 0 && !selectedDocument) {
        setSelectedDocument(data[0]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF or Markdown)
    const isMarkdown = file.name.endsWith('.md') || file.name.endsWith('.markdown');
    const isPdf = file.type === 'application/pdf';

    if (!isPdf && !isMarkdown) {
      alert('Please upload a PDF or Markdown (.md) file');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const newDocument = await response.json();
      setDocuments([newDocument, ...documents]);
      setSelectedDocument(newDocument);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleDownload = (doc: Document) => {
    const link = document.createElement('a');
    link.href = doc.filePath;
    link.download = doc.name;
    link.click();
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setDocuments(documents.filter(doc => doc.id !== docId));
      if (selectedDocument?.id === docId) {
        setSelectedDocument(documents.length > 1 ? documents[0] : null);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isMarkdownFile = (doc: Document) => {
    return doc.name.endsWith('.md') || doc.name.endsWith('.markdown');
  };

  // Fetch markdown content when a markdown file is selected
  useEffect(() => {
    const fetchMarkdownContent = async () => {
      if (selectedDocument && isMarkdownFile(selectedDocument)) {
        try {
          const response = await fetch(selectedDocument.filePath);
          const text = await response.text();
          setMarkdownContent(text);
        } catch (error) {
          console.error('Error fetching markdown content:', error);
          setMarkdownContent('Failed to load markdown content.');
        }
      }
    };

    fetchMarkdownContent();
  }, [selectedDocument]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-brand-500 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Investor Documents</h1>
          <p className="text-white/80">View and manage investor-related documents</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Investor Pitch', href: '/pitch' },
            { label: 'Documents' }
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document List - Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf,.md,.markdown"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm">
                    <Upload className="w-4 h-4" />
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </div>
                </label>
              </div>

              {/* Document Thumbnails */}
              <div className="space-y-2">
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Loading documents...</p>
                  </div>
                ) : documents.length > 0 ? (
                  documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedDocument?.id === doc.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-16 rounded flex items-center justify-center ${
                            isMarkdownFile(doc)
                              ? 'bg-blue-100'
                              : 'bg-red-100'
                          }`}>
                            <FileText className={`w-6 h-6 ${
                              isMarkdownFile(doc)
                                ? 'text-blue-600'
                                : 'text-red-600'
                            }`} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(doc.createdAt)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatFileSize(doc.fileSize)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(doc.id);
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No documents yet</p>
                    <p className="text-xs">Upload a PDF or Markdown file to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Document Viewer - Right Side */}
          <div className="lg:col-span-2">
            {selectedDocument ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Viewer Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {selectedDocument.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Uploaded on {formatDate(selectedDocument.createdAt)} • {formatFileSize(selectedDocument.fileSize)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedDocument)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ml-4"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>

                {/* Document Viewer */}
                <div className="p-4">
                  {isMarkdownFile(selectedDocument) ? (
                    // Markdown Viewer
                    <div className="bg-white rounded-lg overflow-auto p-8" style={{ height: 'calc(100vh - 300px)' }}>
                      <article className="prose prose-slate max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {markdownContent}
                        </ReactMarkdown>
                      </article>
                    </div>
                  ) : (
                    // PDF Viewer
                    <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 300px)' }}>
                      <iframe
                        src={selectedDocument.filePath}
                        className="w-full h-full"
                        title={selectedDocument.name}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center text-gray-500 py-20">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No document selected</p>
                  <p className="text-sm">Select a document from the list to view it</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
