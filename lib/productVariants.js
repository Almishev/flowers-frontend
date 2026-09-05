export function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPlain(product) {
  if (!product) return product;
  if (typeof product.toObject === 'function') return product.toObject();
  return { ...product };
}

export function variantKey(product) {
  const brand = String(product?.brand || '').trim().toLowerCase();
  const title = String(product?.title || '').trim().toLowerCase();
  return `${brand}::${title}`;
}

export function sortByVolume(a, b) {
  const num = (item) => {
    const match = String(item?.volume || '').match(/(\d+)/);
    return match ? Number(match[1]) : 9999;
  };
  const diff = num(a) - num(b);
  if (diff !== 0) return diff;
  return String(a?.volume || '').localeCompare(String(b?.volume || ''), 'bg');
}

export function serializeVariant(product) {
  const plain = toPlain(product);
  return {
    _id: String(plain._id),
    slug: plain.slug || '',
    title: plain.title || '',
    brand: plain.brand || '',
    volume: plain.volume || '',
    price: plain.price,
    stock: plain.stock,
    images: plain.images || [],
    concentration: plain.concentration || '',
    gender: plain.gender || '',
  };
}

function siblingQuery(product) {
  return {
    title: new RegExp(`^${escapeRegex(product.title)}$`, 'i'),
    brand: new RegExp(`^${escapeRegex(product.brand || '')}$`, 'i'),
  };
}

export function groupProductVariants(products) {
  const map = new Map();
  const order = [];

  for (const raw of products || []) {
    const product = toPlain(raw);
    const key = product.volume ? variantKey(product) : String(product._id);
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key).push(product);
  }

  return order.map((key) => {
    const items = map.get(key);
    const primary = items[0];
    const variants = [...items].sort(sortByVolume).map(serializeVariant);
    return {
      ...primary,
      _id: String(primary._id),
      variants,
    };
  });
}

export function paginateGroupedProducts(products, { page = 1, pageSize = 20 } = {}) {
  const groups = groupProductVariants(products);
  const totalCount = groups.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const skip = (currentPage - 1) * pageSize;
  return {
    products: groups.slice(skip, skip + pageSize),
    totalCount,
    totalPages,
    page: currentPage,
  };
}

export async function hydrateVariantSiblings(Product, products) {
  const list = (products || []).map(toPlain);
  const withVolume = list.filter((product) => product.volume && product.title);
  if (!withVolume.length) {
    return list.map((product) => ({
      ...product,
      _id: String(product._id),
      variants: product.variants?.length
        ? product.variants
        : [serializeVariant(product)],
    }));
  }

  const seen = new Set();
  const queries = [];
  for (const product of withVolume) {
    const key = variantKey(product);
    if (seen.has(key)) continue;
    seen.add(key);
    queries.push(siblingQuery(product));
  }

  const siblings = await Product.find({ $or: queries })
    .select('slug title brand volume price stock images concentration gender')
    .lean();

  const byKey = new Map();
  for (const sibling of siblings) {
    const key = variantKey(sibling);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(sibling);
  }

  return list.map((product) => {
    const all = product.volume
      ? (byKey.get(variantKey(product)) || [product])
      : [product];
    return {
      ...product,
      _id: String(product._id),
      variants: [...all].sort(sortByVolume).map(serializeVariant),
    };
  });
}

export async function findSiblingVariants(Product, product) {
  if (!product?.title || !product.volume) {
    return [serializeVariant(product)];
  }
  const siblings = await Product.find(siblingQuery(product))
    .select('slug title brand volume price stock images concentration gender')
    .lean();
  return [...siblings].sort(sortByVolume).map(serializeVariant);
}
