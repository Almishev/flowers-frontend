import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  // Забележка: за опростяване в момента паролите НЕ се хешират.
  // В продукционна среда задължително трябва да се ползва хеширане (bcrypt и т.н.).
  password: {type: String},
  // Тези полета не са задължителни при регистрация.
  name: {type: String},
  city: {type: String},
  postalCode: {type: String},
  streetAddress: {type: String},
  country: {type: String},
}, {
  timestamps: true,
});

// В dev режим Mongoose пази стария модел в cache.
// Изтриваме го, за да може да се създаде наново със сменената схема.
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export const User = mongoose.model('User', UserSchema);
