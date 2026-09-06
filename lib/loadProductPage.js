import mongoose from "mongoose";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Category} from "@/models/Category";
import {
  attachProductPaths,
  isPerfumeDepartment,
  productPathPrefixFor,
  rootDepartment,
} from "@/lib/categories";
import {categoryPath} from "@/lib/slugify";
import {
  findSiblingVariants,
  groupProductVariants,
  hydrateVariantSiblings,
  productPath,
} from "@/lib/productVariants";

const RECOMMENDED_FIELDS = {
  slug: 1,
  title: 1,
  price: 1,
  currency: 1,
  images: 1,
  brand: 1,
  volume: 1,
  concentration: 1,
  gender: 1,
  stock: 1,
  category: 1,
};

function toObjectId(id) {
  const hex = String(id || '');
  return mongoose.Types.ObjectId.isValid(hex) ? new mongoose.Types.ObjectId(hex) : null;
}

async function departmentCategoryIds(product) {
  const category = product.category;
  if (!category) return null;
  const department = rootDepartment(category);
  const rootId = department?._id || (typeof category === 'object' ? category._id : category);
  if (!rootId) return null;
  const children = await Category.find({ parent: rootId }).select('_id').lean();
  return [rootId, ...children.map((child) => child._id)];
}

async function loadRecommendedProducts(product, variants, pathPrefix, categories) {
  const excludeIds = [product._id, ...(variants || []).map((item) => item._id)]
    .map(toObjectId)
    .filter(Boolean);

  const match = { _id: { $nin: excludeIds }, stock: { $gt: 0 } };
  const categoryIds = await departmentCategoryIds(product);
  if (categoryIds?.length) {
    match.category = { $in: categoryIds };
  }

  const sampled = await Product.aggregate([
    { $match: match },
    { $sample: { size: 12 } },
    { $project: RECOMMENDED_FIELDS },
  ]);

  const grouped = groupProductVariants(sampled).slice(0, 8);
  if (grouped.length < 3) return [];
  const hydrated = await hydrateVariantSiblings(Product, grouped);
  return attachProductPaths(
    hydrated.map((item) => ({ ...item, pathPrefix })),
    categories
  );
}

export async function getProductPageProps(context, expectedKind) {
  await mongooseConnect();
  const {slug} = context.query;

  const populate = { path: 'category', populate: { path: 'parent' } };
  let product = await Product.findOne({ slug }).populate(populate);

  if (!product && slug && /^[0-9a-fA-F]{24}$/.test(slug)) {
    product = await Product.findById(slug).populate(populate);
  }

  if (!product) {
    return { notFound: true };
  }

  const categories = await Category.find().select('_id slug name parent').lean();
  const pathPrefix = productPathPrefixFor(product);
  const isPerfume = pathPrefix === '/perfume';

  if (expectedKind === 'product' && isPerfume) {
    return {
      redirect: {
        destination: `/perfume/${product.slug || product._id}`,
        permanent: true,
      },
    };
  }
  if (expectedKind === 'perfume' && !isPerfume) {
    return {
      redirect: {
        destination: `/product/${product.slug || product._id}`,
        permanent: true,
      },
    };
  }

  const variants = await findSiblingVariants(Product, product);
  const variantsWithPath = variants.map((item) => ({ ...item, pathPrefix }));
  const recommendedProducts = await loadRecommendedProducts(
    product,
    variantsWithPath,
    pathPrefix,
    categories
  );

  const leaf = product.category && typeof product.category === 'object' ? product.category : null;
  const department = rootDepartment(leaf);
  const breadcrumbs = [{ name: 'Начало', url: '/' }];
  if (department) {
    breadcrumbs.push({ name: department.name, url: categoryPath(department) });
  }
  if (leaf && department && String(leaf._id) !== String(department._id)) {
    breadcrumbs.push({ name: leaf.name, url: categoryPath(leaf) });
  }
  breadcrumbs.push({
    name: product.title,
    url: productPath({ ...product.toObject?.() || product, pathPrefix }),
  });

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      variants: JSON.parse(JSON.stringify(variantsWithPath)),
      recommendedProducts: JSON.parse(JSON.stringify(recommendedProducts)),
      isPerfume,
      pathPrefix,
      breadcrumbs: JSON.parse(JSON.stringify(breadcrumbs)),
    },
  };
}
