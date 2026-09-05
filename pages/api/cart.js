import mongoose from "mongoose";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";

export default async function handle(req,res) {
  await mongooseConnect();
  const ids = (req.body.ids || []).filter(id => mongoose.Types.ObjectId.isValid(id));
  if (!ids.length) {
    return res.json([]);
  }
  res.json(await Product.find({_id: {$in: ids}}));
}

