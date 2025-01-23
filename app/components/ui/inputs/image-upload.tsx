import React from "react";

type ImageUploadLabelProps = {
  handleImageUpload: (imageSrc: string | undefined) => void;
  placeholder?: React.ReactNode;
};

const ImageUploadLabel: React.FC<ImageUploadLabelProps> = ({
  handleImageUpload,
  placeholder,
}) => {
  return (
    <div
      className={`bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer  mx-auto font-sans ${
        placeholder
          ? "placeholder-defined"
          : "border-2 border-gray-300 border-dashed"
      }`}
      //     placeholder
      //     ? ""
      //     : `bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto p-4 font-sans `
      // }
    >
      {placeholder ? (
        <>
          {placeholder}
          <label
            htmlFor="uploadFile"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 text-sm cursor-pointer hover:bg-blue-600 transition"
          >
            Select Image
          </label>
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-11 mb-2 fill-gray-500"
            viewBox="0 0 32 32"
          >
            <path d="M23.75 11.044a8 8 0 1 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 1 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" />
            <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 1 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" />
          </svg>
          <p className="text-xs font-medium text-gray-400 mt-2">
            PNG, JPG, SVG, WEBP, and GIF are allowed.
          </p>
        </>
      )}
      <input
        type="file"
        id="uploadFile"
        className={`mt-4 ${
          placeholder
            ? "hidden" // Hide the input if placeholder is defined
            : "block bg-gray-100 text-sm p-2 rounded-md w-full max-w-xs border border-gray-300"
        }`}
        accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              handleImageUpload(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </div>
  );
};

export default ImageUploadLabel;
