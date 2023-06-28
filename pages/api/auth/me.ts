import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bearerToken = req.headers["authorization"] as string;
  const token = bearerToken.split(" ")[1];

  const response = await axios.get("http://localhost:8080/me", {
    headers: {
      Cookie: `JSESSIONID=${token}`,
    },
  })
  const email = response.data.name;

  if (!email) {
    return res.status(401).json({
      errorMessage: "Unauthorized request",
    });
  }

  const user = {
    id: "id",
    firstName: "firstName",
    lastName: "lastName",
    email: email,
    city: "city",
    phone: "phone"
  }

  return res.json(user);
}
