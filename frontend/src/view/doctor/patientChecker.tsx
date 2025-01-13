/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/utils/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function PatientChecker() {
  const api = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [localData, setLocalData]: any = useState({});
  const [isLoad, setLoader] = useState(false);
  const [tokenValid, setTokenValid] = useState("");
  const [tokenChecked, setTokenChecked] = useState(false);
  const [name, setName] = useState("");
  const [phno, setPhno] = useState("");
  const [age, setAge] = useState("");
  const [docName, setDocname] = useState("");
  const [medicalHistory, setMedicalHis] = useState([]);
  const [patId, setPatid] = useState("");
  const [prescription, setPrescription] = useState<{ doctorName: string; prescription: string }[]>([]);
  const [enteredPres, setEnteredPres] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempData = localStorage.getItem("res");
        if (!tempData) {
          navigate("/");
          return;
        }
        setLocalData(JSON.parse(tempData));
      } catch (err) {
        noUser("Not Authenticated");
      }
    };
    fetchData();
  }, [navigate]);

  const checkToken = async (e) => {
    e.preventDefault();
    if (!tokenValid) return noUser("Enter Token Number");
    setLoader(true);
    try {
      const fetch = await axios.post(`${api}/api/docs/rettoken`, { id: tokenValid });
      const data  = fetch.data.data;
      setDocname(data.docs.name);
      setName(data.patient.name);
      setAge(data.patient.age);
      setPhno(data.patient.phno);
      setPrescription(data.patient.combinedData);
      setPatid(data.patient._id);
      setMedicalHis(data.patient.medicalHistory);
      setTokenChecked(true);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      clearFetchData()
      noUser("Token Id Not Found");
    }
  };

  const clearFetchData = () =>{
    clearData();
    setTokenChecked(false);
  }

  const noUser = (value) => toast.error(value);
  const added = (value) => toast.success(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tokenValid || !tokenChecked || !enteredPres) {
      return noUser("Please fill all the details correctly.");
    }
    setLoader(true);
    try {
      await axios.post(`${api}/api/docs/enqpat`, {
        patid: patId,
        id: localData.data._id,
        pres: enteredPres,
      });
      setLoader(false);
      setTokenChecked(false);
      clearData();
      added("Added Successfully");
    } catch (error) {
      setLoader(false);
      noUser("Error Occurred");
    }
  };

  function clearData() {
    setDocname("");
    setName("");
    setMedicalHis([]);
    setAge("");
    setPhno("");
    setPrescription([]);
    setPatid("");
  }

  return (
    <div className="bg-[#f2f2f2] p-3">
      <span className="text-[var(--primary)] font-[OpenSansMedium]">
        <h1 className="text-2xl font-semibold text-center text-[var(--primary)]">Patient Checker</h1>
        <p className="text-center text-sm text-gray-600 mb-6">To Diagnose The Patient</p>
      </span>
      <div className="h-full w-full flex flex-wrap gap-4 justify-center">
        <Toaster />
        {isLoad && (
          <div className="flex justify-center items-center w-full">
            <Loader />
          </div>
        )}
        {!isLoad && (
          <form className="flex flex-wrap gap-4 w-full justify-center" onSubmit={handleSubmit}>
            {/* Token Search Card */}
            <div className="bg-white shadow-lg w-full sm:w-1/2 lg:w-[30%] lg:h-[36%] p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Search Patient by Token</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Token</label>
                <Input
                  type="number"
                  value={tokenValid}
                  onChange={(e) => setTokenValid(e.target.value)}
                  className="mt-2"
                  placeholder="Enter Token Number"
                />
                <Button onClick={checkToken} disabled={tokenValid.length === 0} className="mt-4 w-full py-2 bg-indigo-600 text-white hover:bg-indigo-700">
                  Check Token
                </Button>
              </div>
            </div>

            {/* Patient Details Card */}
            <div className="bg-white shadow-lg w-full sm:w-1/2 lg:w-[60%] lg:ml-8 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Patient Details</h2>
              <div className="card grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient's Name</label>
                  <Input value={name} disabled className="mt-2 disabled:opacity-80" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <Input value={age} disabled type="number" className="mt-2 disabled:opacity-80" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medical History</label>
                  <Input value={medicalHistory[medicalHistory.length - 1]} disabled className="mt-2 disabled:opacity-80" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <Input value={phno} disabled type="number" className="mt-2 disabled:opacity-80" />
                </div>
              </div>
            </div>

            {/* Previous Consultations Card */}
            <div className="bg-white shadow-lg w-full sm:w-1/2 lg:w-[43%] p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Previous Consultations</h2>
              <ul className="mt-2">
                <div className="overflow-y-auto max-h-[27rem]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 rounded-sm">
                        <th className="px-4 py-2">Medication</th>
                        <th className="px-4 py-2">Dosage</th>
                        <th className="px-4 py-2">Duration</th>
                        <th className="px-4 py-2">IV</th>
                        <th className="px-4 py-2">Prescription</th>
                      </tr>
                    </thead>
                    <tbody>
                    {prescription.map((data, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{data.prescription}</td>
                          <td className="px-4 py-2">{'adbvbf'}</td>
                          <td className="px-4 py-2">{'dhfghdsf'}</td>
                          <td className="px-4 py-2">{'djbshgf'}</td>
                          <td className="px-4 py-2">{'sjcbsjkd'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>  
                  {/* // <li key={index} className="text-sm text-gray-600">
                  //   {data.doctorName} - {data.prescription}
                  // </li> */}
              </ul>
            </div>

            {/* Prescription Entry Card */}
            <div className="bg-white shadow-lg w-full sm:w-1/2 lg:w-[50%] p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Write Prescription</h2>
              <div className="card grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medication</label>
                  <Input value={name} disabled={!tokenChecked} className="mt-2 disabled:opacity-80" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dosage</label>
                  <Input value={age} disabled={!tokenChecked} type="number" className="mt-2 disabled:opacity-80" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <Input value={docName} disabled={!tokenChecked} className="mt-2 disabled:opacity-80" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Intravenous Therapy</label>
                  <Input value={phno} disabled={!tokenChecked} type="number" className="mt-2 disabled:opacity-80" />
                </div>
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prescription</label>
                  <Textarea
                    value={enteredPres}
                    onChange={(e) => setEnteredPres(e.target.value)}
                    rows={6}
                    className="mt-2"
                    placeholder="Enter Prescription Details"
                  />
                </div>
              <div className="mt-6">
                <Button
                  type="submit"
                  className="w-full py-3 bg-green-600 text-white hover:bg-green-700"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PatientChecker;
