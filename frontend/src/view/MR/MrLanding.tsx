import React from 'react';
import MedicalRepresentativeForm from './MedicalRepresentativeForm';

const MrLanding = () => {
  const handleSave = (data) => {
    console.log("Form Data Saved:", data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <MedicalRepresentativeForm mrData={null} onSave={handleSave} />
    </div>
  );
};

export default MrLanding;
