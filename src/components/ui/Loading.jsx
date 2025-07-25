import React from "react";

const Loading = ({ type = "default" }) => {
  if (type === "orders") {
    return (
      <div className="space-y-4 animate-fade-in">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "menu") {
    return (
      <div className="space-y-4 animate-fade-in">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              </div>
              <div className="flex flex-col items-end space-y-2 ml-6">
                <div className="h-7 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-full w-12 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "tables") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 animate-fade-in">
        {[...Array(16)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 aspect-square">
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-64 animate-fade-in">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;