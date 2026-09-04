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

export function productNoun(count, {perfume} = {}) {
  if (perfume) {
    return count === 1 ? 'парфюм' : 'парфюма';
  }
  return count === 1 ? 'продукт' : 'продукта';
}
