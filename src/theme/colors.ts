export const colors = {
  // Primary colors
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  primaryLight: '#3B82F6',
  
  // Status colors
  success: '#10B981',
  successDark: '#059669',
  warning: '#F59E0B',
  warningDark: '#D97706',
  danger: '#EF4444',
  dangerDark: '#DC2626',
  info: '#3B82F6',
  
  // Neutral colors - Light mode
  light: {
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceSecondary: '#F3F4F6',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Neutral colors - Dark mode
  dark: {
    background: '#111827',
    backgroundSecondary: '#1F2937',
    surface: '#1F2937',
    surfaceSecondary: '#374151',
    border: '#374151',
    borderLight: '#4B5563',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Semantic colors
  serviceCard: '#EFF6FF',
  accidentCard: '#FEF2F2',
  reminderCard: '#FEF3C7',
  
  // Shadows
  shadow: {
    sm: '#00000010',
    md: '#00000020',
    lg: '#00000030',
  },
};

export type Colors = typeof colors;


