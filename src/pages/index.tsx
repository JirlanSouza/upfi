import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type Pages = {
  data: Image[];
  after?: string;
};

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async params => {
      const path = params.pageParam
        ? `api/images?after=${params?.pageParam}`
        : 'api/images';

      const response = await api.get<Pages>(path);

      return response?.data;
    },
    {
      getNextPageParam: lastPage => {
        return lastPage?.after ? lastPage?.after : null;
      },
    }
  );

  const formattedData = useMemo(() => {
    const flatData = data?.pages?.flat();

    return flatData
      ?.map(dataItem => {
        return dataItem?.data;
      })
      .flat();
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  function handleNextPage(): void {
    if (hasNextPage) {
      fetchNextPage();
    }
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {(hasNextPage || isFetchingNextPage) && (
          <Button
            isLoading={isFetchingNextPage}
            colorScheme="orange"
            onClick={() => handleNextPage()}
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
