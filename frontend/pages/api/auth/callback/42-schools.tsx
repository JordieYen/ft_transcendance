import { NextApiRequest, NextApiResponse } from "next";
import { getProviders, getSession } from "next-auth/react";

const callbackHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const providers = await getProviders();
    console.log('providers xxx', providers);
    const session = await getSession({ req });
    console.log('session xxx', session);
    res.redirect('/pong-main');
    
    
    
    
    
};

export default callbackHandler;
