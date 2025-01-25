import React, { useState, useEffect } from "react";
import Loader from "../../utils/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { set } from "lodash";


function PatientAdd() {
  const api = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [isExist, setExist] = useState(true);
  const [getDocname, setDocname] = useState("");
  const [getNumber, setNumber] = useState("");
  const [loader, setLoader] = useState(false);
  const [getnewPatName, setNewPatName] = useState("");
  const [getnewPatUserName, setPatUserName] = useState("");
  const [getnewPatAge, setNewPatAge] = useState("");
  const [getnewPatPhno, setNewPatPhno] = useState("");
  const [getnewPatAddr, setNewPatAddr] = useState("");
  const [fetchTokId, setFetchTokid] = useState(false);
  const [isFetched, setFetchedID] = useState(0);
  const [medicalReason, setMedicalReason] = useState('');
  const [selectedGender, setSelectedGender] = useState("Female");
  const [selectedType, setSelectedType] = useState('Consultancy')

  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUserDelete, setIsUserDelete] = useState(false);


  let debounceTimeout;

  useEffect(() => {
    const localData = localStorage.getItem("res");
    if (!localData) {
      navigate("/");
      return;
    }
    const parsed = JSON.parse(localData as any);
    setDocname(parsed.data.name);
  }, [navigate]);

  const generateUsername = (name, number) => {
    const numberLast = number.slice(-4);
    const nameFirst = name.slice(0, 4);
    return nameFirst + numberLast;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const fetchData = await axios.post(`${api}/api/recept/createtoken`, {
        docname: getDocname,
        patNo: getNumber,
        medicalReason: medicalReason,
        username: getnewPatUserName,
        type: selectedType
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
        username: generateUsername(getnewPatName, getnewPatPhno),
      });
      toast.success("Patient Added Successfully");
    } catch (err) {
      toast.error("Failed to Add Patient");
    }
  };

  const handelPatientNameChange = (e) => {
    setPatUserName(e);
    results.forEach((patient) => {
      if(patient.username === e){
        setMedicalReason(patient.medicalHistory[-1]);
      }
    })
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setNumber(value);
    if(value.length < 10) return;
    // Clear previous timeout
    if (debounceTimeout) clearTimeout(debounceTimeout);

    // Set a new timeout
    debounceTimeout = setTimeout(() => {
        fetchPatients(value);
    }, 300); // Adjust debounce delay as needed
};

const fetchPatients = async (phno) => {
    if (!phno) {
        setResults([]);
        return;
    }

    try {
        const response = await axios.get(`${api}/api/recept/searchpatbyphn?phno=${phno}`);
        setResults(response.data.patients);
        setOpen(true);
    } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error(error.response.data.message ?? "Failed to Find Patient");
        setResults([]);
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
              <div className="flex justify-between w-full">
                <div className="w-[48%]">
                  <label className="block text-sm font-medium text-gray-700">
                    Patient's Phone Number
                  </label>
                  <input
                    type="number"
                    onChange={(e) => handleSearch(e)}
                    className="mt-2 block w-full px-3 py-2 border rounded-lg text-gray-700"
                    required
                  />
                </div>
                <div className="w-[48%]">
                  <label className="block text-sm font-medium text-gray-700">
                      Patient Name
                  </label>
                  <Select open={open} onOpenChange={setOpen}  onValueChange={handelPatientNameChange} disabled={results.length < 1} required>
                    <SelectTrigger className="mt-2 w-full h-[60%] text-base px-3 py-2 border rounded-lg text-gray-700">
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Patient's name</SelectLabel>
                        {results.map((patient, index) => (
                          <SelectItem key={index} value={patient.username}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              { !isUserDelete &&(
              <div className="flex justify-between w-full">
              <div className="w-[48%]">
                  <label className="block text-sm font-medium text-gray-700">
                    Medical Reason
                  </label>
                  <input
                    type="text"
                    value={medicalReason}
                    onChange={(e) => setMedicalReason(e.target.value)}
                    className="mt-2 block w-full px-3 py-2 border rounded-lg text-gray-700"
                    required
                  />
                </div>
                <div className="w-[48%]">
                  <label className="block text-sm font-medium text-gray-700">
                    Checkup Type
                  </label>
                  <Select onValueChange={(e) => setSelectedType(e)} value={selectedType} >
                    <SelectTrigger className="mt-2 w-full h-[60%] text-base px-3 py-2 border rounded-lg text-gray-700">
                      <SelectValue  placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Consultancy">Consultancy</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              )}
              { !isUserDelete &&(
              <button
                type="submit"
                className="w-full py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-emerald-700"
              >
                Generate Token
              </button>
              )}
              { isUserDelete &&(
              <button
                type="submit"
                className="w-full py-2 mt-8 bg-[var(--primary)] text-white rounded-lg bg-red-500 hover:bg-red-500"
              >
                Delete User
              </button>
              )}
                
                { !isUserDelete &&(
                  <div className="flex justify-center items-center gap-3 w-full">
                    <p
                      onClick={() => setExist(false)}
                      className="text-center text-blue-600 mt-4 cursor-pointer"
                    >
                      Patient Not Registered?
                    </p>
                    <p className="mt-4">|</p>
                      <p
                        onClick={() => setIsUserDelete(true)}
                        className="text-center text-red-400 mt-4 cursor-pointer"
                      >
                        Delete Created Patient?
                      </p>
                    </div>
                )}
                { isUserDelete &&(
                <p
                  onClick={() => setIsUserDelete(false)}
                  className="text-center text-blue-600 mt-4 cursor-pointer"
                >
                  Generate Token For Patient?
                </p>
                )}
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
