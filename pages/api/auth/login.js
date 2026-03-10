import {mongooseConnect} from "@/lib/mongoose";
import {User} from "@/models/User";

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({message: 'Method Not Allowed'});
  }

  try {
    await mongooseConnect();

    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({message: 'Email and password are required'});
    }

    const user = await User.findOne({email, password});
    if (!user) {
      return res.status(401).json({message: 'Невалиден имейл или парола'});
    }

    return res.status(200).json({
      email: user.email,
    });
  } catch (error) {
    console.error('Error in login API:', error);
    return res.status(500).json({message: 'Internal server error'});
  }
}


