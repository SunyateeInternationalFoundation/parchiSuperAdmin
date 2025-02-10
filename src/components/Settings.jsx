import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { auth, db, storage } from "../../firebase";

const Settings = () => {
  const [userId, setUserId] = useState(null);
  const id = useSelector((state) => state.auth.id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const currentUser = auth.currentUser;
  console.log("currentUser", currentUser);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAdminUser = async () => {
      if (!id) {
        console.error("User ID is missing in Redux state");
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "users"), where("uid", "==", id));
        const querySnapshot = await getDocs(q);

        setUserId(querySnapshot.docs[0].id);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setFormData({
            name: userData.name || "",
            phone: userData.phone || "",
            profileImage: userData.profileImage || "",
            email: userData.email || "",
            password: "",
            address: userData.address || "",
          });
          setImagePreview(userData.profileImage);
        } else {
          console.error("No admin user found for this ID");
        }
      } catch (error) {
        console.error("Error fetching admin user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminUser();
  }, [id]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { password, ...updates } = { ...formData };

      if (!formData.password) {
        delete formData.password;
      }
      if (!currentUser) {
        throw new Error("No authenticated user found.");
      }

      if (formData.password) {
        const currentPassword = prompt(
          "Enter your current password to proceed:"
        );
        if (!currentPassword) {
          throw new Error("Password reauthentication required.");
        }

        try {
          const credential = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
          );
          await reauthenticateWithCredential(currentUser, credential);
          await updatePassword(currentUser, formData.password);
          console.log("Password updated successfully.");
        } catch (authError) {
          console.error("Reauthentication failed:", authError);
          throw new Error("Incorrect current password. Please try again.");
        }
      }

      if (imageFile) {
        const storageRef = ref(
          storage,
          `profiles/${Date.now()}-${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        updates.profileImage = imageUrl;
      }

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, updates);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  console.log("form data", formData);

  // if (!user) {
  //   return (
  //     <div className="text-center mt-10 text-red-500">You are Super Admin</div>
  //   );
  // }

  return (
    <div className="p-6 bg-white rounded-lg">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block">
              <span className="text-gray-700">
                Name
                <span className="text-red-500 ml-1">*</span>
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-3 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block">
              <span className="text-gray-700">
                Email
                <span className="text-red-500 ml-1">*</span>
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-3 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                disabled:cursor-not-allowed disabled:bg-gray-50"
                required
                disabled
              />
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Please Enter Password"
              className="mt-1 block w-full px-3 py-3 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>
          <p className="text-sm text-gray-500">
            Leave blank if you don't want to update password.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="text-gray-700">Phone Number</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Please Enter Phone Number"
              className="mt-1 block w-full px-3 py-3 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>
        </div>
        <div className="space-y-2">
          <span className="block text-gray-700">Profile Image</span>
          <div
            onClick={handleImageClick}
            className="inline-flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
          >
            {imagePreview ? (
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Profile preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <span className="text-3xl text-gray-400">+</span>
                <span className="text-sm text-gray-500">Upload</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="text-gray-700">Address</span>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Please Enter Address"
              rows={4}
              className="mt-1 block w-full px-3 py-3 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
