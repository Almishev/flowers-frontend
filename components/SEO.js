import Head from 'next/head';

export default function SEO({
  title = 'DÉLIE – онлайн магазин за оригинални парфюми',
  description = 'Оригинални парфюми онлайн в DÉLIE. Дамски, мъжки, унисекс, арабски и нишови аромати с доставка в цяла България.',
  keywords = 'оригинални парфюми, купи оригинален парфюм, дамски парфюми, мъжки парфюми, унисекс парфюми, арабски парфюми, нишови парфюми, DÉLIE',
  image = '/parfumes_sell.png',
  url,
  type = 'website',
  author,
  structuredData,
  breadcrumbs,
}) {
  // За локална среда използваме localhost, иначе production URL
  // Проверяваме дали сме на клиента и дали hostname е localhost
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl && typeof window !== 'undefined') {
    siteUrl = window.location.origin; // Автоматично взима текущия origin (localhost:3000 или production)
  }
  if (!siteUrl) {
    siteUrl = '';
  }
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  
  // Обработка на изображенията - ако е абсолютен URL (http/https), използваме го директно
  // Ако е относителен път, добавяме siteUrl
  // Ако е S3 URL или друг външен URL, използваме го директно
  let fullImage;
  if (image.startsWith('http://') || image.startsWith('https://')) {
    fullImage = image;
  } else if (image.startsWith('//')) {
    fullImage = `https:${image}`;
  } else {
    // Относителен път - добавяме siteUrl
    const imagePath = image.startsWith('/') ? image : '/' + image;
    // Използваме encodeURI за правилно кодиране на целия път, включително кирилица
    fullImage = `${siteUrl}${encodeURI(imagePath)}`;
  }

  // Structured Data за парфюмен магазин
  const defaultStructuredData = [
    {
      '@context': 'https://schema.org',
      '@type': ['Store', 'Organization'],
      name: 'DÉLIE',
      alternateName: 'DELIE',
      description: 'Онлайн магазин за оригинални парфюми – дамски, мъжки, унисекс, арабски и нишови аромати.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Гоце Делчев',
        addressRegion: 'Благоевград',
        addressCountry: 'BG',
        streetAddress: 'ул. Серес 12',
        postalCode: '2900',
      },
      url: siteUrl,
      telephone: '+359 877 382 224',
      email: 'danieladelieva1985@gmail.com',
      priceRange: '$$',
    },
  ];

  return (
    <Head>
      {/* Основни meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author || 'DÉLIE'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="language" content="bg" />
      <meta name="geo.region" content="BG-01" />
      <meta name="geo.placename" content="Гоце Делчев, Гърмен, Благоевград" />
      <meta name="geo.position" content="41.5700;23.2800" />
      <meta name="ICBM" content="41.5700, 23.2800" />
      
      {/* Допълнителни SEO meta tags */}
      <meta name="classification" content="Perfume Store, Online Shop" />
      <meta name="category" content="Парфюми, онлайн магазин" />
      <meta name="coverage" content="Гоце Делчев, България" />
      <meta name="distribution" content="Global" />
      <meta name="target" content="Клиенти, подаръци, парфюми" />

      {/* Open Graph / Facebook / Viber */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:url" content={fullImage} />
      <meta property="og:image:secure_url" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="bg_BG" />
      <meta property="og:site_name" content="DÉLIE" />
      
      {/* Допълнителни тагове за Viber и други платформи */}
      <meta name="image" content={fullImage} />
      <meta itemProp="image" content={fullImage} />
      <link rel="image_src" href={fullImage} />
      
      {/* Viber специфични тагове - важно за изпращане на съобщения */}
      <meta name="viber:image" content={fullImage} />
      <meta name="viber:preview" content={fullImage} />
      
      {/* Допълнителни тагове за по-добра поддръжка */}
      <meta name="twitter:image:src" content={fullImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data */}
      {(structuredData || defaultStructuredData).map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />
      ))}
      {breadcrumbs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.name,
                item: `${siteUrl}${crumb.url}`,
              })),
            }),
          }}
        />
      )}
    </Head>
  );
}

