import { Suspense, lazy } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Featured from "@/components/Featured";
import {Product} from "@/models/Product";
import {Category} from "@/models/Category";
import {mongooseConnect} from "@/lib/mongoose";
import Footer from "@/components/Footer";
import HeroVideo from "@/components/HeroVideo";
import BrandMarquee from "@/components/BrandMarquee";
import SEO from "@/components/SEO";
import LazySection from "@/components/LazySection";
import {Settings} from "@/models/Settings";
import { groupProductVariants, hydrateVariantSiblings } from "@/lib/productVariants";

const NewProducts = lazy(() => import("@/components/NewProducts"));
const PopularCategoriesHome = lazy(() => import("@/components/PopularCategoriesHome"));
const BrandsSection = lazy(() => import("@/components/BrandsSection"));
const PopularCollections = lazy(() => import("@/components/PopularCollections"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));

const PRODUCT_FIELDS = 'slug title description images price currency brand volume concentration gender stock category';

export default function HomePage({featuredProduct,newProducts,popularCategories, departments, brands, heroSettings}) {
  return (
    <>
      <SEO 
        title="Оригинални парфюми онлайн | DÉLIE"
        description="Купете оригинални парфюми онлайн в DÉLIE. Дамски, мъжки, унисекс, арабски и нишови аромати с доставка в цяла България."
        keywords="оригинални парфюми, купи оригинален парфюм, дамски парфюми, мъжки парфюми, унисекс парфюми, арабски парфюми, нишови парфюми, онлайн магазин за парфюми, DÉLIE"
        url="/"
        image="/parfumes_sell.png"
      />
      {heroSettings?.heroMediaType === 'image' && heroSettings.heroImage && (
        <Head>
          <link rel="preload" as="image" href={heroSettings.heroImage} fetchPriority="high" />
        </Head>
      )}
      <div>
        <Header />
        <HeroVideo heroSettings={heroSettings} />
        <BrandMarquee brands={brands} />
        {featuredProduct ? (
          <Featured product={featuredProduct} />
        ) : (
          <div style={{
            backgroundColor: '#222',
            color: '#fff',
            padding: '50px 0',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center', maxWidth: '600px', padding: '0 20px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Акцентни парфюми</h2>
              <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
                В момента няма избран акцентен парфюм. Моля, влезте в админ панела и изберете препоръчан продукт.
              </p>
            </div>
          </div>
        )}

        {popularCategories && popularCategories.length > 0 && (
          <LazySection>
            <Suspense fallback={null}>
              <PopularCategoriesHome categories={popularCategories} />
            </Suspense>
          </LazySection>
        )}

        {brands && brands.length > 0 && (
          <LazySection>
            <Suspense fallback={null}>
              <BrandsSection brands={brands} />
            </Suspense>
          </LazySection>
        )}

        <LazySection>
          <Suspense fallback={null}>
            <NewProducts products={newProducts} />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <PopularCollections departments={departments} />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <AboutSection />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <FAQSection />
          </Suspense>
        </LazySection>

        <Footer />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    await mongooseConnect();
    const allSettings = await Settings.find();
    const settingsMap = {};
    allSettings.forEach((setting) => {
      settingsMap[setting.name] = setting.value;
    });

    const rawBrands = await Product.distinct('brand', { brand: { $nin: ['', null] } });
    const seenBrands = new Set();
    const brands = rawBrands
      .map((name) => String(name || '').trim())
      .filter((name) => {
        if (!name) return false;
        const key = name.toLowerCase();
        if (seenBrands.has(key)) return false;
        seenBrands.add(key);
        return true;
      })
      .sort((a, b) => a.localeCompare(b, 'bg'));

    const featuredProductId = settingsMap.featuredProductId;

    let featuredProduct = null;
    if (featuredProductId) {
      featuredProduct = await Product.findById(featuredProductId).select(PRODUCT_FIELDS);
    }

    const newestRaw = await Product.find({})
      .select(PRODUCT_FIELDS)
      .sort({ _id: -1 })
      .limit(36)
      .lean();
    const newProducts = await hydrateVariantSiblings(
      Product,
      groupProductVariants(newestRaw).slice(0, 8)
    );

    const allCategories = await Category.find().lean();
    const childIdsByParent = {};
    allCategories.forEach((cat) => {
      const parentId = cat.parent ? String(cat.parent) : '';
      if (!parentId) return;
      if (!childIdsByParent[parentId]) childIdsByParent[parentId] = [];
      childIdsByParent[parentId].push(cat._id);
    });

    const categoriesWithCounts = await Promise.all(
      allCategories.map(async (cat) => {
        const isRoot = !cat.parent;
        const ids = isRoot
          ? [cat._id, ...(childIdsByParent[String(cat._id)] || [])]
          : [cat._id];
        const productCount = await Product.countDocuments({ category: { $in: ids } });
        return {
          ...cat,
          productCount,
        };
      })
    );

    const popularCategories = (() => {
      const leaves = categoriesWithCounts
        .filter((cat) => !!cat.parent)
        .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
        .slice(0, 4);
      if (leaves.length > 0) return leaves;
      return categoriesWithCounts
        .filter((cat) => !cat.parent)
        .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
        .slice(0, 4);
    })();

    const departments = categoriesWithCounts
      .filter((cat) => !cat.parent)
      .sort((a, b) => (a.navOrder || 0) - (b.navOrder || 0) || String(a.name).localeCompare(b.name, 'bg'))
      .map((cat) => ({
        ...cat,
        childrenCount: (childIdsByParent[String(cat._id)] || []).length,
      }));

    return {
      props: {
        featuredProduct: featuredProduct ? JSON.parse(JSON.stringify(featuredProduct)) : null,
        newProducts: JSON.parse(JSON.stringify(newProducts)),
        popularCategories: JSON.parse(JSON.stringify(popularCategories)),
        departments: JSON.parse(JSON.stringify(departments)),
        brands,
        heroSettings: {
          heroMediaType: settingsMap.heroMediaType || 'video',
          heroVideoDesktop: settingsMap.heroVideoDesktop || '',
          heroVideoMobile: settingsMap.heroVideoMobile || '',
          heroImage: settingsMap.heroImage || '',
          heroTitle: settingsMap.heroTitle || 'DÉLIE',
          heroSubtitle: settingsMap.heroSubtitle || 'Оригинални тестери в оригинални опаковки.',
        },
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        featuredProduct: null,
        newProducts: [],
        popularCategories: [],
        departments: [],
        brands: [],
        heroSettings: null,
      },
    };
  }
}
