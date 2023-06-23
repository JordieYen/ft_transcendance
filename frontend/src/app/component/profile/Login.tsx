import CustomButton from "@/app/utils/CustomButton";
import Link from 'next/link';

const Login = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
        {/* <a href={`${process.env.NEST_HOST}/auth/login`}> */}
        <Link href='http://localhost:3000/auth/login'>
          <CustomButton text="Login with 42" />
        </Link>
    </div>
  );
};

export default Login;
