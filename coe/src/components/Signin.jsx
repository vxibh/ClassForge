import { useState, useEffect } from "react";
import { useFirebase } from "../context/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseApp } from "../context/firebase";

const auth = getAuth(firebaseApp);

function SignIn() {
  const firebase = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  if (user === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6">Sign In</h1>
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
            onClick={() => firebase.signinUserWithEmailAndPassword(email, password)}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Hello {user.email}</h1>
        <button 
          onClick={() => signOut(auth)}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default SignIn;
