"use client";

import { useState } from "react";
import Navbar from "../dashboard/page";
import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react";

export default function UploadCsvPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // "success", "error", or null

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setStatus(null);
      setMessage("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setStatus(null);
      setMessage("");
    } else {
      setStatus("error");
      setMessage("Please upload a CSV file");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("error");
      setMessage("Please select a file first");
      return;
    }

    setIsUploading(true);
    setStatus(null);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("csv", file);

      const res = await fetch("/api/upload-students", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Students data uploaded successfully!");
      } else {
        setStatus("error");
        setMessage(`Error: ${data.error || "Upload failed"}`);
      }
    } catch (err) {
      setStatus("error");
      setMessage("An error occurred while uploading. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileName("");
    setStatus(null);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-10 px-4 sm:px-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-xl font-semibold text-white flex items-center">
              <FileText className="mr-2" size={20} />
              Student Data Upload
            </h1>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                Upload Student CSV File
              </h2>
              <p className="text-gray-500 text-sm">
                Upload your CSV file containing student data. The file should
                include student name, email, ID, and other relevant information.
              </p>
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              } ${status === "error" ? "border-red-300 bg-red-50" : ""} ${
                status === "success" ? "border-green-300 bg-green-50" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!file ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2">
                      Drag and drop your CSV file here, or
                    </p>
                    <label className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Browse Files
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-400">
                    Only CSV files are supported
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-500 mr-3" />
                    <div className="text-left">
                      <p className="font-medium text-gray-700">{fileName}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearFile}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Status Message */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-md flex items-start ${
                  status === "error"
                    ? "bg-red-50 text-red-700"
                    : status === "success"
                    ? "bg-green-50 text-green-700"
                    : ""
                }`}
              >
                {status === "error" && <AlertCircle className="h-5 w-5 mr-2" />}
                {status === "success" && (
                  <CheckCircle className="h-5 w-5 mr-2" />
                )}
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={clearFile}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
                  !file || isUploading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
