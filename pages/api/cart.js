import mongoose from "mongoose";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import { hydrateVariantSiblings } from "@/lib/productVariants";

export default async function handle(req,res) {
  await mongooseConnect();
  const ids = (req.body.ids || []).filter(id => mongoose.Types.ObjectId.isValid(id));
  if (!ids.length) {
    return res.json([]);
  }
  const products = await Product.find({_id: {$in: ids}}).lean();
  const withVariants = await hydrateVariantSiblings(Product, products);
  res.json(JSON.parse(JSON.stringify(withVariants)));
}

