import {mongooseConnect} from "@/lib/mongoose";
import {Category} from "@/models/Category";

export default async function handle(req, res) {
  try {
    await mongooseConnect();

    if (req.method === 'GET') {
      const categories = await Category.find();
      res.json(categories);
    } else {
      res.status(405).json({message: 'Method Not Allowed'});
    }
  } catch (error) {
    console.error('Error in categories API:', error);
    res.status(500).json({message: 'Internal server error', error: error.message});
  }
}
