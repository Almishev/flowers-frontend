import {mongooseConnect} from "@/lib/mongoose";
import {Review} from "@/models/Review";
import {verifyRecaptcha} from "@/lib/recaptcha";

export default async function handler(req,res) {
  await mongooseConnect();
  const {method} = req;
  if (method === 'GET') {
    const {product} = req.query;
    if (!product) return res.status(400).json({error:'Missing product'});
    const reviews = await Review.find({product}).sort({createdAt:-1});
    return res.json(reviews);
  }
  if (method === 'POST') {
    const {product, rating, title, content, name, email, recaptchaToken} = req.body;
    const captchaOk = await verifyRecaptcha(recaptchaToken, 'review');
    if (!captchaOk) {
      return res.status(400).json({error:'reCAPTCHA проверката не успя. Опитайте отново.'});
    }
    if (!product || !rating || !title || !content) {
      return res.status(400).json({error:'Missing required fields'});
    }
    if (!email) {
      return res.status(401).json({error:'Login required to post a review'});
    }
    const review = await Review.create({product, rating, title, content, name, email});
    return res.json(review);
  }
  res.status(405).json({error:'Method not allowed'});
}


