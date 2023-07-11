import { NextApiRequest, NextApiResponse } from "next";
import { getProviders } from "next-auth/react";

const callbackHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const providers = await getProviders();
    console.log('providers xxx', providers);
    
    
    
    
    
};

export default callbackHandler;
