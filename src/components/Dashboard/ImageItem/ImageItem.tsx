import React from "react";

interface ImageItemProps {
  file: File;
  index: number;
  removeFile: (index: number) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const ImageItem = ({
  file,
  index,
  removeFile,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDragEnd,
}: ImageItemProps) => {
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDrop={(e) => handleDrop(e, index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
      className="image-item bg-gray-100 px-3 py-1 rounded-lg flex flex-col items-center gap-1 
                 border-l-8 border-r-8 border-gray-200 shadow-sm cursor-grab 
                 transition hover:shadow-lg active:scale-[0.98]
                 focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-opacity-50"
      data-index={index}
      style={{
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="w-32 h-32 object-cover rounded-md"
      />
      <span className="text-sm truncate max-w-[128px]">{file.name}</span>
      <button
        type="button"
        className="text-red-500 font-bold hover:text-red-700 transition"
        onClick={() => removeFile(index)}
        aria-label="Remove image"
      >
        ×
      </button>
    </div>
  );
};
