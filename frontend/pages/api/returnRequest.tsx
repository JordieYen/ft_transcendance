import { NextApiRequest, NextApiResponse } from "next";

export default async function returnRequest(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { method, url, headers } = req;
    const requestInfo = {
      method,
      url,
      headers,
    };
    res.status(200).json(requestInfo);
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ statusCode: 500, message: error });
  }
}

