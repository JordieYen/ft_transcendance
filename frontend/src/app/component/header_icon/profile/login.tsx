import CustomButton from "../../../utils/button";

const Login = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
        {/* <a href={`${process.env.NEST_HOST}/auth/login`}> */}
        <a href='http://localhost:3000/auth/login'>
          <CustomButton text="Login with 42" />
        </a>
    </div>
  );
};

export default Login;
