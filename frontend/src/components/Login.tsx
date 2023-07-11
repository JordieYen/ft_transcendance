import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <Image
          className="object-contain"
          src="/main-logo.svg"
          alt="Logo"
          width={240}
          height={176}
        />
        <p className="text-5xl font-pmarker text-timberwolf">Pongmington</p>
      </div>
      <Link
        href="http://localhost:3000/auth/login"
        className="flex w-[300px] rounded-md my-10 px-2 py-2 bg-jetblack border-2 border-saffron justify-center"
      >
        <p className="text-xl text-timberwolf">Login with 42</p>
      </Link>
       <button className="login-button text-background-dark-grey bg-mygrey rounded-md px-2 py-1" 
       onClick={ async () => await signIn('42-school', { 
          method: "POST",
          redirect: true,
          // callbackUrl: "http://localhost:3000/auth/login"
          // callbackUrl: "http://localhost:3001/api/auth/callback/42-school"
        })}>
          Try next Auth Login
        </button>
    </div>
  );
};

export default Login;
