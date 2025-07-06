/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Theme types
export type Theme = 'light' | 'dark';

// Centralized color palette for DreamFit with light and dark themes
const Colors = {
  // Dark Theme (Current Premium)
  dark: {
    // Premium gradient backgrounds
    backgroundGradient: ['#000000', '#000000', '#16213E'],
    
    // High contrast colors for dark theme
    cardBackground: '#0F1A1A', // Dark teal-tinted to match background
    primaryText: '#FFFFFF',
    secondaryText: '#B0B0B0',
    accent: '#3B82F6', // Bright blue for excellent contrast
    gold: '#F59E0B', // Warm gold for highlights
    silver: '#6B7280', // Medium gray for 2nd place
    bronze: '#92400E', // Warm brown for 3rd place
    borderColor: 'rgba(59, 130, 246, 0.15)', // Subtle blue border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6, // Android
  },

  // Light Theme (New Premium)
  light: {
    // Light premium gradient backgrounds
    backgroundGradient: ['#FFFFFF', '#F8FAFC', '#E2E8F0'],
    
    // High contrast colors for light theme
    cardBackground: '#FFFFFF', // Pure white cards
    primaryText: '#1E293B', // Dark slate for primary text
    secondaryText: '#64748B', // Medium slate for secondary text
    accent: '#DC2626', // Bright red for excellent contrast
    gold: '#F59E0B', // Warm gold for highlights
    silver: '#6B7280', // Medium gray for 2nd place
    bronze: '#92400E', // Warm brown for 3rd place
    borderColor: 'rgba(220, 38, 38, 0.2)', // Red border for light theme
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android
  },

  // Legacy support - defaults to dark theme
  backgroundGradient: ['#000000', '#000000', '#16213E'],
  cardBackground: '#0F1A1A',
  primaryText: '#FFFFFF',
  secondaryText: '#B0B0B0',
  accent: '#3B82F6',
  gold: '#F59E0B',
  silver: '#6B7280',
  bronze: '#92400E',
  borderColor: 'rgba(59, 130, 246, 0.15)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 6,
};

export default Colors;
export { Colors };
