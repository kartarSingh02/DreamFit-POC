import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Screen size breakpoints
export const isSmallScreen = screenWidth < 375;
export const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
export const isLargeScreen = screenWidth >= 414;

// Responsive spacing
export const spacing = {
  xs: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
  sm: isSmallScreen ? 8 : isMediumScreen ? 10 : 12,
  md: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
  lg: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
  xl: isSmallScreen ? 20 : isMediumScreen ? 24 : 28,
  xxl: isSmallScreen ? 24 : isMediumScreen ? 28 : 32,
};

// Responsive font sizes
export const fontSize = {
  xs: isSmallScreen ? 10 : isMediumScreen ? 11 : 12,
  sm: isSmallScreen ? 12 : isMediumScreen ? 13 : 14,
  md: isSmallScreen ? 14 : isMediumScreen ? 15 : 16,
  lg: isSmallScreen ? 16 : isMediumScreen ? 17 : 18,
  xl: isSmallScreen ? 18 : isMediumScreen ? 20 : 22,
  xxl: isSmallScreen ? 20 : isMediumScreen ? 22 : 24,
  xxxl: isSmallScreen ? 24 : isMediumScreen ? 26 : 28,
};

// Responsive icon sizes
export const iconSize = {
  sm: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
  md: isSmallScreen ? 20 : isMediumScreen ? 22 : 24,
  lg: isSmallScreen ? 24 : isMediumScreen ? 26 : 28,
  xl: isSmallScreen ? 28 : isMediumScreen ? 30 : 32,
};

// Responsive padding
export const padding = {
  xs: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
  sm: isSmallScreen ? 8 : isMediumScreen ? 10 : 12,
  md: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
  lg: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
  xl: isSmallScreen ? 20 : isMediumScreen ? 24 : 28,
};

// Responsive margins
export const margin = {
  xs: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
  sm: isSmallScreen ? 8 : isMediumScreen ? 10 : 12,
  md: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
  lg: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
  xl: isSmallScreen ? 20 : isMediumScreen ? 24 : 28,
};

// Responsive border radius
export const borderRadius = {
  sm: isSmallScreen ? 6 : isMediumScreen ? 8 : 10,
  md: isSmallScreen ? 8 : isMediumScreen ? 10 : 12,
  lg: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
  xl: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
};

// Screen dimensions
export const screenDimensions = {
  width: screenWidth,
  height: screenHeight,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
};

// Responsive card dimensions
export const cardDimensions = {
  width: screenWidth - (isSmallScreen ? 32 : isMediumScreen ? 40 : 48),
  height: {
    sm: isSmallScreen ? 80 : isMediumScreen ? 90 : 100,
    md: isSmallScreen ? 120 : isMediumScreen ? 140 : 160,
    lg: isSmallScreen ? 160 : isMediumScreen ? 180 : 200,
  },
};

// Responsive button dimensions
export const buttonDimensions = {
  height: {
    sm: isSmallScreen ? 32 : isMediumScreen ? 36 : 40,
    md: isSmallScreen ? 40 : isMediumScreen ? 44 : 48,
    lg: isSmallScreen ? 48 : isMediumScreen ? 52 : 56,
  },
  paddingHorizontal: {
    sm: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
    md: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
    lg: isSmallScreen ? 20 : isMediumScreen ? 24 : 28,
  },
}; 