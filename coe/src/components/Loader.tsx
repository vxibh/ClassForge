// components/Loading.tsx
import { HashLoader } from 'react-spinners';

const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <HashLoader color="#fc03c2" size={40} aria-label="Loading Spinner" />
  </div>
);

export default Loading;
