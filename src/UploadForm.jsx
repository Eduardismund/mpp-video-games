import React, {useEffect, useRef, useState} from 'react';
import {fileStore} from "./FileStore.js";
import {useToast} from "./ToastContext.jsx";


const UploadForm = ({onChange }) => {
  const {showToast} = useToast()
  const dropAreaRef = useRef(null);
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);

  const uploadSelectedFile = async (selectedFile) => {
    if (!selectedFile) return;

    try {
      setFileName(selectedFile.name);
      const { filename } = await fileStore.uploadFile(selectedFile);
      onChange(filename)
      showToast('File uploaded successfully!', 'success');
    } catch (error) {
      showToast('File upload failed.', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    const dropArea = dropAreaRef.current;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);

      const droppedFile = e.dataTransfer.files[0];
      await uploadSelectedFile(droppedFile);
    };



    const el = dropArea;
    el.addEventListener('dragenter', handleDragEnter);
    el.addEventListener('dragleave', handleDragLeave);
    el.addEventListener('dragover', handleDragOver);
    el.addEventListener('drop', handleDrop);

    return () => {
      el.removeEventListener('dragenter', handleDragEnter);
      el.removeEventListener('dragleave', handleDragLeave);
      el.removeEventListener('dragover', handleDragOver);
      el.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      await uploadSelectedFile(file);
    }
  };


  return (
    <div
      ref={dropAreaRef}
      className={`upload-container ${dragOver ? 'dragover' : ''}`}
      onClick={() => inputRef.current.click()}
    >
      <p>{fileName ? `Selected: ${fileName}` : 'Drag & drop your file here or'}</p>
      <label className="upload-button">Browse</label>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{display: 'none'}}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default UploadForm;
