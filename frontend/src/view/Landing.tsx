import React, { useEffect, useState } from 'react';
import AppointmentsList from './appointmentList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Landing() {
  const stats = [
    { label: "Total", value: 46, color: "text-emerald-600" },
    { label: "Confirmed", value: 40, color: "text-emerald-400" },
    { label: "Pending", value: 40, color: "text-yellow-500" },
    { label: "Rejected", value: 6, color: "text-red-500" },
  ];

  const api = import.meta.env.VITE_REACT_APP_API_BASE_URL;
  const initialData = {
    _id: "",
    name: "",
    email: "",
    password: "",
    age: 8,
    phno: "",
    gender: "",
    patConsult: [],
    __v: 0,
  };
  const [localData, setLocalData]: any = useState({ data: initialData });
  const [data, setData] = useState([]);
  const [pat, setPat] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const temp = await localStorage.getItem("res");
      const parsedData = temp ? JSON.parse(temp) : {};
      setLocalData((prevLocalData: any) => {
        if (JSON.stringify(prevLocalData) !== JSON.stringify(parsedData)) {
          return parsedData;
        }
        return prevLocalData;
      });
      if (!temp) {
        navigate("/");
        return;
      }
      if (localData.data?._id) {
        const fetchID = localData.data?._id;
        const response = await axios.post(
          `${api}/api/docs/retdoc`,
          {
            id: fetchID,
          }
        );
        setData(response.data.patConsult);
        setPat(response.data.patConsult.length);
      }
    };

    fetchData();
  }, [navigate, localData,api]);


  return (
    <div className='h-full w-full bg-[#f2f2f2] p-3'>
      <span className='text-[var(--primary)] font-[OpenSansMedium] text-xl ml-20 lg:ml-0'>
        Welcome {localData.data.name}!
      </span>

      {/* Grid layout for two columns */}
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2.5fr] gap-4 mt-6 h-[90%]">

        {/* Appointment Info Card */}
        <div className="rounded-lg border bg-white p-4 shadow-md max-h-32">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">
            Appointment Overview
          </h2>
          <div className="flex justify-between">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <span className={`text-2xl font-[OpenSansMedium] ${stat.color} block`}>
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500 font-[OSreg]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment List */}
        <div>
          <AppointmentsList />
        </div>

      </div>
    </div>
  );
}

export default Landing;
