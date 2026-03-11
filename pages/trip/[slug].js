export default function LegacyTripRedirect() {
  return null;
}

export async function getServerSideProps(context) {
  const { slug } = context.query;

  return {
    redirect: {
      destination: `/bouquet/${slug}`,
      permanent: true,
    },
  };
}

