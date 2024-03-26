const baseUrl = 'http://localhost:31299';

export async function getProduct(isin: number) {
  return fetch(baseUrl + '/products/' + isin);
}
