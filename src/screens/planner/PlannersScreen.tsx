import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { usePlannerStore } from '../../store/plannerStore';
import { Colors } from '../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type StatusTab = 'upcoming' | 'today' | 'completed';

const TAB_COLORS: Record<StatusTab, string> = {
  upcoming: '#4A90D9',
  today: '#4CAF50',
  completed: '#E53935',
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

type UiConfig = {
  isVerySmall: boolean;
  isSmall: boolean;
  isNarrow: boolean;
  sidePad: number;
  boardWidth: number;
  boardHeight: number;
  boardFont: number;
  topMargin: number;
  tipTop: number;
  tipRadius: number;
  tipPadV: number;
  tipPadH: number;
  fishSize: number;
  tipFont: number;
  tipLineHeight: number;
  listTop: number;
  listGap: number;
  tabsGap: number;
  tabHeight: number;
  tabRadius: number;
  tabFont: number;
  cardRadius: number;
  cardPad: number;
  cardTitle: number;
  cardMeta: number;
  cardActionTop: number;
  deleteSize: number;
  deleteIcon: number;
  openBtnHeight: number;
  openBtnPadH: number;
  openBtnFont: number;
  emptyFont: number;
  footerPadTop: number;
  addBtnHeight: number;
  addBtnRadius: number;
  addBtnFont: number;
  listBottomPad: number;
  footerBottomOffset: number;
  badgeFont: number;
};

const buildUi = (width: number, height: number): UiConfig => {
  const isVerySmall = height < 700;
  const isSmall = height < 780;
  const isNarrow = width < 360;

  const sidePad = isNarrow ? 12 : isVerySmall ? 14 : 16;

  return {
    isVerySmall,
    isSmall,
    isNarrow,
    sidePad,
    boardWidth: clamp(width * (isVerySmall ? 0.7 : 0.74), 230, 420),
    boardHeight: isVerySmall ? 58 : isSmall ? 66 : 76,
    boardFont: isVerySmall ? 15 : isSmall ? 17 : 20,
    topMargin: isVerySmall ? 18 : isSmall ? 22 : 30,
    tipTop: isVerySmall ? 8 : isSmall ? 10 : 14,
    tipRadius: isVerySmall ? 18 : isSmall ? 20 : 24,
    tipPadV: isVerySmall ? 12 : isSmall ? 13 : 14,
    tipPadH: isVerySmall ? 12 : isSmall ? 13 : 14,
    fishSize: isVerySmall ? 42 : isSmall ? 48 : 56,
    tipFont: isVerySmall ? 12 : isSmall ? 13 : 14,
    tipLineHeight: isVerySmall ? 17 : isSmall ? 18 : 20,
    listTop: isVerySmall ? 10 : isSmall ? 12 : 14,
    listGap: isVerySmall ? 7 : isSmall ? 8 : 10,
    tabsGap: isVerySmall ? 6 : 8,
    tabHeight: isVerySmall ? 42 : isSmall ? 44 : 48,
    tabRadius: isVerySmall ? 18 : 20,
    tabFont: isVerySmall ? 10 : isSmall ? 11 : 12,
    cardRadius: isVerySmall ? 18 : isSmall ? 20 : 22,
    cardPad: isVerySmall ? 12 : isSmall ? 13 : 14,
    cardTitle: isVerySmall ? 16 : isSmall ? 17 : 18,
    cardMeta: isVerySmall ? 12 : isSmall ? 13 : 14,
    cardActionTop: isVerySmall ? 10 : 12,
    deleteSize: isVerySmall ? 34 : 36,
    deleteIcon: isVerySmall ? 18 : 20,
    openBtnHeight: isVerySmall ? 40 : 44,
    openBtnPadH: isVerySmall ? 18 : 22,
    openBtnFont: isVerySmall ? 12 : isSmall ? 13 : 14,
    emptyFont: isVerySmall ? 18 : isSmall ? 19 : 20,
    footerPadTop: isVerySmall ? 8 : 10,
    addBtnHeight: isVerySmall ? 58 : isSmall ? 62 : 68,
    addBtnRadius: isVerySmall ? 20 : isSmall ? 22 : 24,
    addBtnFont: isVerySmall ? 17 : isSmall ? 18 : 20,
    listBottomPad: isVerySmall ? 190 : 210,
    footerBottomOffset: isVerySmall ? 102 : 110,
    badgeFont: isVerySmall ? 11 : 12,
  };
};

const PlannerScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { trips, deleteTrip } = usePlannerStore();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const ui = useMemo(() => buildUi(width, height), [width, height]);
  const [activeTab, setActiveTab] = useState<StatusTab>('today');
  const [sortMode, setSortMode] = useState<'newest' | 'name'>('newest');

  const tabs: StatusTab[] = ['upcoming', 'today', 'completed'];

  const filtered = useMemo(() => {
    const items = trips.filter(item => item.status === activeTab);

    if (sortMode === 'name') {
      return [...items].sort((a, b) => a.name.localeCompare(b.name));
    }

    return [...items].sort((a, b) => Number(b.id) - Number(a.id));
  }, [trips, activeTab, sortMode]);

  const handleDelete = (id: string) => {
    Alert.alert('Delete trip', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTrip(id),
      },
    ]);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/backgrounds/home_bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View
        style={[
          styles.headerWrapper,
          {
            marginTop: insets.top + ui.topMargin,
            height: ui.boardHeight,
            width: ui.boardWidth,
          },
        ]}
      >
        <Image
          source={require('../../assets/images/ui/header_board.png')}
          style={styles.headerBoard}
          resizeMode="stretch"
        />
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[styles.headerText, { fontSize: ui.boardFont }]}
        >
          Trip Planner
        </Text>
      </View>

      <View
        style={[
          styles.tipCard,
          {
            marginHorizontal: ui.sidePad,
            marginTop: ui.tipTop,
            borderRadius: ui.tipRadius,
            paddingVertical: ui.tipPadV,
            paddingHorizontal: ui.tipPadH,
          },
        ]}
      >
        <Image
          source={require('../../assets/images/ui/fish_icon.png')}
          style={{ width: ui.fishSize, height: ui.fishSize }}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.tipText,
            {
              fontSize: ui.tipFont,
              lineHeight: ui.tipLineHeight,
            },
          ]}
        >
          Hey angler. Plan your next fishing trip and don't miss the bite!
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: ui.sidePad,
          paddingTop: ui.listTop,
          paddingBottom: insets.bottom + ui.listBottomPad,
        }}
        ItemSeparatorComponent={() => <View style={{ height: ui.listGap }} />}
        ListHeaderComponent={
          <View style={{ marginBottom: ui.listTop }}>
            <View
              style={[
                styles.tabs,
                {
                  gap: ui.tabsGap,
                },
              ]}
            >
              {tabs.map(tab => {
                const isActive = activeTab === tab;

                return (
                  <TouchableOpacity
                    key={tab}
                    activeOpacity={0.88}
                    style={[
                      styles.tab,
                      {
                        minHeight: ui.tabHeight,
                        borderRadius: ui.tabRadius,
                      },
                      isActive ? { backgroundColor: TAB_COLORS[tab] } : null,
                    ]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={[
                        styles.tabText,
                        { fontSize: ui.tabFont },
                        isActive ? styles.tabTextActive : null,
                      ]}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.utilityRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.utilityBtn,
                  sortMode === 'newest' ? styles.utilityBtnActive : null,
                ]}
                onPress={() => setSortMode('newest')}
              >
                <Text
                  style={[
                    styles.utilityBtnText,
                    { fontSize: ui.badgeFont },
                    sortMode === 'newest' ? styles.utilityBtnTextActive : null,
                  ]}
                >
                  Newest
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.utilityBtn,
                  sortMode === 'name' ? styles.utilityBtnActive : null,
                ]}
                onPress={() => setSortMode('name')}
              >
                <Text
                  style={[
                    styles.utilityBtnText,
                    { fontSize: ui.badgeFont },
                    sortMode === 'name' ? styles.utilityBtnTextActive : null,
                  ]}
                >
                  A-Z
                </Text>
              </TouchableOpacity>

              <View style={styles.countBadge}>
                <Text style={[styles.countBadgeText, { fontSize: ui.badgeFont }]}>
                  {filtered.length}
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                borderRadius: ui.cardRadius,
                padding: ui.cardPad,
              },
            ]}
          >
            <View style={styles.cardTop}>
              <Text
                numberOfLines={1}
                style={[
                  styles.cardTitle,
                  {
                    fontSize: ui.cardTitle,
                    marginRight: 10,
                  },
                ]}
              >
                {item.name}
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  styles.cardStatus,
                  {
                    fontSize: ui.cardMeta,
                  },
                ]}
              >
                Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>

            {item.location ? (
              <Text style={[styles.cardSub, { fontSize: ui.cardMeta }]}>
                📍 {item.location}
              </Text>
            ) : null}

            {item.date ? (
              <Text style={[styles.cardSub, { fontSize: ui.cardMeta }]}>
                📅 {item.date}
              </Text>
            ) : null}

            {item.notes ? (
              <Text
                numberOfLines={2}
                style={[styles.cardSub, { fontSize: ui.cardMeta }]}
              >
                📝 {item.notes}
              </Text>
            ) : null}

            <View
              style={[
                styles.cardActions,
                {
                  marginTop: ui.cardActionTop,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.deleteBtn,
                  {
                    width: ui.deleteSize,
                    height: ui.deleteSize,
                  },
                ]}
                onPress={() => handleDelete(item.id)}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: ui.deleteIcon }}>🗑</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.openBtn,
                  {
                    minHeight: ui.openBtnHeight,
                    paddingHorizontal: ui.openBtnPadH,
                    borderRadius: ui.openBtnHeight / 2.3,
                  },
                ]}
                onPress={() => navigation.navigate('PlannerEdit', { id: item.id })}
                activeOpacity={0.88}
              >
                <Text
                  style={[
                    styles.openBtnText,
                    {
                      fontSize: ui.openBtnFont,
                    },
                  ]}
                >
                  Open
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text
              style={[
                styles.empty,
                {
                  fontSize: ui.emptyFont,
                  marginTop: ui.isVerySmall ? 26 : 32,
                },
              ]}
            >
              No trips yet
            </Text>
          </View>
        }
      />

      <View
        pointerEvents="box-none"
        style={[
          styles.footer,
          {
            paddingHorizontal: ui.sidePad,
            paddingTop: ui.footerPadTop,
            bottom: insets.bottom + ui.footerBottomOffset,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.addBtn,
            {
              minHeight: ui.addBtnHeight,
              borderRadius: ui.addBtnRadius,
            },
          ]}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('PlannerAdd')}
        >
          <Text
            style={[
              styles.addBtnText,
              {
                fontSize: ui.addBtnFont,
              },
            ]}
          >
            + Plan Trip
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },

  headerBoard: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },

  headerText: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1,
    paddingHorizontal: 44,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  tipCard: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  tipText: {
    flex: 1,
    color: Colors.white,
    fontWeight: '500',
  },

  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tab: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  tabText: {
    color: Colors.white,
    fontWeight: '600',
  },

  tabTextActive: {
    color: Colors.white,
    fontWeight: 'bold',
  },

  utilityRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  utilityBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  utilityBtnActive: {
    backgroundColor: Colors.primary,
  },

  utilityBtnText: {
    color: Colors.white,
    fontWeight: '700',
  },

  utilityBtnTextActive: {
    color: Colors.white,
  },

  countBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  countBadgeText: {
    color: Colors.white,
    fontWeight: '800',
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  cardTitle: {
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },

  cardStatus: {
    color: '#666',
    flexShrink: 1,
    textAlign: 'right',
    maxWidth: '44%',
  },

  cardSub: {
    color: '#555',
    marginTop: 6,
  },

  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  deleteBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  openBtn: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  openBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
  },

  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: {
    textAlign: 'center',
    color: Colors.white,
    fontWeight: '400',
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },

  addBtn: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  addBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default PlannerScreen;