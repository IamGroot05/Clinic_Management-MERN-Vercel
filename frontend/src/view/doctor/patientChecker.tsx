/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/utils/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AutoSuggest from "@/components/autoSuggest";
import { useSearchParams } from "react-router-dom";
import { faAdd, faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Prescription {
  doctor: string; // Assuming this is a MongoDB ObjectId as a string
  prescriptionData:[{
    medication: string;
    dosage: string;
    duration: string;
  }]
  prescription: string;
  intravenousTherapy: string;
  _id: string; // Assuming this is a MongoDB ObjectId as a string
  createdAt: string; // ISO Date string
}

interface DoctorPrescription {
  prescription: Prescription;
  doctorName: string;
}


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
  const [prescription, setPrescription] = useState<DoctorPrescription[]>([]);
  const [enteredPres, setEnteredPres] = useState("");
  const [prescriptionData, setPrescriptionData] = useState<{ medication: string; dosage: string; duration: string; }[]>([{ medication: "", dosage: "", duration: "" }]);
  const [ivTheraphy, setIvTheraphy] = useState("");

  const [searchParams] = useSearchParams();
  const tokenNum = searchParams.get("token");


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

  useEffect(() => {
    console.log(window.location.href);
  }, []);
  

  useEffect(() => {
    if (tokenNum) {
      setTokenValid(tokenNum);
    };
  }, [tokenNum]);

  const checkToken = async (e, token) => {
    e.preventDefault();
    if (!token) return noUser("Enter Token Number");
    setTokenValid(token);
    setLoader(true);
    try {
      const fetch = await axios.post(`${api}/api/docs/rettoken`, { id: token });
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
        tokenId: tokenValid,
        pres: enteredPres,
        prescriptionData,
        ivTheraphy
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

  const handleSuggestionSelect = (index, suggestion) => {
    const payload = {name: "medication", value: suggestion};
    handleProductChange(index, {target: payload});
  };

  const handleProductChange = (productIndex, e) => {
    const { name, value } = e.target;
    const updatedVisits = [...prescriptionData];
    const product = updatedVisits[productIndex];

    product[name] = value;

    setPrescriptionData(updatedVisits);
};

const addProductField = (visitIndex) => {
    const updatedVisits = [...prescriptionData];
    updatedVisits.push({ medication: "", dosage: "", duration: "" });
    setPrescriptionData(updatedVisits);
};

const removeProductField = (productIndex) => {
    const updatedVisits = [...prescriptionData];
    updatedVisits.splice(productIndex, 1);
    setPrescriptionData(updatedVisits);
};

  function clearData() {
    setDocname("");
    setName("");
    setMedicalHis([]);
    setPrescriptionData([{ medication: "", dosage: "", duration: "" }]);
    setEnteredPres('');
    setAge("");
    setPhno("");
    setPrescription([]);
    setPatid("");
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

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
          <form className="flex flex-wrap gap-4 w-full sm:justify-center lg:justify-end" onSubmit={handleSubmit}>
            {/* Token Search Card */}
            <div className="bg-white shadow-lg w-full sm:w-1/2 lg:w-[35%] lg:h-[36%] p-4 rounded-lg">
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
                <Button onClick={(e) => {checkToken(e,tokenValid )}} disabled={tokenValid.length === 0} className="mt-4 w-full py-2 bg-indigo-600 text-white hover:bg-indigo-700">
                  Check Token
                </Button>
              </div>
            </div>

            {/* Patient Details Card */}
            <div className="bg-white shadow-lg w-full sm:w-1/2 lg:w-[62%] p-4 rounded-lg">
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
                  <label className="block text-sm font-medium text-gray-700">Medical Reason</label>
                  <Input value={medicalHistory[medicalHistory.length - 1]} disabled className="mt-2 disabled:opacity-80" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <Input value={phno} disabled type="number" className="mt-2 disabled:opacity-80" />
                </div>
              </div>
            </div>

            {/* Previous Consultations Card */}
            <div className="bg-white shadow-lg w-full sm:w-1/2 lg:w-[35%] p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Previous Consultations</h2>
              <ul className="mt-2">
                <div className="overflow-y-auto h-full">
                  {prescription.map((data, index) => (
                  <div className="history-main-card bg-[#f9f9f9] cursor-pointer p-2 hover:shadow-md shadow-sm rounded-md h-20 flex items-center justify-between mx-2 mb-3">
                     <div className="card-left-info w-[80%] lg:w-[60%]">
                      <div className="flex items-center gap-4"><span className="flex items-center gap-[6px] text-gray-700 font-semibold text-[14px]">Reasone: <p className="font-medium text-black">Fever</p></span></div>
                      <div className="flex items-center gap-4 justify-between"><span className="flex items-center gap-[6px] text-gray-700 font-semibold text-[14px]">Medication: <p className="font-medium text-black">{data.prescription.prescriptionData.length ?? 0}</p></span> <span className="flex items-center gap-[6px] text-gray-700 font-semibold text-[14px]">IV: <p className="font-medium text-black">{data.prescription.intravenousTherapy == '' ? '- -' : data.prescription.intravenousTherapy}</p></span></div>
                      <div className="flex items-center gap-4"><span className="flex items-center gap-[6px] text-gray-700 font-semibold text-[14px]">Visit On: <p className="font-medium text-black">{formatDate(data.prescription.createdAt)}</p></span></div>
                     </div>
                     <div className="card-right-info">
                         <img src="https://cdn-icons-png.flaticon.com/512/17960/17960068.png" className="w-12 h-12 opacity-90" alt="doctor" />
                     </div>
                  </div>
                  ))}
                  {/* <table className="w-full text-left border-collapse">
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
                          <td className="px-4 py-2">{data.prescription.medication}</td>
                          <td className="px-4 py-2">{data.prescription.dosage}</td>
                          <td className="px-4 py-2">{data.prescription.duration}</td>
                          <td className="px-4 py-2">{data.prescription.intravenousTherapy}</td>
                          <td className="px-4 py-2">{data.prescription.prescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table> */}
                </div>  
                  {/* // <li key={index} className="text-sm text-gray-600">
                  //   {data.doctorName} - {data.prescription}
                  // </li> */}
              </ul>
            </div>

            {/* Prescription Entry Card */}
            <div className="bg-white shadow-lg w-full sm:w-1/2 lg:w-[62%] p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Write Prescription</h2>
              <div className="card grid gap-4">
                 {prescriptionData.map((pres, productIndex) => (
                  <div key={productIndex}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_0.6fr_0.6fr] w-[90%] gap-4 items-center mb-4 relative">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Medication</label>
                      <AutoSuggest
                        apiUrl="https://jupiterapi.1mg.com/api/v4/search/autocomplete"
                        headers={{
                          "X-Platform": "web",
                          "X-Access-Key": "1mg_client_access_key", // Replace with your key
                          "X-City": "Hyderabad",
                        }}
                        params={{ types: "allopathy", per_page: 10 }}
                        onSelect={(e) => handleSuggestionSelect(productIndex, e)}
                        disable={!tokenChecked}
                        placeholder="Start typing medicine name..."
                      />
                      {/* <Input value={medication} onChange={(e) => setMedication(e.target.value)} disabled={!tokenChecked} className="mt-2 disabled:opacity-80" /> */}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dosage</label>
                      <Input name="dosage" value={pres.dosage} onChange={(e) => handleProductChange(productIndex, e)} disabled={!tokenChecked} type="text" className="mt-2 disabled:opacity-80" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <Input name="duration" value={pres.duration} onChange={(e) => handleProductChange( productIndex, e)} disabled={!tokenChecked} className="mt-2 disabled:opacity-80" />
                    </div>
                    <div className={`flex items-center justify-center absolute ${productIndex !== 0 ? 'right-[-4.2rem]': 'right-[-2.2rem]'} top-[28px]`}>
                      <button
                            type="button"
                            disabled={!tokenChecked}
                            onClick={() => addProductField( productIndex)}
                            className="p-2 text-green-600 text-[23px] flex items-center justify-center w-8 h-8"
                        >
                            <FontAwesomeIcon icon={faSquarePlus} />
                        </button>
                        {productIndex !== 0 && (
                        <button
                            type="button"
                            onClick={() => removeProductField( productIndex)}
                            className="p-2 text-red-600 w-8 h-8 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                        )}
                    </div>
                  </div>                               
                  ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Intravenous Therapy</label>
                  <Input value={ivTheraphy} onChange={(e) => setIvTheraphy(e.target.value)} disabled={!tokenChecked} type="text" className="mt-2 disabled:opacity-80" />
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
