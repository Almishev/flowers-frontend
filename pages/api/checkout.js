import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Order} from "@/models/Order";
import {deleteS3Objects} from "@/lib/s3";

export default async function handler(req,res) {
  if (req.method !== 'POST') {
    res.json('should be a POST request');
    return;
  }
  const {
    name,email,phone,city,
    postalCode,streetAddress,country,
    cartProducts,shippingPrice,
  } = req.body;
  
  await mongooseConnect();
  
  const productsIds = cartProducts || [];
  const uniqueIds = [...new Set(productsIds)];
  
  const mongoose = require('mongoose');
  const objectIds = uniqueIds.map(id => {
    try {
      return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
    } catch (e) {
      return id;
    }
  });
  
  const productsInfos = await Product.find({_id: {$in: objectIds}});

  // Валидация на наличността преди създаване на поръчка
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => {
      const productIdStr = p._id.toString();
      const searchIdStr = productId.toString();
      return productIdStr === searchIdStr;
    });
    
    if (!productInfo) {
      return res.status(400).json({
        success: false,
        error: `Продукт с ID ${productId} не е намерен`,
      });
    }
    
    const quantity = productsIds.filter(id => id === productId)?.length || 0;
    const availableStock = productInfo.stock || 0;
    
    if (availableStock && quantity > availableStock) {
      return res.status(400).json({
        success: false,
        error: `Няма достатъчна наличност за "${productInfo.title}". Налични: ${availableStock}, Искани: ${quantity}`,
      });
    }
  }

  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => {
      const productIdStr = p._id.toString();
      const searchIdStr = productId.toString();
      return productIdStr === searchIdStr;
    });
    const quantity = productsIds.filter(id => id.toString() === productId.toString())?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: 'BGN',
          product_data: {name:productInfo.title},
          unit_amount: Math.round(productInfo.price * 100),
        },
      });
    }
  }

  if (shippingPrice > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'BGN',
        product_data: {name: 'Доставка'},
        unit_amount: Math.round(shippingPrice * 100),
      },
    });
  }

  try {
    const orderDoc = await Order.create({
      line_items,name,email,phone,city,postalCode,
      streetAddress,country,paid:false,
      paymentMethod: 'cash',
    });

    // Актуализиране на наличностите и завършване на поръчка с наложен платеж
    try {
      for (const productId of uniqueIds) {
        const qty = productsIds.filter(id => id === productId)?.length || 0;
        if (!qty) continue;
        const prod = await Product.findById(productId);
        if (!prod) continue;
        const newStock = Math.max(0, (prod.stock || 0) - qty);
        if (newStock === 0) {
          const images = Array.isArray(prod?.images) ? prod.images : [];
          await Product.deleteOne({_id: productId});
          if (images.length > 0) {
            try {
              await deleteS3Objects(images);
            } catch (s3Error) {
              console.error(`Error deleting images from S3 for product ${productId}:`, s3Error);
            }
          }
        } else {
          await Product.updateOne({_id: productId}, {stock: newStock});
        }
      }
    } catch (invErr) {
      console.error('Inventory update error:', invErr);
    }
    
    res.json({
      success: true,
      orderId: orderDoc._id.toString(),
      message: 'Поръчката е създадена успешно. Ще платите при доставка.',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Грешка при създаване на поръчката: ' + error.message,
    });
  }
}

