import ProductPage from "../perfume/[slug]";
import {getProductPageProps} from "@/lib/loadProductPage";

export default ProductPage;

export async function getServerSideProps(context) {
  return getProductPageProps(context, 'product');
}
