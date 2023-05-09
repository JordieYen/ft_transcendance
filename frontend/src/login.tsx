import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
  redirectUrl: string;
}

const Login: React.FC<LoginProps> = ({ redirectUrl }) => {

    const handleLoginWith42 = async() => {
       try {
        console.log('handle login with 42');
        
        const response = await axios.get('http://localhost:3000/auth/login');
        // const response = await axios.get('http://backend-container:3000/auth/login');
        console.log('response');
        window.location.href = response.data.redirectUrl;
       } catch (error) {
         console.error(error); 
       }
    };

    return (
      <div>
          <h2>Login</h2>
          <button onClick={handleLoginWith42}>Login with 42</button>
      </div>
    );
};

export default Login;

// import React from 'react';
// import axios from 'axios';

// const LoginPage = ({ redirectUrl }) => {
//   return (
//     <div>
//       <h2>Login</h2>
//       <button onClick={getServerSideProps}>Login with 42</button>
//     </div>
//   );
// };

// export async function getServerSideProps() {
//   try {
//     console.log('getserver');
    
//     const response = await axios.get('http://localhost:3000/auth/login');
//     console.log('response', response);
//     const redirectUrl = response.request.res.responseUrl;
//     return {
//       props: {
//         redirectUrl,
//       },
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       props: {
//         redirectUrl: null,
//       },
//     };
//   }
// }

// export default LoginPage;
