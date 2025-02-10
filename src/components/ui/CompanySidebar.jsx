import axios from "axios";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { db, storage } from "../../firebase";

const CompanySidebar = ({ isOpen, onClose, companyDetails }) => {
  console.log("🚀 ~ CompanySidebar ~ isOpen:", isOpen);
  console.log("🚀 ~ CompanySidebar ~ companyDetails:", companyDetails);
  const [editedCompany, setEditedCompany] = useState({
    name: "",
    shortName: "",
    email: "",
    phone: "",
    status: "Active",
    address: "",
    city: "",
    logo: "",
    zipCode: "",
  });
  const [userPhone, setUserPhone] = useState("");
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    if (companyDetails) {
      setEditedCompany({
        name: companyDetails?.company?.name || "",
        shortName:
          companyDetails?.company?.shortName || companyDetails?.company?.name,
        email: companyDetails?.company?.email || "",
        phone: companyDetails?.company?.phone || "",
        status: companyDetails?.company?.status || "Active",
        address: companyDetails?.company?.address || "",
        city: companyDetails?.company?.city || "",
        logo: companyDetails?.company?.companyLogo || "",
        zipCode: companyDetails?.company?.zipCode || "",
      });
      setCompanyId(companyDetails?.company?.id);
    } else {
      setEditedCompany({
        name: "",
        shortName: "",
        email: "",
        phone: "",
        status: "Active",
        address: "",
        city: "",
        logo: "",
        zipCode: "",
      });
    }
  }, [companyDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedCompany((prev) => ({
        ...prev,
        logo: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let logoUrl = editedCompany.logo;
      if (logoUrl && typeof logoUrl !== "string") {
        const file = logoUrl;
        const storageRef = ref(storage, `logos/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await uploadTask;
        logoUrl = await getDownloadURL(storageRef);
      }
      console.log(companyId);
      if (companyId) {
        const companyRef = doc(db, "companies", companyId);
        await updateDoc(companyRef, {
          name: editedCompany.name,
          shortName: editedCompany.shortName,
          email: editedCompany.email,
          phone: editedCompany.phone,
          status: editedCompany.status,
          address: editedCompany.address,
          city: editedCompany.city,
          companyLogo: logoUrl,
          zipCode: editedCompany.zipCode,
        });
      } else {
        const newCompanyRef = collection(db, "companies");
        const userRef = collection(db, "users");
        const q = query(userRef, where("phone", "==", userPhone));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          alert("A company with this user phone number already exists!");
          let userDocId = querySnapshot.docs[0].id;
          const userDocRef = doc(db, "users", userDocId);
          await addDoc(newCompanyRef, {
            name: editedCompany.name,
            shortName: editedCompany.shortName,
            email: editedCompany.email,
            phone: editedCompany.phone,
            status: editedCompany.status,
            address: editedCompany.address,
            city: editedCompany.city,
            companyLogo: logoUrl,
            zipCode: editedCompany.zipCode,
            createdAt: Timestamp.fromDate(new Date()),
            userRef: userDocRef,
          });
        } else {
          try {
            const res = await axios.post(
              "https://addcompanywithoutotp-tacovxawma-uc.a.run.app",
              {
                phoneNumber: `+91${userPhone}`,
              }
            );
            if (res.status === 200) {
              const userRef = res.data.userRef;
              await addDoc(newCompanyRef, {
                name: editedCompany.name,
                shortName: editedCompany.shortName,
                email: editedCompany.email,
                phone: editedCompany.phone,
                status: editedCompany.status,
                address: editedCompany.address,
                city: editedCompany.city,
                companyLogo: logoUrl,
                zipCode: editedCompany.zipCode,
                createdAt: Timestamp.fromDate(new Date()),
                userRef,
              });
            }
          } catch (error) {
            console.error(error);
            alert("Failed to add company without OTP. Please try again later!");
          }
        }
        console.log("New company added successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Error saving company details:", error);
    }
  };

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
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between border-b p-3">
          <h2 className="text-xl font-semibold">
            {companyId ? "Edit Company" : "Add Company"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-[calc(100vh-128px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6" id="companyForm">
            <div className="grid grid-cols-2 gap-4">
              {/* Input Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editedCompany.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Short Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="shortName"
                  value={editedCompany.shortName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={editedCompany.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editedCompany.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className={``}>
                <label className={`block text-sm font-medium text-gray-700 `}>
                  User Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    companyDetails && "cursor-not-allowed"
                  }`}
                  required
                  disabled={companyDetails}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={editedCompany.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={editedCompany.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Zipcode
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={editedCompany.zipCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="rounded-lg flex flex-col sm:flex-row items-center justify-between h-30 border-gray-300 w-full">
                {/* Left Side: Upload Icon and Text */}
                <div className="flex flex-col items-center justify-center sm:mr-4 mb-4 sm:mb-0 border-2 border-dashed p-6 mt-3">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <label
                    className="cursor-pointer block text-sm font-medium text-gray-700"
                    htmlFor="file-upload"
                  >
                    Upload Logo
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
                {/* Right Side: Image Preview */}
                {editedCompany.logo && (
                  <div className="sm:ml-4 flex items-center justify-center mt-4 sm:mt-0">
                    <img
                      src={
                        typeof editedCompany.logo === "string"
                          ? editedCompany.logo
                          : URL.createObjectURL(editedCompany.logo)
                      }
                      alt="Logo Preview"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="companyForm"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default CompanySidebar;
