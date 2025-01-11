import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations
import toast, { Toaster } from "react-hot-toast";

const Auth = () => {
  const api = process.env.REACT_APP_API_BASE_URL;
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isDoctor, setIsDoctor] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = isDoctor ? "Doctor | Clinic" : "Receptionist | Clinic";
  }, [isDoctor]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${api}/api/recept/logrecept`, {
        email,
        password: pass,
      });
      const tok = JSON.stringify(response.data);
      localStorage.setItem("receptData", tok);
      toast.success("Logging In");
      nav("/recept/dashboard");
    } catch (err) {
      toast.error("Invalid Email or Password Credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${api}/api/docs/logdoc/`, {
        email,
        password: pass,
      });
      const tok = JSON.stringify(response.data);
      localStorage.setItem("docData", tok);
      toast.success("Logging In");
      nav("/doc/dash");
    } catch (err) {
      toast.error("Invalid Email or Password Credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-[url('https://img.freepik.com/free-photo/frame-medical-equipment-desk_23-2148519742.jpg?t=st=1735295539~exp=1735299139~hmac=cf15142015728fdfa71eef18413ebde2ba3daec829cee7258efe2cb9f9cce69e&w=740')] bg-no-repeat text-white relative">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-white shadow-2xl rounded-lg w-11/12 sm:w-96 text-black overflow-hidden"
      >
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          >
            <div className="loader"></div>
          </motion.div>
        )}

        <div className="p-6">
          <div className="text-center">
            <motion.h2
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-[OpenSansMedium] mb-2 text-[var(--primary)]"
            >
              {isDoctor ? "Doctor" : "Receptionist"} Login
            </motion.h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          <motion.form
            className="mt-4 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            onSubmit={isDoctor ? handleSign : handleLogin}
          >
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-[var(--primary)] text-white py-2 px-4 rounded-lg hover:bg-[var(--primary)] transition duration-300"
              >
                Login
              </button>
            </div>
          </motion.form>
          <p
            className="mt-4 text-center text-[var(--primary)] cursor-pointer"
            onClick={() => setIsDoctor((prev) => !prev)}
          >
            {isDoctor
              ? "Not a Doctor? Login as Receptionist"
              : "Not a Receptionist? Login as Doctor"}
          </p>
        </div>

        <div className="bg-[var(--primary)] text-white rounded-b-lg p-4 text-center">
          <h1 className="text-xl font-bold">Welcome Back!</h1>
          <p className="text-sm mt-2">
            "Medicine is not only a science; it is also an art. It does not
            consist of compounding pills and plasters; it deals with the very
            processes of life, which must be understood before they may be
            guided." - Paracelsus
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
