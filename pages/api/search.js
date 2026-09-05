import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default async function handle(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({message: 'Method Not Allowed'});
  }

  const q = String(req.query.q || '').trim();
  if (q.length < 2) {
    return res.json({products: []});
  }

  try {
    await mongooseConnect();
    const regex = new RegExp(escapeRegex(q), 'i');
    const products = await Product.find({
      $or: [
        {title: regex},
        {brand: regex},
        {description: regex},
      ],
    })
      .select('slug title brand price images')
      .sort({_id: -1})
      .limit(8)
      .lean();

    res.json({products: JSON.parse(JSON.stringify(products))});
  } catch (error) {
    console.error('Error in search API:', error);
    res.status(500).json({products: [], message: 'Internal server error'});
  }
}
