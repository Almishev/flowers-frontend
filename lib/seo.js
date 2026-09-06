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

function uniqueVolumes(product, variants = []) {
  const items = variants.length ? variants : [product];
  return [...new Set(items.map(item => item.volume).filter(Boolean))];
}

function clipMeta(text, max = 158) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

export function perfumeSeoTitle(product) {
  const brand = product.brand ? ` ${product.brand}` : '';
  return `${product.title}${brand} – оригинален парфюм онлайн | DÉLIE`;
}

export function perfumeSeoKeywords(product) {
  const title = product.title || '';
  const brand = product.brand || '';
  return [
    title,
    brand,
    brand && title ? `${title} ${brand}` : '',
    brand && title ? `${brand} ${title}` : '',
    title ? `оригинален парфюм ${title}` : '',
    title ? `купи ${title}` : '',
    'оригинален парфюм',
    'оригинални парфюми',
    'парфюм онлайн',
    'DÉLIE',
  ].filter(Boolean).join(', ');
}

export function perfumeSeoDescription(product, variants = []) {
  const brandPart = product.brand ? ` от ${product.brand}` : '';
  const volumes = uniqueVolumes(product, variants);
  const volumePart = volumes.length ? ` ${volumes.join(' / ')}.` : '';
  const note = String(product.description || '').replace(/\s+/g, ' ').trim();
  const lead = `Купете оригинален парфюм ${product.title}${brandPart} онлайн в DÉLIE.`;
  const bits = [lead];
  if (volumePart) bits.push(volumePart.trim());
  if (note) bits.push(note);
  if (product.scentFamily) bits.push(`${product.scentFamily} аромат.`);
  if (product.gender) bits.push(`${product.gender} аромат.`);
  bits.push('Доставка в цяла България.');
  return clipMeta(bits.join(' ').replace(/\s+/g, ' '));
}

export function perfumePageIntro(product, variants = []) {
  const brand = product.brand ? ` от ${product.brand}` : '';
  const volumes = uniqueVolumes(product, variants);
  let volumeText = '';
  if (volumes.length === 1) volumeText = ` в ${volumes[0]}`;
  else if (volumes.length > 1) {
    volumeText = ` в ${volumes.slice(0, -1).join(', ')} и ${volumes[volumes.length - 1]}`;
  }
  const concentration = product.concentration ? `, ${product.concentration}` : '';
  const who = product.gender ? ` ${product.gender.toLowerCase()} аромат` : '';
  const note = String(product.description || '').replace(/\s+/g, ' ').trim();

  const sentences = [
    `Оригинален парфюм ${product.title}${brand}${volumeText}${concentration}${who ? ` –${who}` : ''}.`,
    note || `Купете ${product.title} онлайн в бутика DÉLIE.`,
    'Оригинален тестер в оригинална опаковка, с доставка в цяла България.',
  ];
  return sentences.join(' ').replace(/\s+/g, ' ').trim();
}

export function productSeoTitle(product) {
  const brand = product.brand ? ` ${product.brand}` : '';
  return `${product.title}${brand} | DÉLIE`;
}

export function productSeoKeywords(product) {
  return [product.title, product.brand, product.title && 'купи ' + product.title, 'DÉLIE']
    .filter(Boolean)
    .join(', ');
}

export function productSeoDescription(product) {
  const brandPart = product.brand ? ` от ${product.brand}` : '';
  const note = String(product.description || '').replace(/\s+/g, ' ').trim();
  return clipMeta([
    `Купете ${product.title}${brandPart} онлайн в DÉLIE.`,
    note,
    'Доставка в цяла България.',
  ].filter(Boolean).join(' '));
}

export function productPageIntro(product) {
  const brand = product.brand ? ` от ${product.brand}` : '';
  const note = String(product.description || '').replace(/\s+/g, ' ').trim();
  return [
    `${product.title}${brand}.`,
    note || `Купете ${product.title} онлайн в бутика DÉLIE.`,
    'Доставка в цяла България.',
  ].join(' ').replace(/\s+/g, ' ').trim();
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

export function buildProductStructuredData(product, variants = [], { perfume = true } = {}) {
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
    description: perfume ? perfumeSeoDescription(product, variants) : productSeoDescription(product),
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
