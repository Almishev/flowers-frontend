import { Suspense, lazy } from "react";
import Header from "@/components/Header";
import Featured from "@/components/Featured";
import {Product} from "@/models/Product";
import {Category} from "@/models/Category";
import {mongooseConnect} from "@/lib/mongoose";
import Footer from "@/components/Footer";
import HeroVideo from "@/components/HeroVideo";
import SEO from "@/components/SEO";
import LazySection from "@/components/LazySection";
import {Settings} from "@/models/Settings";

// Lazy load компонентите, които не са видими веднага
const NewProducts = lazy(() => import("@/components/NewProducts"));
const PopularCategoriesHome = lazy(() => import("@/components/PopularCategoriesHome"));
const PopularDestinations = lazy(() => import("@/components/PopularDestinations"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));

export default function HomePage({featuredProduct,newProducts,popularCategories, heroSettings}) {
  return (
    <>
      <SEO 
        title="Онлайн магазин за парфюми | DÉLIE"
        description="DÉLIE е бутик за дамски, мъжки, унисекс, арабски и нишови парфюми. Подбрани аромати с доставка в цяла България."
        keywords="парфюми, дамски парфюми, мъжки парфюми, унисекс, арабски парфюми, нишови парфюми, онлайн магазин за парфюми, DÉLIE"
        url="/"
        image="/pirin-pixel-yellow.png"
      />
      <div>
        <Header />
        <HeroVideo heroSettings={heroSettings} />
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

        <LazySection>
          <Suspense fallback={null}>
            <NewProducts products={newProducts} />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <PopularDestinations />
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
    // Взимаме всички настройки
    const allSettings = await Settings.find();
    const settingsMap = {};
    allSettings.forEach((setting) => {
      settingsMap[setting.name] = setting.value;
    });

    const featuredProductId = settingsMap.featuredProductId;
    
    let featuredProduct = null;
    if (featuredProductId) {
      featuredProduct = await Product.findById(featuredProductId).select('slug title description images destinationCountry destinationCity price currency availableSeats maxSeats category status startDate endDate durationDays travelType isFeatured departureCity');
    }
    
    // Първо опитваме да взимаме акцентираните екскурзии (isFeatured: true)
    let newProducts = await Product.find({isFeatured: true}).select('slug title description images destinationCountry destinationCity price currency availableSeats maxSeats category status startDate endDate durationDays travelType isFeatured departureCity').sort({'_id':-1}).limit(12);
    
    // Ако няма акцентирани екскурзии, показваме 12-те с най-скорошна дата на заминаване
    if (!newProducts || newProducts.length === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Започваме от началото на днес
      
      newProducts = await Product.find({
        startDate: { $gte: today } // Само екскурзии с дата >= днес
      }).select('slug title description images destinationCountry destinationCity price currency availableSeats maxSeats category status startDate endDate durationDays travelType isFeatured departureCity').sort({ startDate: 1 }).limit(12);
      
      // Ако все още няма с бъдещи дати, взимаме последните 12 добавени
      if (!newProducts || newProducts.length === 0) {
        newProducts = await Product.find({}).select('slug title description images destinationCountry destinationCity price currency availableSeats maxSeats category status startDate endDate durationDays travelType isFeatured departureCity').sort({ '_id': -1 }).limit(12);
      }
    }
    
    // Популярни категории – сортирани по брой продукти (топ 4)
    const allCategories = await Category.find().lean();
    const categoriesWithCounts = await Promise.all(
      allCategories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category: cat._id });
        return {
          ...cat,
          productCount,
        };
      })
    );

    const popularCategories = categoriesWithCounts
      .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
      .slice(0, 4);
    
    return {
      props: {
        featuredProduct: featuredProduct ? JSON.parse(JSON.stringify(featuredProduct)) : null,
        newProducts: JSON.parse(JSON.stringify(newProducts)),
        popularCategories: JSON.parse(JSON.stringify(popularCategories)),
        heroSettings: {
          heroMediaType: settingsMap.heroMediaType || 'video',
          heroVideoDesktop: settingsMap.heroVideoDesktop || '',
          heroVideoMobile: settingsMap.heroVideoMobile || '',
          heroImage: settingsMap.heroImage || '',
          heroTitle: settingsMap.heroTitle || 'DÉLIE',
          heroSubtitle: settingsMap.heroSubtitle || 'Дамски, мъжки, унисекс, арабски и нишови парфюми.',
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
        heroSettings: null,
      },
    };
  }
}