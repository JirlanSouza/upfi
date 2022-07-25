import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import {
  FieldError,
  FieldValues,
  useForm,
  UseFormSetError,
  UseFormTrigger,
} from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  interface AddImageForm extends FieldValues {
    image: FileList;
    title: string;
    description: string;
  }

  const formValidations = {
    image: {
      required: true,
      validate: (value: FileList) => {
        return value[0].size <= 10000000
          ? true
          : 'O arquivo deve ser menor que 10MB';
      },
    },
    title: {
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    description: {
      required: true,
      maxLength: 20,
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (data: AddImageForm) => {
      const { title, description } = data;

      const response = await api.post('/api/images', {
        title,
        description,
        url: imageUrl,
      });

      return response;
    },
    {
      onSuccess() {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm<AddImageForm>();
  const { errors } = formState;

  const onSubmit = async (data: AddImageForm): Promise<void> => {
    try {
      if (!imageUrl || imageUrl === '') {
        toast({
          title: 'Url vázia',
          description: 'A url da imagem está vázia.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });

        return;
      }

      await mutation.mutate(data);

      toast({
        title: 'Imagen salva',
        description: 'A nova imagem foi salva com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Erro ao salvar',
        description: 'Houve um erro ao savar a nova imagem.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError as unknown as UseFormSetError<FieldValues>}
          trigger={trigger as unknown as UseFormTrigger<FieldValues>}
          error={errors.image as FieldError}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
