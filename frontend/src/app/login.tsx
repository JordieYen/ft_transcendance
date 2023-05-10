import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {

  const router = useRouter();

  const handleLoginWith42 = async () => {
    try {
      console.log('handle login with 42');
      const response = await axios.get('http://localhost:3000/auth/login');
      console.log('response', response);
      // window.location.href = response.data.redirectUrl;
      router.push('/pong-main');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {/* <button onClick={handleLoginWith42}>Login with 42</button> */}
      <a href="http://localhost:3000/auth/login">
        <button>Login with 42</button>
      </a>
    </div>
  );
};

export default Login;
