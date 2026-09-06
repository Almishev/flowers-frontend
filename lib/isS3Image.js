export function isS3ImageUrl(url) {
  return typeof url === 'string' && url.includes('amazonaws.com');
}
