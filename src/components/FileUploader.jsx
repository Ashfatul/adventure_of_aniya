'use client';
import { FileImage, UploadCloud, X } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function FileUploader({ onFilesSelected, maxFiles = 5 }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const addFiles = useCallback((newFiles) => {
    // Basic validation (image only)
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
    const updatedFiles = [...files, ...validFiles].slice(0, maxFiles);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  }, [files, maxFiles, onFilesSelected]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      addFiles(newFiles);
    }
  }, [addFiles]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? 'border-sky-500 bg-sky-50 scale-[1.02]' : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50'}`}
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
      >
        <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-2 pointer-events-none">
            <div className="p-3 bg-white rounded-full shadow-sm">
                <UploadCloud className="w-8 h-8 text-sky-500" />
            </div>
            <p className="font-bold text-slate-700">Click or Drag photos here</p>
            <p className="text-xs text-slate-400">Up to {maxFiles} images</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {files.map((file, idx) => (
                <div key={idx} className="relative group bg-white p-2 rounded-lg border border-slate-100 shadow-sm flex items-center gap-2 overflow-hidden">
                    <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center shrink-0">
                        <FileImage className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-600 truncate">{file.name}</span>
                    <button 
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute right-1 top-1 p-1 bg-rose-100 text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
