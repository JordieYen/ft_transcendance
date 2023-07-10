import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function callbackHander(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const session = await getSession({ req });
        console.log('session', session);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

