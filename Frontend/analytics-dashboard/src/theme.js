// theme.js
import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  cssVarPrefix: 'chakra',
};

const colors = {
  brand: {
    50: '#e3f2f9',
    100: '#c5e4f3',
    200: '#a2d4ec',
    300: '#7ac1e4',
    400: '#47a9da',
    500: '#0088cc',
    600: '#007ab8',
    700: '#006ba1',
    800: '#005885',
    900: '#003f5e',
  },
};

const fonts = {
  heading: 'Montserrat, sans-serif',
  body: 'Inter, sans-serif',
};

const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    },
  }),
};

const components = {
  Box: {
    baseStyle: (props) => ({
      bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    }),
  },
  Card: {
    baseStyle: (props) => ({
      bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    }),
  },
  Container: {
    baseStyle: (props) => ({
      bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
    }),
  },
  Table: {
    variants: {
      simple: (props) => ({
        th: {
          bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.50',
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
        td: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
      }),
    },
  },
  Button: {
    baseStyle: (props) => ({
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    }),
  },
  Heading: {
    baseStyle: (props) => ({
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    }),
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
});

export default theme;
