import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { db, storage, auth } from "../../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const AddAdminList = ({ isOpen, onClose }) => {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "Enabled",
    profileImage: null,
  });

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAdminData({ ...adminData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        adminData.email,
        adminData.password
      );
      const user = userCredential.user;

      let profileImageUrl = "";
      if (adminData.profileImage) {
        const storageRef = ref(
          storage,
          `adminProfiles/${user.uid}_${adminData.profileImage.name}`
        );
        const uploadTask = uploadBytesResumable(
          storageRef,
          adminData.profileImage
        );

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              profileImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: adminData.name,
        email: adminData.email,
        phone: adminData.phone,
        status: adminData.status,
        profileImage: profileImageUrl,
        isAdmin: true,
      });
      alert("successfully added new admin")
      onClose();
    } catch (error) {
        alert("something went wrong")
      console.error("Error adding admin:", error);
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
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">Add New Super Admin</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile Image Upload */}
          <div className="mb-4">
            <label className="cursor-pointer block text-sm font-medium text-gray-700" htmlFor="file-upload">Profile Image</label>
              <input
                id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
              />
            </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Please Enter Name"
                className="w-full p-2 border rounded-md"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="Please Enter Phone Number"
                className="w-full p-2 border rounded-md"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Please Enter Email"
                className="w-full p-2 border rounded-md"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Please Enter Password"
                className="w-full p-2 border rounded-md"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-medium">Status</label>
            <select
              name="status"
              className="w-full p-2 border rounded-md"
              onChange={handleChange}
            >
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-md">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default AddAdminList;
