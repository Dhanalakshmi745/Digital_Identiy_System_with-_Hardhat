import { useState } from 'react';
import { 
  FileText, 
  Trash2, 
  CheckCircle, 
  Clock, 
  XCircle,
  Search,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface Document {
  id: string;
  type: string;
  ipfsCID: string;
  status: 'pending' | 'verified' | 'not-found';
  uploadedAt: string;
  fileName: string;
  fileSize: number;
}

interface DocumentsViewProps {
  user: any;
  onUpdate: (data: any) => void;
}


export function DocumentsView({ user, onUpdate }: DocumentsViewProps) {
  const [verifying, setVerifying] = useState<string | null>(null);
  const [searchCID, setSearchCID] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);

  const documents: Document[] = user.documents || [];

  const handleDelete = (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      const updatedDocuments = documents.filter((doc: Document) => doc.id !== docId);
      onUpdate({ documents: updatedDocuments });
    }
  };

  const handleVerify = async (docId: string, ipfsCID: string) => {
    setVerifying(docId);

    // Simulate IPFS verification
    await new Promise(resolve => setTimeout(resolve, 2000));

    const updatedDocuments = documents.map((doc: Document) => {
      if (doc.id === docId) {
        // Simulate random verification result
        const isVerified = Math.random() > 0.2; // 80% success rate
        return {
          ...doc,
          status: isVerified ? 'verified' : 'not-found'
        };
      }
      return doc;
    });

    onUpdate({ documents: updatedDocuments });
    setVerifying(null);
  };

  const handleSearch = async () => {
    if (!searchCID.trim()) return;

    setSearchResult({ loading: true });
    
    // Simulate IPFS search
    await new Promise(resolve => setTimeout(resolve, 1500));

    const doc = documents.find((d: Document) => d.ipfsCID === searchCID);
    
    if (doc) {
      setSearchResult({
        found: true,
        document: doc,
        metadata: {
          size: doc.fileSize,
          uploadDate: doc.uploadedAt,
          type: doc.type
        }
      });
    } else {
      setSearchResult({
        found: false,
        message: 'Document not found in IPFS network'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case 'not-found':
        return (
          <span className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
            <XCircle className="w-4 h-4 mr-1" />
            Not Found
          </span>
        );
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-gray-900 mb-2">Identity Documents</h2>
        <p className="text-gray-600 mb-6">
          Manage and verify your uploaded identity documents
        </p>

        {/* Search by CID */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Verify Document by IPFS CID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchCID}
              onChange={(e) => setSearchCID(e.target.value)}
              placeholder="Enter IPFS CID to verify..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </div>

          {searchResult && !searchResult.loading && (
            <div className={`mt-4 p-4 rounded-lg border ${
              searchResult.found 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              {searchResult.found ? (
                <div>
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-900">Document Found & Verified</span>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>Type: {searchResult.document.type}</p>
                    <p>Size: {formatFileSize(searchResult.metadata.size)}</p>
                    <p>Uploaded: {new Date(searchResult.document.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-900">{searchResult.message}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No Documents Yet</h3>
          <p className="text-gray-600 mb-4">
            Upload your first identity document to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc: Document) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="text-gray-900">{doc.type}</h3>
                    <p className="text-sm text-gray-500">{doc.fileName}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start text-sm">
                  <span className="text-gray-500 mr-2">CID:</span>
                  <span className="text-gray-900 font-mono text-xs break-all">
                    {doc.ipfsCID.slice(0, 10)}...{doc.ipfsCID.slice(-8)}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 mr-2">Size:</span>
                  <span className="text-gray-900">{formatFileSize(doc.fileSize)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 mr-2">Uploaded:</span>
                  <span className="text-gray-900">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                {getStatusBadge(doc.status)}
                
                {doc.status === 'pending' && (
                  <button
                    onClick={() => handleVerify(doc.id, doc.ipfsCID)}
                    disabled={verifying === doc.id}
                    className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50 flex items-center"
                  >
                    {verifying === doc.id ? (
                      'Verifying...'
                    ) : (
                      <>
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Verify
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
