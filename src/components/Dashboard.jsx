import { Bell, FileText, AlertTriangle, Eye } from 'lucide-react'

const StatCard = ({ icon: Icon, title, value, bgColor }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
      <div className={`${bgColor} rounded-xl p-3 w-12 h-12 flex items-center justify-center`}>
        <Icon className="text-white" size={24} />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-semibold">{value}</span>
        <span className="text-gray-400 text-sm">{title}</span>
      </div>
    </div>
  )

const CompanyTable = () => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <div className="flex justify-between items-center p-6 border-b">
      <h2 className="text-xl font-semibold">Recently Registered Companies</h2>
      <button className="text-blue-500 hover:underline">View All →</button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Logo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Plan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-01%20100937-wvTvJuxpzadlaxdUIB78FGN39mHjJY.png" alt="Stockifly logo" className="h-8 w-8" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">Stockifly</td>
            <td className="px-6 py-4 whitespace-nowrap">company@example.com</td>
            <td className="px-6 py-4">
              <ul className="text-sm">
                <li>Verified: ✗</li>
                <li>Register Date: 01-02-2025</li>
                <li>Total Users: 1</li>
              </ul>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span>Trial (monthly)</span>
              <button className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">Change</button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">Active</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button className="text-gray-400 hover:text-gray-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-01%20100937-wvTvJuxpzadlaxdUIB78FGN39mHjJY.png" alt="Stockifly logo" className="h-8 w-8" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">Parchi</td>
            <td className="px-6 py-4 whitespace-nowrap">parchi@example.com</td>
            <td className="px-6 py-4">
              <ul className="text-sm">
                <li>Verified: ✗</li>
                <li>Register Date: 02-02-2025</li>
                <li>Total Users: 10</li>
              </ul>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span>Blaze (yearly)</span>
              <button className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">Change</button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">Inactive</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button className="text-gray-400 hover:text-gray-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)

const Dashboard = () => {
  return (
    <div className="p-3 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={Bell} title="Total Companies" value="2" bgColor="bg-blue-500" />
        <StatCard icon={FileText} title="Active Companies" value="1" bgColor="bg-green-500" />
        <StatCard icon={Eye} title="Inactive Companies" value="1" bgColor="bg-orange-500" />
        <StatCard icon={AlertTriangle} title="License Expired" value="0" bgColor="bg-red-500" />
      </div>
      <CompanyTable />
    </div>
  )
}

export default Dashboard