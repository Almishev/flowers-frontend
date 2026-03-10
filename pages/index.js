import { Suspense, lazy } from "react";
import Header from "@/components/Header";
import Featured from "@/components/Featured";
import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import Footer from "@/components/Footer";
import HeroVideo from "@/components/HeroVideo";
import SEO from "@/components/SEO";
import LazySection from "@/components/LazySection";
import {Settings} from "@/models/Settings";

// Lazy load компонентите, които не са видими веднага
const NewProducts = lazy(() => import("@/components/NewProducts"));
const PopularDestinations = lazy(() => import("@/components/PopularDestinations"));
const MemoriesSection = lazy(() => import("@/components/MemoriesSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));

export default function HomePage({featuredProduct,newProducts,popularDestinations, heroSettings}) {
  return (
    <>
      <SEO 
        title="Онлайн магазин за цветя и букети | Flowers Boutique MIA"
        description="Онлайн магазин за цветя и букети за всеки повод – рожден ден, годишнина, сватба или просто жест на внимание. Flowers Boutique MIA – уникални естествени и изкуствени цветя, букети, кошници, украси, декорации за дома."
        keywords="онлайн магазин за цветя, букет, букети, доставка на цветя, цветарница, цветя за рожден ден, цветя за сватба, цветя с доставка, Flowers Boutique MIA"
        url="/"
        image="/logo.png"
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
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Акцентни букети</h2>
              <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
                В момента няма избран акцентен букет. Моля, влезте в админ панела и изберете препоръчан продукт.
              </p>
            </div>
          </div>
        )}
        
        <LazySection>
          <Suspense fallback={null}>
            <NewProducts products={newProducts} />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <PopularDestinations destinations={popularDestinations} />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <MemoriesSection />
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
    
    // Взимаме популярни дестинации (топ 6 по брой екскурзии)
    const popularDestinationsAgg = await Product.aggregate([
      {
        $addFields: {
          destinationName: {
            $trim: {
              input: {
                $concat: [
                  {$ifNull: ["$destinationCountry", ""]},
                  " ",
                  {$ifNull: ["$destinationCity", ""]},
                ],
              },
            },
          },
        },
      },
      {
        $match: {
          destinationName: {$ne: ""},
        },
      },
      {
        $group: {
          _id: "$destinationName",
          count: {$sum: 1},
          sample: {
            $first: {
              title: "$title",
              image: {$arrayElemAt: ["$images", 0]},
            },
          },
        },
      },
      {$sort: {count: -1}}, // Сортиране по брой екскурзии (най-популярните първи)
      {$limit: 6},
    ]);

    const popularDestinations = popularDestinationsAgg.map(item => ({
      name: item._id ? item._id.replace(/\s+/g, ' ').trim() : item._id,
      count: item.count,
      sample: item.sample || null,
    }));
    
    return {
      props: {
        featuredProduct: featuredProduct ? JSON.parse(JSON.stringify(featuredProduct)) : null,
        newProducts: JSON.parse(JSON.stringify(newProducts)),
        popularDestinations: JSON.parse(JSON.stringify(popularDestinations)),
        heroSettings: {
          heroMediaType: settingsMap.heroMediaType || 'video',
          heroVideoDesktop: settingsMap.heroVideoDesktop || '',
          heroVideoMobile: settingsMap.heroVideoMobile || '',
          heroImage: settingsMap.heroImage || '',
          heroTitle: settingsMap.heroTitle || 'Flowers Boutique MIA',
          heroSubtitle: settingsMap.heroSubtitle || 'Уникални естествени и изкуствени цветя, букети, кошници, украси, декорации за дома.',
        },
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        featuredProduct: null,
        newProducts: [],
        popularDestinations: [],
        heroSettings: null,
      },
    };
  }
}