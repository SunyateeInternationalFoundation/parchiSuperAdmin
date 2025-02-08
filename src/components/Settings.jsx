import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase";

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profileImage: "",
    email: "", // Add email here
  });

  const id = useSelector((state) => state.auth.id);

  useEffect(() => {
    const fetchAdminUser = async () => {
      if (!id) {
        console.error("User ID is missing in Redux state");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser(userData);
          setFormData({
            name: userData.name || "",
            phone: userData.phone || "",
            profileImage: userData.profileImage || "",
            email: userData.email || "", // Set email from Firestore
          });
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, {
        name: formData.name,
        phone: formData.phone,
        profileImage: formData.profileImage,
      });

      setUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-500">You are Super Admin</div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-8 max-w-xl w-full">
        <div className="flex flex-col items-center">
          {isEditing ? (
            <input
              type="text"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              placeholder="Enter Image URL"
            />
          ) : (
            <img
              src={user.profileImage || "/placeholder.svg"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-lg"
            />
          )}

          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded text-black"
              placeholder="Enter Name"
            />
          ) : (
            <h2 className="text-2xl font-semibold text-white mt-4">
              {user.name}
            </h2>
          )}

          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded text-black"
              placeholder="Enter Phone"
            />
          ) : (
            <p className="text-gray-400">{user.phone}</p>
          )}

          {/* Email field (Read-only) */}
          <div className="w-full p-2 mt-2  text-gray-400 border rounded">
            {user.email}
          </div>

          {isEditing ? (
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
