import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import Button from './Button';

export default function LogoutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/'); // Redirect to home after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Logout
    </Button>
  );
}
