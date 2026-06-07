// DaylitScreen — cream-bg base for main-app surfaces.
// SPEC §7.1 register: Today, Wins, Vision Detail, Search, Settings, Witness
// all sit on the cream background with ink type. The Cosmic register is
// reserved for the morning ritual + onboarding.

import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/ui/tokens';

interface Props {
  children: React.ReactNode;
  /** Edges to pad with safe-area inset. Defaults to top/left/right. */
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function DaylitScreen({ children, edges = ['top', 'left', 'right'] }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
}
