import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import Link from "next/link";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Breadcrumb = styled.div`
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;
  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      color: #000;
    }
  }
`;

const DestinationInfo = styled.div`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Highlight = styled.span`
  padding: 6px 14px;
  border-radius: 999px;
  background-color: #e5edff;
  color: #1d4ed8;
  font-size: 0.9rem;
  align-self: flex-start;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  font-size: 1.05rem;
`;

export default function DestinationPage({destination, trips}) {
  if (!destination) {
    return (
      <>
        <Header />
        <Center>
          <Title>Дестинацията не е намерена</Title>
          <p>Страницата не съществува или за тази дестинация няма налични екскурзии.</p>
          <Link href="/destinations">← Върни се към дестинациите</Link>
        </Center>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${destination} - Екскурзии`}
        description={`Екскурзии до ${destination}. ${trips.length} налични.`}
        url={`/destination/${encodeURIComponent(destination)}`}
        image="/logo.png"
      />
      <Header />
      <Center>
        <Breadcrumb>
          <Link href="/">Начало</Link> / <Link href="/destinations">Дестинации</Link> / {destination}
        </Breadcrumb>
        <DestinationInfo>
          <Title style={{margin: 0}}>{destination}</Title>
          <Highlight>{trips.length} {trips.length === 1 ? 'екскурзия' : 'екскурзии'}</Highlight>
        </DestinationInfo>
        {trips.length === 0 ? (
          <EmptyState>Няма намерени екскурзии за тази дестинация.</EmptyState>
        ) : (
          <ProductsGrid products={trips} />
        )}
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps({params}) {
  try {
    await mongooseConnect();
    let name = decodeURIComponent(params.name).trim();
    // Нормализираме множествените интервали до един интервал
    name = name.replace(/\s+/g, ' ');

    // Търсим по комбинирания низ (държава + град), както е генериран в destinations.js
    // Използваме aggregation pipeline за да създадем същия destinationName
    const tripsAgg = await Product.aggregate([
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
          destinationName: name,
        },
      },
    ]);

    // Ако не намерим с точното съвпадение, опитваме се с нормализирано търсене
    let trips = tripsAgg || [];
    if (trips.length === 0) {
      // Търсим по regex за да се справим с множествените интервали
      const allTrips = await Product.aggregate([
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
      ]);
      
      // Филтрираме в JavaScript за нормализация на интервалите
      trips = allTrips.filter(trip => {
        const normalizedTripName = trip.destinationName?.replace(/\s+/g, ' ').trim();
        return normalizedTripName === name;
      });
    }

    return {
      props: {
        destination: trips.length > 0 ? name : null,
        trips: JSON.parse(JSON.stringify(trips)),
      }
    };
  } catch (error) {
    console.error('Error fetching destination:', error);
    return {
      props: {
        destination: null,
        trips: [],
      }
    };
  }
}

