import { useState } from "react"
import { X } from "lucide-react"
import { createPortal } from "react-dom"

const AddSubscriptionSidebar = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    maxProducts: "",
    description: "",
    isPopular: false,
    monthlyPrice: "",
    annualPrice: "",
    stripeMonthlyPlanId: "",
    stripeAnnualPlanId: "",
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    onClose()
  }

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed right-0 top-0 h-full w-[600px] bg-white shadow-lg transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">Add New Subscription Plan</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            
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
                  placeholder="Please Enter Name"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Products <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="maxProducts"
                  value={formData.maxProducts}
                  onChange={handleInputChange}
                  placeholder="Please Enter Max Products"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Please Enter Description"
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Is Popular</label>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleInputChange}
                  className="peer sr-only"
                />
                <span
                  className={`absolute left-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:translate-x-5 ${formData.isPopular ? "bg-blue-600" : ""}`}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      name="monthlyPrice"
                      value={formData.monthlyPrice}
                      onChange={handleInputChange}
                      placeholder="Please Enter Monthly Price"
                      className="block w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Annual Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      name="annualPrice"
                      value={formData.annualPrice}
                      onChange={handleInputChange}
                      placeholder="Please Enter Annual Price"
                      className="block w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Gateway</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stripe Monthly Plan ID</label>
                  <input
                    type="text"
                    name="stripeMonthlyPlanId"
                    value={formData.stripeMonthlyPlanId}
                    onChange={handleInputChange}
                    placeholder="Please Enter Stripe Monthly Plan ID"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stripe Annual Plan ID</label>
                  <input
                    type="text"
                    name="stripeAnnualPlanId"
                    value={formData.stripeAnnualPlanId}
                    onChange={handleInputChange}
                    placeholder="Please Enter Stripe Annual Plan ID"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal-root"),
  )
}

export default AddSubscriptionSidebar

