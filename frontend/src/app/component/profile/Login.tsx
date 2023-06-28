import CustomButton from "@/app/utils/CustomButton";
import { signIn } from "next-auth/react";
import Link from "next/link";

const Login = () => {
  const handleLogin = () => {
    signIn("42-school");
  };

  return (
    <div className="flex items-center justify-center h-screen gap-3">
      {/* <a href={`${process.env.NEST_HOST}/auth/login`}> */}
      <Link href="http://localhost:3000/auth/login">
        <CustomButton text="Login with 42" />
      </Link>
      {/* <button className="login-button text-background-dark-grey bg-mygrey rounded-md px-2 py-1" onClick={handleLogin}>
              Try next Auth Login
        </button> */}
    </div>
  );
};

export default Login;
