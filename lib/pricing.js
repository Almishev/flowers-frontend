export function getSaleInfo(price, compareAtPrice) {
  const sell = Number(price);
  const compare = Number(compareAtPrice);
  const onSale = Number.isFinite(sell) && Number.isFinite(compare) && compare > sell && compare > 0;
  return {
    onSale,
    price: Number.isFinite(sell) ? sell : null,
    compareAt: onSale ? compare : null,
    percent: onSale ? Math.round(((compare - sell) / compare) * 100) : 0,
  };
}

export function formatMoney(value, currency = 'EUR') {
  const n = Number(value);
  if (!Number.isFinite(n)) return '';
  return `${n.toFixed(2)} ${currency}`;
}
