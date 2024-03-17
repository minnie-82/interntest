import React, { useState } from "react";
import axios from "axios";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const totalSteps = 2;
  const calculatePercentage = (currentStep) => {
    return Math.floor((currentStep / totalSteps) * 100);
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields
    if (!name || !email || !password || !phone || !address || documents.length === 0) {
         alert( "All fields are required"  );
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
     
      alert( "Invalid email address");
      return;
    }

    // Validate phone format
    if (!validatePhone(phone)) {
      alert("Invalid email address");
      return;
    }

    // Validate name and address length
    if (name.length < 6 ) {
      alert("Name must be at least 6 characters long");
      return;
    }
    if (address.length < 6 ) {
      alert("Address must be at least 6 characters long");
      return;
    }
    try {
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("address", address);
      documents.forEach((file) => formData.append("documents", file));

      const response = await axios.post("http://localhost:7777/api/uploaddata", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { success } = response.data;

      console.log("RESPONSE DATA ", response.data);

     
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setAddress("");
      setDocuments([]);
      setError(""); 
      alert("Thank you!");
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("Error: " + error.message);
      setError("Failed to submit form data. Please try again.");
    }
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="px-10 py-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Step 1: Basic Information</h2>
            <div className="mb-4">
              <label htmlFor="name" className="text-gray-700 font-bold mb-2 flex">
                Name 
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="text-gray-700 font-bold mb-2 flex">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  emailError ? "border-red-500" : ""
                }`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            </div>
            <div className="mb-4 flex flex-col">
              <label htmlFor="password" className="text-gray-700 font-bold mb-2 flex">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div  >
              <button onClick={nextStep} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-row-reverse ">
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="px-10 py-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Step 2: Additional Information</h2>
            <div className="mb-4 flex flex-col">
              <label htmlFor="phone" className="block text-gray-700 font-bold mb-2 flex">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError("");
                }}
              />
              {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
            </div>
            <div className="mb-4 ">
              <label htmlFor="address" className=" text-gray-700 font-bold mb-2 flex">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mb-4 flex flex-col">
              <label htmlFor="documents" className="block text-gray-700 font-bold mb-2 flex">
                Upload Documents
              </label>
              <input
                type="file"
                id="docs"
                name="documentss"
                multiple
                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                onChange={(e) => setDocuments(Array.from(e.target.files))}
              />
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Previous
              </button>
              <button onClick={handleSubmit} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Submit
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-cover bg-center" style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg")' }}>
      <div className="container mx-auto p-8 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md">
          <div className="flex justify-between px-4 pt-4">
            <div>
              <p className="text-sm text-gray-500">Step {step} of {totalSteps}</p>
              <div className="relative pt-1">
                <div className="flex h-2 mb-4 overflow-hidden text-xs bg-gray-200 rounded">
                  <div style={{ width: `${calculatePercentage(step)}%` }} className="flex flex-col justify-center text-center text-white bg-red-500 shadow-none whitespace-nowrap"></div>
                </div>
              </div>
            </div>
            <button onClick={() => setStep(1)} className="text-xs text-red-500 font-bold">Reset</button>
          </div>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
