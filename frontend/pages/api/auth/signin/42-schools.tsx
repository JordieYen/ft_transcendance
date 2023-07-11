import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth/next";
import { authOptions } from "../[...nextauth]";

export default async function signIn42School(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('try signing in');
        // await NextAuth(req, res, authOptions);
        
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
