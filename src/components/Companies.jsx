import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import CompanySidebar from "./ui/CompanySidebar";

const CompanyTable = ({ companies, setIsSidebarOpen }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companies.length > 0) {
      setLoading(false);
    }
  }, [companies]);
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Company Logo",
                "Company Name",
                "Company Email",
                "Details",
                "Subscription Plan",
                "Status",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          {loading ? (
            <tr>
              <td
                colSpan="7"
                className="px-4 py-10 text-center text-lg font-medium text-gray-500"
              >
                Loading...
              </td>
            </tr>
          ) : (
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
                  <td className="px-4 py-4 whitespace-nowrap">
                    {company.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {company.email}
                  </td>
                  <td className="px-4 py-4">
                    <ul>
                      <li>Verified: ✗</li>
                      <li>
                        Register Date: Register Date:
                        {company.createdAt
                          ? new Date(
                              company.createdAt.seconds * 1000
                            ).toLocaleDateString()
                          : "NA"}
                      </li>
                      <li>Total Users: {company.users}</li>
                    </ul>
                  </td>
                  <td className="px-4 py-4">
                    <span>{company.plan || "Free"}</span>
                    <button className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                      Change
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        company.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
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
                    <button className="text-gray-400 hover:text-gray-500">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
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
      setCompanies(companyList);
    };

    fetchCompanies();
  }, []);
  const handleEditClick = (company) => {
    setCompanyDetails(company);
    setIsSidebarOpen(true);
  };
  const handleNewCompanyClick = () => {
    setCompanyDetails(null); // Reset the company details when adding a new company
    setIsSidebarOpen(true);
  };

  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const currentCompanies = companies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div
      className={`p-4 md:p-6 bg-inherit max-h-screen ${
        isSidebarOpen ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      <div>
        {/* Header Section with Flexbox */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Companies</h1>
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-lg text-black text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            onClick={handleNewCompanyClick}
          >
            <span className="text-lg">➕</span> Add Company
          </button>
        </div>

        <CompanyTable
          companies={currentCompanies}
          setIsSidebarOpen={handleEditClick}
        />

        {/* <div className="flex justify-center items-center mt-6 mb-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-blue-500 mr-4"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="text-blue-500 ml-4"
          >
            Next
          </button>
        </div> */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <select
              className="border rounded-md px-3 py-1.5 text-sm outline-none"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value="5">5 / page</option>
              <option value="10">10 / page</option>
              <option value="50">50 / page</option>
              <option value="100">100 / page</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">
              {" "}
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded border border-gray-300 px-3 py-1 text-sm"
            >
              Next
            </button>
          </div>
        </div>
        <CompanySidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          companyDetails={companyDetails}
        />
      </div>
    </div>
  );
};

export default Companies;
