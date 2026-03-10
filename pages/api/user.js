import {mongooseConnect} from "@/lib/mongoose";
import {User} from "@/models/User";

export default async function handle(req, res) {
  try {
    await mongooseConnect();

    if (req.method === 'GET') {
      const {email} = req.query;
      if (!email) {
        return res.status(400).json({message: 'Email is required'});
      }
      const user = await User.findOne({email});
      res.json(user);
    } else if (req.method === 'POST') {
      const {email, name, city, postalCode, streetAddress, country} = req.body;
      
      if (!email || !name || !city || !postalCode || !streetAddress || !country) {
        return res.status(400).json({message: 'All fields are required'});
      }

      const user = await User.findOneAndUpdate(
        {email},
        {name, city, postalCode, streetAddress, country},
        {upsert: true, new: true}
      );
      res.json(user);
    } else {
      res.status(405).json({message: 'Method Not Allowed'});
    }
  } catch (error) {
    console.error('Error in user API:', error);
    res.status(500).json({message: 'Internal server error', error: error.message});
  }
}
