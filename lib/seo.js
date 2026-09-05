import { canonicalVariant, productPath } from "@/lib/productVariants";

export function getSiteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return String(env).replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

export function absoluteUrl(path = '') {
  if (!path) return getSiteUrl();
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = getSiteUrl();
  return base ? `${base}${normalized}` : normalized;
}

export function perfumeSeoTitle(product) {
  const brand = product.brand ? ` ${product.brand}` : '';
  return `${product.title}${brand} – оригинален парфюм | DÉLIE`;
}

export function perfumeSeoDescription(product) {
  const brand = product.brand ? `${product.brand} ` : '';
  if (product.description) {
    return `Оригинален парфюм ${brand}${product.title}. ${String(product.description).slice(0, 140)}`;
  }
  return `Оригинален парфюм ${brand}"${product.title}" от DÉLIE. Купете онлайн с доставка в цяла България.`;
}

export function categorySeo(category, { perfume, isRoot, totalCount }) {
  const name = category?.name || '';
  if (perfume && isRoot) {
    return {
      title: 'Оригинални парфюми | DÉLIE',
      description: `Купете оригинални парфюми онлайн в DÉLIE. ${totalCount} аромата – дамски, мъжки, унисекс, арабски и нишови. Доставка в цяла България.`,
      keywords: 'оригинални парфюми, купи оригинален парфюм, дамски парфюми, мъжки парфюми, унисекс парфюми, DÉLIE',
    };
  }
  if (perfume) {
    const lower = name.toLowerCase();
    return {
      title: `${name} оригинални парфюми | DÉLIE`,
      description: `Купете оригинални ${lower} парфюми онлайн в DÉLIE. ${totalCount} аромата с доставка в цяла България.`,
      keywords: `${name}, ${lower} оригинални парфюми, оригинални парфюми, купи оригинален парфюм, DÉLIE`,
    };
  }
  return {
    title: `${name} | DÉLIE`,
    description: `${name} в DÉLIE. ${totalCount} налични продукта.`,
    keywords: `${name}, DÉLIE`,
  };
}

export function buildProductStructuredData(product, variants = []) {
  const images = (product.images || []).filter(Boolean).map(absoluteUrl);
  const all = variants.length ? variants : [product];
  const prices = all.map(item => Number(item.price)).filter(n => !Number.isNaN(n) && n > 0);
  const anyStock = all.some(item => (item.stock ?? 1) > 0);
  const canonical = canonicalVariant(all, product);

  const offers = all.length > 1 && prices.length > 1
    ? {
        '@type': 'AggregateOffer',
        url: absoluteUrl(productPath(canonical)),
        priceCurrency: 'EUR',
        lowPrice: Math.min(...prices).toFixed(2),
        highPrice: Math.max(...prices).toFixed(2),
        offerCount: all.length,
        availability: anyStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      }
    : {
        '@type': 'Offer',
        url: absoluteUrl(productPath(product)),
        priceCurrency: product.currency || 'EUR',
        price: typeof product.price === 'number' ? product.price.toFixed(2) : String(product.price || ''),
        availability: (product.stock ?? 1) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      };

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.brand ? `${product.title} ${product.brand}` : product.title,
    description: perfumeSeoDescription(product),
    image: images.length ? images : [absoluteUrl('/parfumes_sell.png')],
    sku: String(product._id),
    url: absoluteUrl(productPath(canonical)),
    offers,
  };

  if (product.brand) {
    data.brand = { '@type': 'Brand', name: product.brand };
  }

  return data;
}

export function buildCollectionStructuredData({
  title,
  description,
  path,
  products,
  page = 1,
  pageSize = 20,
  totalCount = 0,
}) {
  const start = (Math.max(1, page) - 1) * pageSize;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: absoluteUrl(path),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalCount,
      itemListElement: (products || []).map((product, index) => ({
        '@type': 'ListItem',
        position: start + index + 1,
        url: absoluteUrl(productPath(canonicalVariant(product.variants, product))),
        name: product.title,
      })),
    },
  };
}
