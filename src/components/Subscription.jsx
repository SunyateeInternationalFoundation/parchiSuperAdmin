import { PenLine, Copy } from "lucide-react"
import { useState } from "react"
import AddSubscriptionSidebar from "./ui/AddSubscriptionSideBar"

const Subscription = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const plans = [
    {
      name: "Plan B",
      monthlyPrice: 650.0,
      annualPrice: 2500.0,
      maxProducts: 100000,
      enabledModules: [
        "Stock Transfer",
        "Expense",
        "Sales Return",
        "Reports",
        "Stock Adjustment",
        "Purchase Return",
        "Reports Download",
        "Quotation/Estimate",
        "POS",
      ],
    },
    {
      name: "Default",
      monthlyPrice: 0.0,
      annualPrice: 0.0,
      maxProducts: 5,
      enabledModules: [
        "Stock Transfer",
        "Stock Adjustment",
        "Expense",
        "Quotation/Estimate",
        "POS",
        "Reports",
        "Sales Return",
        "Purchase Return",
        "Online Store",
        "Reports Download",
      ],
    },
  ]


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Subscription Plans</h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>/</span>
          <span>Subscriptions</span>
          <span>/</span>
          <span>Subscription Plans</span>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <button className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => setIsSidebarOpen(true)}
        >
          <span>+</span>
          Add New Subscription Plan
        </button>
        <button className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Free Trail Settings
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-700">Offline Payment Modes</h2>
        <div className="mt-2">
          <div className="rounded-md bg-white p-4 shadow-sm">
            <h3 className="text-gray-600">Stripe</h3>
          </div>
        </div>
      </div>

      {/* Subscription Plans Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Pricing Details</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Max Products</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Enabled Modules</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {plans.map((plan, index) => (
              <tr key={index}>
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{plan.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>Monthly Price: ${plan.monthlyPrice.toFixed(2)}</div>
                  <div>Annual Price: ${plan.annualPrice.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{plan.maxProducts.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <ul className="list-inside list-disc space-y-1 text-sm text-gray-900">
                    {plan.enabledModules.map((module, idx) => (
                      <li key={idx}>{module}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600">
                      <PenLine className="h-4 w-4" />
                    </button>
                    <button className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">10 / page</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50">Previous</button>
            <span className="text-sm">Page 1</span>
            <button className="rounded border border-gray-300 px-3 py-1 text-sm">Next</button>
          </div>
        </div>
      </div>
      <AddSubscriptionSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}

export default Subscription

