import { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadDocumentProps {
  user: any;
  onUpdate: (data: any) => void;
}

const DOCUMENT_TYPES = [
  'Aadhaar',
  'PAN Card',
  'Driving License',
  'Passport',
  'Voter ID',
  'Other'
];

export function UploadDocument({ user, onUpdate }: UploadDocumentProps) {
  const [selectedType, setSelectedType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');
    setSuccess(false);

    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only PDF, JPG, and PNG files are allowed');
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
  };

  const generateIPFSCID = () => {
    // Simulate IPFS CID generation
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let cid = 'Qm';
    for (let i = 0; i < 44; i++) {
      cid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return cid;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !selectedType) {
      setError('Please select document type and file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Simulate file upload to IPFS
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate IPFS CID
      const ipfsCID = generateIPFSCID();

      // Create document object
      const newDocument = {
        id: Date.now().toString(),
        type: selectedType,
        ipfsCID,
        status: 'pending',
        uploadedAt: new Date().toISOString(),
        fileName: file.name,
        fileSize: file.size,
      };

      // Update user documents
      const updatedDocuments = [...(user.documents || []), newDocument];
      onUpdate({ documents: updatedDocuments });

      // Reset form
      setFile(null);
      setSelectedType('');
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

      // Reset file input
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-gray-900 mb-2">Upload Identity Document</h2>
        <p className="text-gray-600 mb-6">
          Upload your identity documents securely to IPFS
        </p>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Document Type Selection */}
          <div>
            <label htmlFor="docType" className="block text-gray-700 mb-2">
              Document Type
            </label>
            <select
              id="docType"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select document type...</option>
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label htmlFor="fileInput" className="block text-gray-700 mb-2">
              Upload File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer flex flex-col items-center"
              >
                {file ? (
                  <>
                    <File className="w-12 h-12 text-indigo-600 mb-3" />
                    <p className="text-gray-900 mb-1">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-900 mb-1">Click to upload</p>
                    <p className="text-sm text-gray-500">
                      PDF, JPG, or PNG (max 10MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Your document is converted to Base64 format</li>
              <li>Stored securely on IPFS decentralized network</li>
              <li>You receive a unique Content Identifier (CID)</li>
              <li>Only the CID is linked to blockchain for verification</li>
              <li>Your actual document data remains private</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              Document uploaded successfully to IPFS!
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !file || !selectedType}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? (
              'Uploading to IPFS...'
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Document
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
