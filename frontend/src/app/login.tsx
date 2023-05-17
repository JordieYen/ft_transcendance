const Login = () => {
  return (
    <div>
      <h2>Login</h2>
      {/* <a href={`${process.env.NEST_HOST}/auth/login`}> */}
      <a href='http://localhost:3000/auth/login'>
        <button>Login with 42</button>
      </a>
     
    </div>
  );
};

export default Login;
