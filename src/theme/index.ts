import { useColorScheme } from 'react-native';
import { colors } from './colors';
import { spacing, borderRadius, iconSizes } from './spacing';
import { typography } from './typography';

export type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  iconSizes: typeof iconSizes;
  typography: typeof typography;
  isDark: boolean;
};

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    colors,
    spacing,
    borderRadius,
    iconSizes,
    typography,
    isDark,
  };
};

export { colors, spacing, borderRadius, iconSizes, typography };


