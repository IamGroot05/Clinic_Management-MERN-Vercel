import React, { useState } from "react";

const AppointmentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const appointments = [
    { time: "8:00 AM", token:"1", name: "Deepak Shrestha", type: "Follow-up", status: "On-going", phone: "123-456-7890" },
    { time: "9:00 AM", token:"1", name: "Deepak Shrestha", type: "Consultation", status: "Pending", phone: "123-456-7890" },
    { time: "10:00 AM", token:"1", name: "Deepak Shrestha", type: "Follow-up", status: "Pending", phone: "123-456-7890" },
    { time: "11:00 AM", token:"1", name: "Deepak Shrestha", type: "Follow-up", status: "Pending", phone: "123-456-7890" },
    { time: "12:00 AM", token:"1", name: "Deepak Shrestha", type: "Follow-up", status: "Pending", phone: "123-456-7890" },
    { time: "1:00 AM", token:"1", name: "Deepak Shrestha", type: "Follow-up", status: "Pending", phone: "123-456-7890" },
    { time: "2:00 AM", token:"1", name: "Deepak Shrestha", type: "Follow-up", status: "Pending", phone: "123-456-7890" },
    { time: "9:00 AM", token:"9", name: "Deepak Shrestha", type: "Consultation", status: "Pending", phone: "123-456-7890" },
    { time: "10:00 AM", token:"1", name: "Deepak Shrestha", type: "Follow-up", status: "Pending", phone: "123-456-7890" },
    { time: "11:00 AM", token:"5", name: "Fouzan Shrestha", type: "Follow-up", status: "Pending", phone: "123-456-7890" },
    { time: "12:00 AM", token:"1", name: "Deepak Shrestha", type: "Follow-up", status: "Pending", phone: "123-456-7890" },
    { time: "1:00 AM", token:"3", name: "Soumya Shrestha", type: "Follow-up", status: "Pending", phone: "123-456-7890" },
    { time: "2:00 AM", token:"1", name: "Deepak Shrestha", type: "Follow-up", status: "Pending", phone: "123-456-7890" },
  ];

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.phone.includes(searchQuery) || appointment.token.includes(searchQuery)
  );

  return (
    <div className="mx-auto rounded-lg border bg-white p-4 shadow-md h-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Today's Appointment</h2>
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-y-auto max-h-[27rem]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 rounded-sm">
              <th className="px-4 py-2">Token</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{appointment.token}</td>
                <td className="px-4 py-2">{appointment.time}</td>
                <td className="px-4 py-2">{appointment.name}</td>
                <td className="px-4 py-2">{appointment.phone}</td>
                <td className="px-4 py-2">{appointment.type}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      appointment.status === "On-going"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsList;