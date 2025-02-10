import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { auth, db, storage } from "../../firebase";

const AddAdminList = ({ isOpen, onClose, adminData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "Enabled",
    profileImage: null,
    profileImageUrl: "",
    createdAt: Timestamp.fromDate(new Date()),
  });

  useEffect(() => {
    if (adminData) {
      setFormData({
        name: adminData.name || "",
        email: adminData.email || "",
        phone: adminData.phone || "",
        password: "", // Don't prefill password for security
        status: adminData.status || "Enabled",
        profileImageUrl: adminData.profileImageUrl || "",
        createdAt: adminData.createdAt || Timestamp.fromDate(new Date()),
      });
    }
  }, [adminData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };
  const formDataEmpty = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      status: "Enabled",
      profileImage: null,
      profileImageUrl: "",
      createdAt: Timestamp.fromDate(new Date()),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let profileImageUrl = formData.profileImageUrl;

      // If a new profile image is selected, upload it
      if (formData.profileImage) {
        const storageRef = ref(
          storage,
          `adminProfiles/${formData.email}_${formData.profileImage.name}`
        );
        const uploadTask = uploadBytesResumable(
          storageRef,
          formData.profileImage
        );

        profileImageUrl = await new Promise((resolve, reject) => {
          uploadTask.on("state_changed", null, reject, async () =>
            resolve(await getDownloadURL(uploadTask.snapshot.ref))
          );
        });
      }

      // If editing existing admin
      if (adminData) {
        const adminRef = doc(db, "users", adminData.id);
        await setDoc(
          adminRef,
          { ...formData, profileImageUrl },
          { merge: true }
        );
        console.log("Admin Updated:", formData);
      } else {
        // Step 1: Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        // Step 2: Save admin details in Firestore
        await setDoc(doc(db, "users", user.uid), {
          ...formData,
          profileImageUrl,
          uid: user.uid,
          isAdmin: true,
        });

        console.log("Admin Added:", formData);
      }

      onClose();
      formDataEmpty();
    } catch (error) {
      console.error("Error saving admin:", error);
    }
  };

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed right-0 top-0 h-full w-[500px] bg-white shadow-lg transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 bg-white">
          <h2 className="text-xl font-semibold">
            {adminData ? "Edit Admin" : "Add Admin"}
          </h2>
          <button
            onClick={() => {
              onClose();
              formDataEmpty();
            }}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-blue-500"
                  required
                  disabled={!!adminData}
                />
              </div>
            </div>

            {/* Phone & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-blue-500"
                >
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>

            {/* Password (Only when adding a new admin) */}
            {!adminData && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-blue-500"
                  required
                />
              </div>
            )}

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
              {formData.profileImageUrl && (
                <img
                  src={formData.profileImageUrl}
                  alt="Profile"
                  className="mt-2 w-20 h-20 rounded-md object-cover"
                />
              )}
            </div>

            {/* Submit & Cancel */}
            <div className="bg-white border-t p-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  formDataEmpty();
                }}
                className="border px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {adminData ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default AddAdminList;
