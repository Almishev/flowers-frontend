import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import { groupProductVariants, hydrateVariantSiblings } from "@/lib/productVariants";
import { attachProductPaths } from "@/lib/categories";
import { Category } from "@/models/Category";

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
      .select('slug title brand volume price images category')
      .sort({_id: -1})
      .limit(24)
      .lean();

    const grouped = await hydrateVariantSiblings(
      Product,
      groupProductVariants(products).slice(0, 8)
    );
    const categories = await Category.find().select('_id slug name parent').lean();
    const withPaths = attachProductPaths(grouped, categories);

    res.json({products: JSON.parse(JSON.stringify(withPaths))});
  } catch (error) {
    console.error('Error in search API:', error);
    res.status(500).json({products: [], message: 'Internal server error'});
  }
}
