

export default function HomePage(){
  return <></>;
}

export async function getServerSideProps() {
    return {
      redirect: {
        destination: '/nationality',
        permanent: false,
      },
    }
}