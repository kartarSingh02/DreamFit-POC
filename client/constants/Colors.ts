/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Centralized color palette for DreamFit premium dark theme
const Colors = {
  // Premium gradient backgrounds - Choose one by uncommenting:
  
  // Option 1: Deep Space Blue (Premium fitness look)
  // backgroundGradient: ['#0A0A0F', '#1A1A2E', '#16213E'],
  
  // Option 2: Royal Purple (Luxury premium)
  // backgroundGradient: ['#0F0F23', '#1E1E3F', '#2D1B69'],
  
  // Option 3: Midnight Ocean (Sophisticated dark)
  // backgroundGradient: ['#0A0A0A', '#1A1A2E', '#16213E'],
  
  // Option 4: Slate Professional (Corporate premium)
  // backgroundGradient: ['#0F1419', '#1E293B', '#334155'],
  
  // Option 5: Deep Emerald (Nature premium)
  // backgroundGradient: ['#0A0F0A', '#1A2E1A', '#162E16'],
  
  // Option 6: Sunset Premium (Warm premium) - CURRENT
  // backgroundGradient: ['#1A0A0A', '#2E1A1A', '#3E1621'],
  
  // NEW PREMIUM OPTIONS (Warm & Elegant):
  
  // Option 7: Golden Premium (Luxury gold)
  // backgroundGradient: ['#1A0F0A', '#2E1A0A', '#3E2A0A'],
  
  // Option 8: Emerald Luxury (Rich green)
  // backgroundGradient: ['#0A1A0A', '#1A2E1A', '#2A3E2A'],
  
  // Option 9: Purple Majesty (Royal purple)
  // backgroundGradient: ['#1A0A1A', '#2E1A2E', '#3E1A3E'],
  
  // Option 10: Bronze Elegance (Warm bronze)
  // backgroundGradient: ['#1A0F0A', '#2E1F0A', '#3E2F0A'],
  
  // Option 11: Crimson Premium (Rich red)
  // backgroundGradient: ['#1A0A0A', '#2E0A0A', '#3E0A0A'],
  
  // Option 12: Teal Sophistication (Rich teal) - CURRENT
  backgroundGradient: ['#0A1A1A', '#1A2E2E', '#2A3E3E'],
  
  // Updated for Teal Sophistication theme - Softer, Eye-Friendly Colors
  cardBackground: '#0F1A1A', // Dark teal-tinted to match background
  primaryText: '#FFFFFF',
  secondaryText: '#B0B0B0',
  accent: '#4A9B8F', // Muted teal - easier on eyes
  gold: '#5ABFB3', // Soft teal for highlights
  silver: '#4A9B8F', // Muted teal for 2nd place
  bronze: '#3A8B7F', // Darker muted teal for 3rd place
  borderColor: 'rgba(74, 155, 143, 0.15)', // Very subtle teal border
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 6, // Android
};

export default Colors;
export { Colors };
