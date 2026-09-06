import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Category} from "@/models/Category";
import {categorySlug} from "@/lib/slugify";
import {canonicalVariant, groupProductVariants, productPath} from "@/lib/productVariants";
import {attachProductPaths} from "@/lib/categories";

function generateSiteMap(products, categories) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${siteUrl}</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${siteUrl}/perfumes</loc>
       <changefreq>daily</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${siteUrl}/categories</loc>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${siteUrl}/about</loc>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     ${categories.map((category) => {
       const slug = categorySlug(category);
       if (!slug) return '';
       return `
       <url>
           <loc>${siteUrl}/category/${slug}</loc>
           <changefreq>weekly</changefreq>
           <priority>0.7</priority>
       </url>`;
     }).join('')}
    ${products.map((product) => `
       <url>
           <loc>${siteUrl}${productPath(canonicalVariant(product.variants, product))}</loc>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
       </url>
     `).join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps ще направи заявката
}

export async function getServerSideProps({ res }) {
  try {
    await mongooseConnect();
    
    const [rawProducts, categories] = await Promise.all([
      Product.find({}).select('_id slug title brand volume category').lean(),
      Category.find({}).select('_id slug name parent').lean(),
    ]);
    const products = attachProductPaths(groupProductVariants(rawProducts), categories);

    const sitemap = generateSiteMap(products, categories);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.statusCode = 500;
    res.end();
    return {
      props: {},
    };
  }
}

export default SiteMap;
