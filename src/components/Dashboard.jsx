import { useState, useEffect } from "react";
import { Bell, FileText, Eye, AlertTriangle } from "lucide-react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import CompanySidebar from "./ui/CompanySidebar";

const StatCard = ({ icon: Icon, title, value, bgColor }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4 w-full">
    <div className={`${bgColor} rounded-xl p-3 w-12 h-12 flex items-center justify-center`}>
      <Icon className="text-white" size={24} />
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-semibold">{value}</span>
      <span className="text-gray-400 text-sm">{title}</span>
    </div>
  </div>
);

const CompanyTable = ({ companies, setIsSidebarOpen }) => (
  
  <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
    <div className="flex justify-between items-center p-4 border-b flex-wrap gap-2">
      <h2 className="text-lg font-semibold">Recently Registered Companies</h2>
      <button className="text-blue-500 hover:underline">View All →</button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Company Logo", "Company Name", "Company Email", "Details", "Subscription Plan", "Status", "Action"].map(
              (header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
  {companies.map((company, index) => (
    <tr key={index}>
      <td className="px-4 py-4">
        <img
          src={`${company.companyLogo}`}
          alt={`${company.name} logo`}
          className="h-8 w-8 rounded-full"
        />
      </td>
      <td className="px-4 py-4 whitespace-nowrap">{company.name}</td>
      <td className="px-4 py-4 whitespace-nowrap">{company.email}</td>
      <td className="px-4 py-4">
        <ul>
          <li>Verified: ✗</li>
          <li>Register Date: {company.createdAt}</li>
          <li>Total Users: {company.users}</li>
        </ul>
      </td>
      <td className="px-4 py-4">
        <span>{company.plan || "Free"}</span>
        <button className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">Change</button>
      </td>
      <td className="px-4 py-4">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            company.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {company.status || "Active"}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <button
          className="text-gray-400 hover:text-gray-500 mr-2"
          onClick={() =>
            setIsSidebarOpen({
              open: true,
              company: company, // Pass the full company object here
            })
          }
        >
          ✏️
        </button>
        <button className="text-gray-400 hover:text-gray-500">🗑️</button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  </div>
);

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const companiesPerPage = 5;

  useEffect(() => {
    // Disable body scroll when sidebar is open
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; 
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);
  useEffect(() => {
    const fetchCompanies = async () => {
      const snapshot = await getDocs(collection(db, "companies"));
      const companyList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("��� ~ fetchCompanies ~ companyList:", companyList);
      // const mappedCompanies = companyList.map((company) => [
      //   company.name || "N/A",
      //   company.email || "N/A",
      //   company.createdAt || "N/A",
      //   company.users || "0",
      //   company.plan || "Free",
      //   company.status || "Inactive",
      //   company.id,
      // ]);
      setCompanies(companyList);
    };

    fetchCompanies();
  }, []);
  const handleEditClick = (company) => {
    setCompanyDetails({
      isOpen: true,
      company: { company }, // Match the expected structure
    }); // Set the company details
    setIsSidebarOpen(true); // Open the sidebar
  };

  const totalPages = Math.ceil(companies.length / companiesPerPage);
  const currentCompanies = companies.slice((currentPage - 1) * companiesPerPage, currentPage * companiesPerPage);

  return (
    <div className={`p-4 md:p-6 bg-inherit max-h-screen ${isSidebarOpen ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
     <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <StatCard icon={Bell} title="Total Companies" value={companies.length} bgColor="bg-blue-500" />
        <StatCard icon={FileText} title="Active Companies" value={companies.length} bgColor="bg-green-500" />
        <StatCard icon={Eye} title="Inactive Companies" value="0" bgColor="bg-red-500" />
        <StatCard icon={AlertTriangle} title="License Expired" value="0" bgColor="bg-red-500" />
      </div>
      <CompanyTable companies={currentCompanies} setIsSidebarOpen={handleEditClick} />

      <div className="flex justify-center items-center mt-6 mb-2">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="text-blue-500 mr-4">
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages} className="text-blue-500 ml-4">
          Next
        </button>
      </div>
    </div>
    <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} companyDetails={companyDetails} />
    </div>
  );
};

export default Dashboard;
