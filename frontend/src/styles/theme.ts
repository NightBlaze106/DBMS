import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#E5F6FF',
      100: '#B8E7FF',
      200: '#8AD8FF',
      300: '#5CC9FF',
      400: '#2EBAFF',
      500: '#00ABFF',
      600: '#0089CC',
      700: '#006799',
      800: '#004466',
      900: '#002233',
    },
  },
  fonts: {
    heading: '"Nunito", sans-serif',
    body: '"Open Sans", sans-serif',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
}); 