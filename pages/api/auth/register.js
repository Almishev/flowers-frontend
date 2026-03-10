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

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'Потребител с този имейл вече съществува'});
    }

    const user = await User.create({
      email,
      password,
      name: '',
      city: '',
      postalCode: '',
      streetAddress: '',
      country: '',
    });

    return res.status(201).json({
      email: user.email,
    });
  } catch (error) {
    console.error('Error in register API:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error?.message || 'Unknown error',
    });
  }
}


