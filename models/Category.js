import {model, models, Schema} from "mongoose";

const CategorySchema = new Schema({
  name: {type:String, required:true},
  slug: {type:String, unique: true, sparse: true},        // SEO-friendly URL slug
  parent: {type:Schema.Types.ObjectId, ref:'Category'},
  properties: [{type:Object}],
}, {
  timestamps: true,
});

export const Category = models?.Category || model('Category', CategorySchema);
