import { useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";

const MODULE_OPTIONS = [
  { id: "analytics", name: "Analytics" },
  { id: "reports", name: "Reports" },
  { id: "inventory", name: "Inventory Management" },
  { id: "vendor", name: "Vendor" },
  { id: "invoice", name: "Invoice" },
  { id: "POS", name: "POS" },
  { id: "sales", name: "Sales" },
  { id: "purchase", name: "Purchase" },
  { id: "customer", name: "Customer" },
  {id: "staff", name: "Staff and Payout(HRM)"}
];

const AddSubscriptionSidebar = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    maxProducts: "",
    description: "",
    isPopular: false,
    monthlyPrice: "",
    annualPrice: "",
    modules: [], // Store selected modules
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleModuleChange = (moduleId) => {
    setFormData((prev) => {
      const isSelected = prev.modules.includes(moduleId);
      return {
        ...prev,
        modules: isSelected
          ? prev.modules.filter((id) => id !== moduleId)
          : [...prev.modules, moduleId],
      };
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      // Add the subscription plan data to the Firestore 'plans' collection
      await addDoc(collection(db, "plans"), {
        name: formData.name,
        maxProducts: formData.maxProducts,
        description: formData.description,
        isPopular: formData.isPopular,
        monthlyPrice: formData.monthlyPrice,
        annualPrice: formData.annualPrice,
        modules: formData.modules, // Array of selected modules
      });
  
      console.log("Subscription Plan Added:", formData);
      onClose(); // Close the sidebar upon success
    } catch (error) {
      console.error("Error adding subscription plan:", error);
    }
  };

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed right-0 top-0 h-full w-[600px] bg-white shadow-lg transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 bg-white">
          <h2 className="text-xl font-semibold">Add New Subscription Plan</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Max Products */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                  className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="maxProducts"
                  value={formData.maxProducts}
                  onChange={handleInputChange}
                  placeholder="Enter Max Count for each module..."
                  className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter Description"
                rows={3}
                className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-blue-500"
                required
              />
            </div>

            {/* Modules Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Modules</h3>
              <div className="grid grid-cols-2 gap-4">
                {MODULE_OPTIONS.map((module) => (
                  <label key={module.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.modules.includes(module.id)}
                      onChange={() => handleModuleChange(module.id)}
                      className="rounded border-gray-300"
                    />
                    {module.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Pricing Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="monthlyPrice"
                      value={formData.monthlyPrice}
                      onChange={handleInputChange}
                      placeholder="Enter Monthly Price"
                      className="block w-full rounded-md border pl-7 pr-3 py-2 shadow-sm focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Annual Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                    <input
                      type="number"
                      name="annualPrice"
                      value={formData.annualPrice}
                      onChange={handleInputChange}
                      placeholder="Enter Annual Price"
                      className="block w-full rounded-md border pl-7 pr-3 py-2 shadow-sm focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer with Submit and Cancel */}
            <div className="bg-white border-t p-4 flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-blue-500"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default AddSubscriptionSidebar;
