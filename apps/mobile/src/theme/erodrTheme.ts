import { Platform } from 'react-native';

export const erodrTheme = {
  colors: {
    // Pixel-sampled from the 2017 App Store screenshot.
    headerGreen: '#009933',
    cyan: '#00BCD4',
    selectedTabCyan: '#01D5F0',
    selectorBackground: '#F8F8F8',
    feedGutter: '#E3E3E3',
    surface: '#FFFFFF',
    text: '#343434',
    author: '#505050',
    secondaryText: '#858585',
    action: '#A4A4A4',
    inactiveTab: '#D0D0D0',
    divider: '#E2E2E2',
    warning: '#D7A400',
    destructive: '#C24B46',
    mizzouGold: '#F1B82D',
    black: '#111111',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  type: {
    family: Platform.select({ ios: 'Helvetica Neue', default: 'sans-serif' }),
    title: 24,
    segment: 20,
    author: 18,
    metadata: 14,
    body: 18,
    action: 15,
  },
  metrics: {
    headerHeight: 108,
    selectorHeight: 48,
    avatarSize: 56,
    actionRowHeight: 55,
    tabBarHeight: 67,
    hairline: 1,
  },
} as const;

export type ErodrTheme = typeof erodrTheme;
