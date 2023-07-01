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
        console.log('try login in 42 school hmm');
        await signIn('42-school', {
            method: "POST",
            redirect: true,
            callbackUrl: "http://localhost:3000/auth/login"
        });
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
