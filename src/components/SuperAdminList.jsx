import { collection, getDocs, query, where } from "firebase/firestore";
import { Pencil, Search, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import AddAdminList from "./ui/AddAdminList";

const SuperAdminList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedAdmin, setSelectedAdmin] = useState("");

  const fetchAdmins = async () => {
    try {
      const q = query(collection(db, "users"), where("isAdmin", "==", true));
      const snapshot = await getDocs(q);
      const adminList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdmins(adminList);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchAdmins();
  }, []);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    fetchAdmins(); // Trigger admin list re-fetch when sidebar is closed
  };

  const filteredAdmins = admins.filter((admin) =>
    admin[searchType].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const displayedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Super Admin</h1>
          <div className="text-sm text-gray-500">
            <span>Dashboard</span>
            <span className="mx-2">-</span>
            <span>Super Admin</span>
          </div>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => setIsSidebarOpen(true)}
        >
          <span className="mr-2">+</span>
          Add New Super Admin
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow">
        {/* Table Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <select
            className="border rounded-md px-3 py-1.5 text-sm outline-none"
            onChange={(e) => setSearchType(e.target.value)}
            value={searchType}
          >
            <option value="name">Search by Name</option>
            <option value="email">Search by Email</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-4 py-1.5 border rounded-md text-sm w-64 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Table Content */}
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedAdmins.map((admin) => (
              <tr key={admin.id} className="border-b">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-3">
                    <UserCog size={16} />
                  </div>
                  {admin.name}
                </td>
                <td className="px-6 py-4 text-sm">{admin.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                    Enabled
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded"
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setIsSidebarOpen(true);
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t">
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
              {currentPage}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
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
        </div>
      </div>
      <AddAdminList
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        adminData={selectedAdmin}
      />
    </div>
  );
};

export default SuperAdminList;
