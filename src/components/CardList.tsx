import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const viewImageDisclosure = useDisclosure();
  const [imageUrl, setImageUrl] = useState('');

  function handleViwImage(url: string): void {
    setImageUrl(url);
    viewImageDisclosure.onOpen();
  }

  return (
    <>
      <SimpleGrid columns={3} gap={8} mb={8}>
        {cards.map(card => {
          return (
            <Card
              key={card.id}
              data={{ ...card }}
              viewImage={url => handleViwImage(url)}
            />
          );
        })}
      </SimpleGrid>

      <ModalViewImage imgUrl={imageUrl} {...viewImageDisclosure} />
    </>
  );
}
