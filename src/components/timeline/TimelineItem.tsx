import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TimelineItem as TimelineItemType } from '../../store/serviceStore';
import ServiceCard from './ServiceCard';
import AccidentCard from './AccidentCard';
import ReminderCard from './ReminderCard';
import { useTheme } from '../../theme';

type TimelineItemProps = {
  item: TimelineItemType;
  onPress: (item: TimelineItemType) => void;
};

const TimelineItem: React.FC<TimelineItemProps> = ({ item, onPress }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handlePress = () => {
    onPress(item);
  };

  return (
    <View style={styles.container}>
      {item.type === 'service' && (
        <ServiceCard service={item.data as any} onPress={handlePress} />
      )}
      {item.type === 'accident' && (
        <AccidentCard accident={item.data as any} onPress={handlePress} />
      )}
      {item.type === 'reminder' && (
        <ReminderCard reminder={item.data as any} onPress={handlePress} />
      )}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) => {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
  });
};

export default TimelineItem;


