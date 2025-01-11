import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserInfo() {
  const navigate = useNavigate();
  const [receptData, setReceptData]: any = useState({});

  useEffect(() => {
    const localData = localStorage.getItem("res");
    if (!localData) return navigate("/");
    setReceptData(JSON.parse(localData));
  }, [navigate]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full font-[OpenSansMedium]">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Hi! {receptData.data && receptData.data.name}
            </h1>
            <p className="text-lg text-gray-500">Doctor</p>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Name</h2>
              <p className="text-lg text-gray-800">{receptData.data && receptData.data.name}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-600">Age</h2>
              <p className="text-lg text-gray-800">{receptData.data && receptData.data.age}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-600">Gender</h2>
              <p className="text-lg text-gray-800">{receptData.data && receptData.data.gender}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-600">Phone Number</h2>
              <p className="text-lg text-gray-800">{receptData.data && receptData.data.phno}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-600">Email</h2>
              <p className="text-lg text-gray-800">{receptData.data && receptData.data.email}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-600">Role</h2>
              <p className="text-lg text-gray-800">Doctor</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
