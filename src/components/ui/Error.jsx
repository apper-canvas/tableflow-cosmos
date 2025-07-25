import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 px-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}. Please try again or contact support if the problem persists.
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;