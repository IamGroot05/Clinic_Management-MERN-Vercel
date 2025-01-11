import React, { useState, useEffect } from "react";
import Loader from "../../utils/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function PatientAdd() {
  const api = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [isExist, setExist] = useState(true);
  const [getDocname, setDocname] = useState("");
  const [getNumber, setNumber] = useState("");
  const [loader, setLoader] = useState(false);
  const [getnewPatName, setNewPatName] = useState("");
  const [getnewPatAge, setNewPatAge] = useState("");
  const [getnewPatPhno, setNewPatPhno] = useState("");
  const [getnewPatAddr, setNewPatAddr] = useState("");
  const [fetchTokId, setFetchTokid] = useState(false);
  const [isFetched, setFetchedID] = useState(0);
  const [selectedGender, setSelectedGender] = useState("Female");

  useEffect(() => {
    const localData = localStorage.getItem("res");
    if (!localData) return navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const fetchData = await axios.post(`${api}/api/recept/createtoken`, {
        docname: getDocname,
        patNo: getNumber,
      });
      setFetchedID(fetchData.data.tokenID);
      setFetchTokid(true);
    } catch (err) {
      toast.error("Failed to Fetch Data");
    } finally {
      setLoader(false);
    }
  };

  const handleNewPatSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}/api/recept/receptregister`, {
        name: getnewPatName,
        age: getnewPatAge,
        gender: selectedGender,
        phno: getnewPatPhno,
        address: getnewPatAddr,
      });
      toast.success("Patient Added Successfully");
    } catch (err) {
      toast.error("Failed to Add Patient");
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-100 font-[OpenSansMedium] flex items-center justify-center py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Patient Management
          </h1>
          <p className="text-gray-500 text-center mb-6">
            Add Patient or Generate Token Number
          </p>
          {isExist && !fetchTokId && !loader && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Patient's Phone Number
                </label>
                <input
                  type="number"
                  onChange={(e) => setNumber(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border rounded-lg text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Doctor's Name
                </label>
                <input
                  type="text"
                  onChange={(e) => setDocname(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border rounded-lg text-gray-700"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-emerald-700"
              >
                Generate Token
              </button>
              <p
                onClick={() => setExist(false)}
                className="text-center text-blue-600 mt-4 cursor-pointer"
              >
                Patient Not Registered?
              </p>
            </form>
          )}
          {isExist && fetchTokId && (
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                Your Token ID
              </h2>
              <p className="text-3xl font-bold text-blue-600">{isFetched}</p>
              <button
                onClick={() => setFetchTokid(false)}
                className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          )}
          {isExist && loader && <Loader />}
          {!isExist && (
            <form className="space-y-4" onSubmit={handleNewPatSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Patient's Name
                </label>
                <input
                  type="text"
                  onChange={(e) => setNewPatName(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border rounded-lg text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  max={150}
                  min={1}
                  onChange={(e) => setNewPatAge(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border rounded-lg text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="number"
                  onChange={(e) => setNewPatPhno(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border rounded-lg text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border rounded-lg text-gray-700"
                  value={selectedGender}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  onChange={(e) => setNewPatAddr(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border rounded-lg text-gray-700"
                  rows={4}
                  placeholder="Optional"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit
              </button>
              <p
                onClick={() => setExist(true)}
                className="text-center text-blue-600 mt-4 cursor-pointer"
              >
                Already Registered?
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default PatientAdd;
