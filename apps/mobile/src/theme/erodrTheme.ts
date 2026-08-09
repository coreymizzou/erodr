import { Platform } from 'react-native';

export const erodrTheme = {
  colors: {
    // Pixel-sampled from the user-supplied 2013–2015 iPhone screenshots.
    historicalGreen: '#4CBE5F',
    radarGreen: '#009203',
    headerGreen: '#4CBE5F',
    cyan: '#4CBE5F',
    selectedTabCyan: '#4CBE5F',
    selectorBackground: '#FFFFFF',
    feedGutter: '#EFEFEF',
    surface: '#FFFFFF',
    text: '#111111',
    author: '#333333',
    secondaryText: '#929292',
    action: '#999999',
    inactiveTab: '#999999',
    divider: '#B2B2B2',
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
    title: 22,
    segment: 17,
    author: 19,
    metadata: 15,
    body: 20,
    action: 15,
  },
  metrics: {
    headerHeight: 65,
    selectorHeight: 49,
    avatarSize: 52,
    actionRowHeight: 58,
    tabBarHeight: 72,
    hairline: 1,
  },
} as const;

export type ErodrTheme = typeof erodrTheme;
