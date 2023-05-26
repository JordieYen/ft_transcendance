import Logo from "./logo";
import styles from '../../pages/global.module.css';
import CustomButton from "./button";

const Login = () => {
  return (
    <div>
        {/* <Logo/> */}
        {/* <a href={`${process.env.NEST_HOST}/auth/login`}> */}
        <a href='http://localhost:3000/auth/login'>
          {/* <button>Login with 42</button> */}
          <CustomButton text="Login with 42" />
        </a>
      </div>
  );
};

export default Login;
