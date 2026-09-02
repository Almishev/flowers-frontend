export default function LegacyTripRedirect() {
  return null;
}

export async function getServerSideProps(context) {
  const { slug } = context.query;

  return {
    redirect: {
      destination: `/perfume/${slug}`,
      permanent: true,
    },
  };
}
