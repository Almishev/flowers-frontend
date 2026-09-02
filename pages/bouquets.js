export default function LegacyBouquetsRedirect() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/perfumes',
      permanent: true,
    },
  };
}
