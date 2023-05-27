import { useRouter } from "next/router";
import { useState } from "react";
import Image from 'next/image';


const Logout = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleLogout = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/logout', {
                  credentials: 'include',
          });
        console.log('logout response', response);
        router.push('/login');
      } catch (error) {
        setError('Error loggin out');
      }
    }

    return (
      <div>
        {error && <p>{error}</p>}
        <Image onClick={handleLogout} src="/logout-icon.png" alt="gear" width={25} height={25}/>
      </div>
    );
};

export default Logout;
