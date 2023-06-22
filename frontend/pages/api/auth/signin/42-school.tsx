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
        console.log('try login in 42 school');
        await signIn('42-school', { callbackUrl: process.env.AUTH_CALLBACK_NEXT });
        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
