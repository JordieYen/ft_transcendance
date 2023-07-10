import { NextApiRequest, NextApiResponse } from "next";
import { signIn } from "next-auth/react";

export default async function signIn42School(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // await signIn('42-school', { 
        //     method: "POST",
        //     redirect: true,
            // callbackUrl: "http://localhost:3000/auth/callback/42-school"
        // });
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
