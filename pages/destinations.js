import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Image from "next/image";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import BookPlaceholderIcon from "@/components/BookPlaceholderIcon";
import SEO from "@/components/SEO";

const DestinationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const DestinationCard = styled(Link)`
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }
`;

const BookPreview = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  span {
    font-size: 0.9rem;
    color: #555;
  }
`;
const PreviewPlaceholder = styled.div`
  width: 48px;
  height: 68px;
  border-radius: 10px;
  border: 1px dashed #d4d4d8;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DestinationName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #111;
`;

const TripCount = styled.span`
  display: inline-block;
  background-color: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
`;

export default function DestinationsPage({destinations, page, totalPages, totalCount}) {
  return (
    <>
      <SEO 
        title="Дестинации"
        description={`Дестинации за екскурзии. Общо ${totalCount} ${totalCount === 1 ? 'дестинация' : 'дестинации'}.`}
        url="/destinations"
        image="/logo.png"
      />
      <Header />
      <Center>
        <Title>Дестинации</Title>
        <p style={{color:'#6b7280', marginTop:'-8px'}}>Общо дестинации: {totalCount}</p>
        {destinations.length === 0 ? (
          <div>Все още няма добавени дестинации.</div>
        ) : (
          <>
            <DestinationsGrid>
              {destinations.map(dest => (
                <DestinationCard key={dest.name} href={`/destination/${encodeURIComponent(dest.name)}`}>
                  <DestinationName>{dest.name}</DestinationName>
                  <TripCount>{dest.count} {dest.count === 1 ? 'екскурзия' : 'екскурзии'}</TripCount>
                  {dest.sample && (
                    <BookPreview>
                      {dest.sample.image ? (
                        <Image 
                          src={dest.sample.image} 
                          alt={dest.sample.title}
                          width={48}
                          height={68}
                          style={{
                            width: '48px',
                            height: '68px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            background: '#f3f3f3',
                            border: '1px solid #e5e7eb',
                          }}
                          loading="lazy"
                          unoptimized={dest.sample.image?.includes('s3.amazonaws.com')}
                        />
                      ) : (
                        <PreviewPlaceholder>
                          <BookPlaceholderIcon size={36} />
                        </PreviewPlaceholder>
                      )}
                      <span>{dest.sample.title}</span>
                    </BookPreview>
                  )}
                </DestinationCard>
              ))}
            </DestinationsGrid>
            <Pagination page={page} totalPages={totalPages} basePath="/destinations" />
          </>
        )}
      </Center>
      <Footer />
    </>
  );
}

const PAGE_SIZE = 20;

export async function getServerSideProps({query}) {
  try {
    await mongooseConnect();
    const pageParam = parseInt(query.page, 10);
    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

    // Групираме по дестинация (държава + град, ако има)
    const countResult = await Product.aggregate([
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
        $group: {_id: "$destinationName"},
      },
      {$count: "total"},
    ]);

    const totalCount = countResult[0]?.total || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const currentPage = totalCount === 0 ? 1 : Math.min(page, totalPages);
    const skip = (currentPage - 1) * PAGE_SIZE;

    const destinationsAgg = await Product.aggregate([
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
      {$sort: {_id: 1}},
      {$skip: skip},
      {$limit: PAGE_SIZE},
    ]);

    const destinations = destinationsAgg.map(item => ({
      name: item._id ? item._id.replace(/\s+/g, ' ').trim() : item._id,
      count: item.count,
      sample: item.sample || null,
    }));

    return {
      props: {
        destinations: JSON.parse(JSON.stringify(destinations)),
        page: currentPage,
        totalPages,
        totalCount,
      },
    };
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return {
      props: {
        destinations: [],
        page: 1,
        totalPages: 1,
        totalCount: 0,
      },
    };
  }
}

