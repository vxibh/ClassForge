import React, { useState, useEffect } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set the duration of the loader in milliseconds
    const loaderDuration = 3000; // 3 seconds

    const timer = setTimeout(() => {
      setLoading(false);
    }, loaderDuration);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div className="loader-container">
      {loading ? (
        <ClimbingBoxLoader color="#36d7b7" size={15} />
      ) : (
        <div>Content goes here</div>
      )}
    </div>
  );
};

export default Loader;
