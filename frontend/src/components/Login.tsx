import Image from "next/image";
import Link from "next/link";

const Login = () => {
  const loginUrl = process.env.NEXT_PUBLIC_NEST_HOST;
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <Image
          className="object-contain"
          src="/main-logo.svg"
          alt="Logo"
          width={240}
          height={176}
          style={{ width: "100%", height: "auto" }}
          priority={true}
        />
        <p className="text-5xl font-pmarker text-timberwolf">Pongmington</p>
      </div>
      <Link
        // href="http://localhost:3000/auth/login"
        href={`${loginUrl}/auth/login`}
        className="flex w-[300px] rounded-md my-10 px-2 py-2 bg-jetblack border-2 border-saffron justify-center"
      >
        <p className="text-xl text-timberwolf">Login with 42</p>
      </Link>
      {/* <button className="flex w-[300px] rounded-md my-10 px-2 py-2 bg-jetblack border-2 border-saffron justify-center"
       onClick={ async () => await signIn('google', { 
          method: "POST",
          redirect: true,
          credentials: "include",
          callbackUrl: "http://localhost:3001/pong-main",
        })}>
          <p className="text-xl text-timberwolf">Login with Google</p>
        </button> */}
    </div>
  );
};

export default Login;
