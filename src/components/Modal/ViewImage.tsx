import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="fit-content" borderRadius={8} bg="pGray.800">
        <ModalBody display="flex" justifyContent="center" p={0}>
          <Image
            objectFit="fill"
            maxW="900px"
            maxH="600px"
            borderTopRadius={8}
            src={imgUrl}
          />
        </ModalBody>
        <ModalFooter justifyContent="flex-start" px={2} py={1}>
          <Link href={imgUrl} target="_blank">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
