import { useState } from "react";
import { useFirebase } from "../context/firebase";

function SignUp() {
  const firebase = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <label className="block mb-2">Email</label>
        <input 
          onChange={e => setEmail(e.target.value)} 
          value={email} 
          type="email" 
          required 
          placeholder="Enter your email here" 
          className="w-full p-2 border border-gray-300 rounded mb-4" 
        />
        <label className="block mb-2">Password</label>
        <input 
          onChange={e => setPassword(e.target.value)} 
          value={password} 
          type="password" 
          required 
          placeholder="Enter your password here" 
          className="w-full p-2 border border-gray-300 rounded mb-4" 
        />
        <button 
          onClick={() => {
            firebase.signupUserWithEmailAndPassword(email, password);
            firebase.putData("users/" + email.replaceAll('.', '_'), { email, password });
          }}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignUp;
