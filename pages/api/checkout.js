import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Order} from "@/models/Order";
import {deleteS3Objects} from "@/lib/s3";
import {sendOrderEmail} from "@/lib/sendEmail";

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
  
  const productsIds = (cartProducts || []).map(id => String(id));
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
  const qtyOf = (productId) => productsIds.filter(id => String(id) === String(productId)).length;

  const validIds = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => p._id.toString() === String(productId));
    if (!productInfo) continue;

    const quantity = qtyOf(productId);
    const availableStock = productInfo.stock || 0;
    
    if (availableStock && quantity > availableStock) {
      return res.status(400).json({
        success: false,
        error: `Няма достатъчна наличност за "${productInfo.title}". Налични: ${availableStock}, Искани: ${quantity}`,
      });
    }
    validIds.push(productId);
  }

  if (validIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'В кошницата няма налични продукти. Обновете страницата и опитайте отново.',
    });
  }

  let line_items = [];
  for (const productId of validIds) {
    const productInfo = productsInfos.find(p => p._id.toString() === String(productId));
    const quantity = qtyOf(productId);
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: 'EUR',
          product_data: {
            name: productInfo.volume
              ? `${productInfo.title} — ${productInfo.volume}`
              : productInfo.title,
          },
          unit_amount: Math.round(productInfo.price * 100),
        },
      });
    }
  }

  if (shippingPrice > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'EUR',
        product_data: {name: 'Доставка'},
        unit_amount: Math.round(shippingPrice * 100),
      },
    });
  }

  // изчисляваме общата сума (в EUR) на базата на line_items
  const totalCents = line_items.reduce((sum, item) => {
    const qty = item.quantity || 0;
    const amount = item.price_data?.unit_amount || 0;
    return sum + qty * amount;
  }, 0);
  const total = totalCents / 100;

  try {
    const orderDoc = await Order.create({
      line_items,
      name,
      email,
      phone,
      city,
      postalCode,
      streetAddress,
      country,
      paid: false,
      paymentMethod: 'cash',
      total,
    });

    // Актуализиране на наличностите и завършване на поръчка с наложен платеж
    try {
      for (const productId of validIds) {
        const qty = qtyOf(productId);
        if (!qty) continue;
        const prod = await Product.findById(productId);
        if (!prod) continue;
        const newStock = Math.max(0, (prod.stock || 0) - qty);
        await Product.updateOne({_id: productId}, {stock: newStock});
      }
    } catch (invErr) {
      console.error('Inventory update error:', invErr);
    }

    // Изпращаме имейл с детайли за поръчката (fire-and-forget – грешките не спират клиента)
    try {
      await sendOrderEmail({ order: orderDoc, lineItems: line_items });
    } catch (mailErr) {
      console.error('Order email error:', mailErr);
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

