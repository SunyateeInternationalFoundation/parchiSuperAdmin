import React from 'react';
import { Search, ChevronDown, Mail } from "lucide-react";
 // Using react-feather for icons

const Transactions = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Transcations</h1>
        <div className="flex items-center text-sm text-gray-500">
          <span>Dashboard</span>
          <span className="mx-2">-</span>
          <span className="text-gray-700">Transcations</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex justify-end mb-6">
        <div className="relative">
          <div className="flex items-center border rounded-lg bg-white px-4 py-2 w-64 cursor-pointer">
            <span className="text-gray-600 text-sm">Select...</span>
            <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
          </div>
          <div className="absolute right-0 top-0 h-full flex items-center pr-2">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-600">
          <div>Date</div>
          <div>Company</div>
          <div>Transaction ID</div>
          <div>Next Payment Date</div>
          <div>Payment Method</div>
          <div>Action</div>
        </div>

        {/* No Data State */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <Mail className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-400">No data</p>
        </div>
      </div>

      {/* Sample data row (commented out) - uncomment and map through your data when available */}
      {/* 
      <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b hover:bg-gray-50">
        <div className="text-sm text-gray-900">2025-02-08</div>
        <div className="text-sm text-gray-900">Company Name</div>
        <div className="text-sm text-gray-900">#TRX-123456</div>
        <div className="text-sm text-gray-900">2025-03-08</div>
        <div className="text-sm text-gray-900">Credit Card</div>
        <div>
          <button className="text-blue-600 hover:text-blue-800">View</button>
        </div>
      </div>
      */}
    </div>
  );
};

export default Transactions;