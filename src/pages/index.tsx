

export default function HomePage(){
  return <></>;
}

export async function getServerSideProps() {
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    }
}