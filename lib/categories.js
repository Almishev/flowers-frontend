export function parentIdOf(category) {
  if (!category?.parent) return '';
  return typeof category.parent === 'object' ? (category.parent._id || '') : category.parent;
}

export function sortDepartments(categories) {
  return (categories || [])
    .filter(cat => !cat.parent)
    .sort((a, b) => (a.navOrder || 0) - (b.navOrder || 0) || String(a.name).localeCompare(b.name, 'bg'));
}

export function childrenOf(categories, parentId) {
  if (!parentId) return [];
  return (categories || []).filter(cat => parentIdOf(cat) === String(parentId));
}

export function isPerfumeDepartment(root) {
  if (!root) return false;
  const slug = (root.slug || '').toLowerCase();
  const name = (root.name || '').toLowerCase();
  return slug === 'parfyumi' || name === 'парфюми';
}

export function indexCategories(categories) {
  return new Map((categories || []).map((cat) => [String(cat._id), cat]));
}

export function rootDepartment(category, byId) {
  let current = category;
  if (!current) return null;
  if (typeof current !== 'object') {
    current = byId?.get(String(current)) || null;
  }
  if (!current) return null;

  const seen = new Set();
  while (current) {
    const parentId = parentIdOf(current);
    if (!parentId) return current;
    const key = String(current._id || '');
    if (key && seen.has(key)) return current;
    if (key) seen.add(key);
    if (current.parent && typeof current.parent === 'object' && current.parent._id) {
      current = current.parent;
      continue;
    }
    current = byId?.get(String(parentId)) || null;
  }
  return null;
}

export function productPathPrefixFor(product, byId) {
  if (product?.pathPrefix === '/product' || product?.pathPrefix === '/perfume') {
    return product.pathPrefix;
  }
  const department = rootDepartment(product?.category, byId);
  if (!department) return '/perfume';
  return isPerfumeDepartment(department) ? '/perfume' : '/product';
}

export function attachProductPaths(products, categories) {
  const byId = indexCategories(categories);
  return (products || []).map((product) => {
    const pathPrefix = productPathPrefixFor(product, byId);
    const variants = Array.isArray(product.variants)
      ? product.variants.map((item) => ({ ...item, pathPrefix }))
      : product.variants;
    return { ...product, pathPrefix, variants };
  });
}

export function productNoun(count, {perfume} = {}) {
  if (perfume) {
    return count === 1 ? 'парфюм' : 'парфюма';
  }
  return count === 1 ? 'продукт' : 'продукта';
}
