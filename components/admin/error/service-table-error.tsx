import React from "react";

const ServiceTableError = ( { 
    reload
} : { reload: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-3">
        Oops! Something went wrong 😔
      </h1>
      <p className="text-gray-600 mb-5">
        We couldn’t load the data. Please check your internet connection or try again later.
      </p>
      <button
        onClick={() => reload()}
        className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
      >
        Retry
      </button>
    </div>
  );
};

export default ServiceTableError;
