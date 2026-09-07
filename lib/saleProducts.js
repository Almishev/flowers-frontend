import mongoose from 'mongoose';

export const SALE_PAGE_SIZE = 20;

export const SALE_SORT_OPTIONS = [
  { value: '', label: 'Най-голямо намаление' },
  { value: 'discount_asc', label: 'Най-малко намаление' },
  { value: 'price_asc', label: 'Цена – възходяща' },
  { value: 'price_desc', label: 'Цена – низходяща' },
  { value: 'name_asc', label: 'Име – А-Я' },
  { value: 'name_desc', label: 'Име – Я-А' },
];

const PRODUCT_FIELDS = {
  slug: 1,
  title: 1,
  description: 1,
  images: 1,
  price: 1,
  compareAtPrice: 1,
  currency: 1,
  brand: 1,
  volume: 1,
  concentration: 1,
  gender: 1,
  stock: 1,
  category: 1,
};

function toObjectIds(ids) {
  return (ids || [])
    .map((id) => {
      const value = String(id);
      if (!mongoose.Types.ObjectId.isValid(value)) return null;
      return new mongoose.Types.ObjectId(value);
    })
    .filter(Boolean);
}

export function saleMatch(categoryIds) {
  const match = {
    compareAtPrice: { $type: 'number', $gt: 0 },
    price: { $type: 'number' },
    $expr: { $gt: ['$compareAtPrice', '$price'] },
  };
  const objectIds = toObjectIds(categoryIds);
  if (objectIds.length) {
    match.category = { $in: objectIds };
  }
  return match;
}

function sortStage(sortParam) {
  if (sortParam === 'price_asc') return { price: 1, _id: -1 };
  if (sortParam === 'price_desc') return { price: -1, _id: -1 };
  if (sortParam === 'name_asc') return { title: 1, _id: 1 };
  if (sortParam === 'name_desc') return { title: -1, _id: -1 };
  if (sortParam === 'discount_asc') return { discountPercent: 1, _id: -1 };
  return { discountPercent: -1, _id: -1 };
}

export async function fetchSaleProducts(Product, {
  categoryIds = null,
  sort = '',
  page = 1,
  pageSize = SALE_PAGE_SIZE,
} = {}) {
  const match = saleMatch(categoryIds);
  const requestedPage = Math.max(1, parseInt(page, 10) || 1);
  const size = Math.min(100, Math.max(1, pageSize));

  const totalCount = await Product.countDocuments(match);
  const totalPages = Math.max(1, Math.ceil(totalCount / size) || 1);
  const currentPage = Math.min(requestedPage, totalPages);

  const products = await Product.aggregate([
    { $match: match },
    {
      $addFields: {
        discountPercent: {
          $cond: [
            {
              $and: [
                { $gt: ['$compareAtPrice', 0] },
                { $gt: ['$compareAtPrice', '$price'] },
              ],
            },
            {
              $multiply: [
                {
                  $divide: [
                    { $subtract: ['$compareAtPrice', '$price'] },
                    '$compareAtPrice',
                  ],
                },
                100,
              ],
            },
            0,
          ],
        },
      },
    },
    { $sort: sortStage(sort) },
    { $skip: (currentPage - 1) * size },
    { $limit: size },
    { $project: PRODUCT_FIELDS },
  ]);

  return {
    products,
    totalCount,
    page: currentPage,
    totalPages,
  };
}
