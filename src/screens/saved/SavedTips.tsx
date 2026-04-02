import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Share,
  ImageBackground,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSavedStore } from '../../store/savedStore';
import { fishingTips } from '../../data/fishingTips';
import { FishingTip } from '../../types/guide';
import { Colors } from '../../constants/colors';
import { RootStackParamList } from '../../navigation/types';

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

type SortMode = 'newest' | 'shortest';

type UiConfig = {
  isVerySmall: boolean;
  isSmall: boolean;
  isNarrow: boolean;
  sidePad: number;
  topGap: number;
  contentTopGap: number;
  sectionGap: number;
  listBottom: number;
  boardWidth: number;
  boardHeight: number;
  boardFont: number;
  titleHorizontalPad: number;
  exitFont: number;
  exitRight: number;
  emptyCardRadius: number;
  emptyCardPad: number;
  emptyImageW: number;
  emptyImageH: number;
  emptyTextFont: number;
  emptyTextLine: number;
  goBtnHeight: number;
  goBtnRadius: number;
  goBtnFont: number;
  cardRadius: number;
  cardPad: number;
  fishSize: number;
  tipFont: number;
  tipLine: number;
  actionBtnSize: number;
  actionBtnRadius: number;
  actionIcon: number;
  actionGap: number;
  filterHeight: number;
  filterFont: number;
  badgeFont: number;
};

const buildUi = (width: number, height: number): UiConfig => {
  const isVerySmall = height < 700;
  const isSmall = height < 780;
  const isNarrow = width < 360;

  const sidePad = isNarrow ? 12 : 16;
  const boardWidth = clamp(width * 0.78, 250, 560);

  return {
    isVerySmall,
    isSmall,
    isNarrow,
    sidePad,
    topGap: isVerySmall ? 6 : isSmall ? 10 : 14,
    contentTopGap: isVerySmall ? 10 : 14,
    sectionGap: isVerySmall ? 8 : 10,
    listBottom: isVerySmall ? 90 : 110,
    boardWidth,
    boardHeight: isVerySmall ? 58 : isSmall ? 68 : 78,
    boardFont: isVerySmall ? 14 : isSmall ? 16 : 18,
    titleHorizontalPad: isVerySmall ? 78 : isSmall ? 88 : 96,
    exitFont: isVerySmall ? 12 : 14,
    exitRight: isVerySmall ? 14 : 16,
    emptyCardRadius: isVerySmall ? 18 : 20,
    emptyCardPad: isVerySmall ? 12 : 14,
    emptyImageW: isVerySmall ? 72 : 86,
    emptyImageH: isVerySmall ? 88 : 104,
    emptyTextFont: isVerySmall ? 12 : isSmall ? 13 : 14,
    emptyTextLine: isVerySmall ? 18 : isSmall ? 20 : 21,
    goBtnHeight: isVerySmall ? 54 : 60,
    goBtnRadius: isVerySmall ? 16 : 18,
    goBtnFont: isVerySmall ? 14 : 16,
    cardRadius: isVerySmall ? 18 : 20,
    cardPad: isVerySmall ? 12 : 14,
    fishSize: isVerySmall ? 40 : isSmall ? 46 : 52,
    tipFont: isVerySmall ? 11 : isSmall ? 12 : 13,
    tipLine: isVerySmall ? 16 : isSmall ? 18 : 20,
    actionBtnSize: isVerySmall ? 36 : 38,
    actionBtnRadius: isVerySmall ? 10 : 11,
    actionIcon: isVerySmall ? 15 : 16,
    actionGap: isVerySmall ? 8 : 10,
    filterHeight: isVerySmall ? 36 : 40,
    filterFont: isVerySmall ? 11 : 12,
    badgeFont: isVerySmall ? 11 : 12,
  };
};

const SavedFishingTips = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { savedTipIds = [], toggleTip } = useSavedStore();
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  const ui = useMemo(() => buildUi(width, height), [width, height]);

  const saved = useMemo(() => {
    const items = fishingTips.filter((t: FishingTip) => savedTipIds.includes(t.id));

    if (sortMode === 'shortest') {
      return [...items].sort((a, b) => a.text.length - b.text.length);
    }

    return [...items].sort(
      (a, b) => savedTipIds.indexOf(b.id) - savedTipIds.indexOf(a.id),
    );
  }, [savedTipIds, sortMode]);

  const goToHome = () => {
    navigation.navigate('MainApp', { screen: 'Home' } as any);
  };

  const renderHeader = () => (
    <>
      <View
        style={[
          styles.headerWrapper,
          {
            marginTop: insets.top + ui.topGap,
            height: ui.boardHeight,
            width: ui.boardWidth,
          },
        ]}
      >
        <Image
          source={require('../../assets/images/ui/header_board.png')}
          style={styles.boardImg}
          resizeMode="stretch"
        />

        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.headerText,
            {
              fontSize: ui.boardFont,
              paddingHorizontal: ui.titleHorizontalPad,
            },
          ]}
        >
          Saved Fishing Tips
        </Text>

        <TouchableOpacity
          style={[styles.exitBtn, { right: ui.exitRight }]}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.exit, { fontSize: ui.exitFont }]}>Exit</Text>
        </TouchableOpacity>
      </View>

      {saved.length > 0 ? (
        <View
          style={[
            styles.filterRow,
            {
              paddingHorizontal: ui.sidePad,
              paddingTop: ui.contentTopGap + 8,
              paddingBottom: ui.sectionGap,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                minHeight: ui.filterHeight,
                borderRadius: ui.filterHeight / 2,
              },
              sortMode === 'newest' ? styles.filterBtnActive : null,
            ]}
            activeOpacity={0.85}
            onPress={() => setSortMode('newest')}
          >
            <Text
              style={[
                styles.filterBtnText,
                { fontSize: ui.filterFont },
                sortMode === 'newest' ? styles.filterBtnTextActive : null,
              ]}
            >
              Newest
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                minHeight: ui.filterHeight,
                borderRadius: ui.filterHeight / 2,
              },
              sortMode === 'shortest' ? styles.filterBtnActive : null,
            ]}
            activeOpacity={0.85}
            onPress={() => setSortMode('shortest')}
          >
            <Text
              style={[
                styles.filterBtnText,
                { fontSize: ui.filterFont },
                sortMode === 'shortest' ? styles.filterBtnTextActive : null,
              ]}
            >
              Shortest
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.countBadge,
              {
                minHeight: ui.filterHeight,
                borderRadius: ui.filterHeight / 2,
              },
            ]}
          >
            <Text style={[styles.countBadgeText, { fontSize: ui.badgeFont }]}>
              {saved.length}
            </Text>
          </View>
        </View>
      ) : null}
    </>
  );

  if (saved.length === 0) {
    return (
      <ImageBackground
        source={require('../../assets/images/backgrounds/home_bg.png')}
        style={styles.container}
        resizeMode="cover"
      >
        {renderHeader()}

        <View
          style={[
            styles.empty,
            {
              paddingHorizontal: ui.sidePad,
              paddingTop: ui.contentTopGap + 8,
              paddingBottom: insets.bottom + ui.listBottom,
              gap: 16,
            },
          ]}
        >
          <View
            style={[
              styles.emptyCard,
              {
                padding: ui.emptyCardPad,
                borderRadius: ui.emptyCardRadius,
              },
            ]}
          >
            <Image
              source={require('../../assets/images/ui/fisherman_character.png')}
              style={{
                width: ui.emptyImageW,
                height: ui.emptyImageH,
              }}
              resizeMode="contain"
            />

            <Text
              style={[
                styles.emptyText,
                {
                  fontSize: ui.emptyTextFont,
                  lineHeight: ui.emptyTextLine,
                },
              ]}
            >
              Looks like you have not saved any tips yet. Browse fishing tips
              and keep the most useful ones for later.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.goBtn,
              {
                minHeight: ui.goBtnHeight,
                borderRadius: ui.goBtnRadius,
              },
            ]}
            onPress={goToHome}
            activeOpacity={0.88}
          >
            <Text
              style={[
                styles.goBtnText,
                {
                  fontSize: ui.goBtnFont,
                },
              ]}
            >
              Go to Tips
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/backgrounds/home_bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <FlatList
        data={saved}
        keyExtractor={(item: FishingTip) => item.id}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + ui.listBottom,
        }}
        ItemSeparatorComponent={() => <View style={{ height: ui.sectionGap }} />}
        renderItem={({ item }: { item: FishingTip }) => (
          <View
            style={[
              styles.card,
              {
                marginHorizontal: ui.sidePad,
                borderRadius: ui.cardRadius,
                padding: ui.cardPad,
              },
            ]}
          >
            <Image
              source={require('../../assets/images/ui/fish_icon.png')}
              style={{
                width: ui.fishSize,
                height: ui.fishSize,
              }}
              resizeMode="contain"
            />

            <Text
              numberOfLines={4}
              style={[
                styles.tipText,
                {
                  fontSize: ui.tipFont,
                  lineHeight: ui.tipLine,
                },
              ]}
            >
              {item.text}
            </Text>

            <View style={[styles.cardActions, { gap: ui.actionGap }]}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    width: ui.actionBtnSize,
                    height: ui.actionBtnSize,
                    borderRadius: ui.actionBtnRadius,
                  },
                ]}
                onPress={() => Share.share({ message: item.text })}
                activeOpacity={0.85}
              >
                <Text style={{ fontSize: ui.actionIcon }}>📤</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    width: ui.actionBtnSize,
                    height: ui.actionBtnSize,
                    borderRadius: ui.actionBtnRadius,
                  },
                ]}
                onPress={() => toggleTip(item.id)}
                activeOpacity={0.85}
              >
                <Text style={{ fontSize: ui.actionIcon }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
  },

  boardImg: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },

  headerText: {
    color: Colors.white,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  exitBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -12,
  },

  exit: {
    color: Colors.white,
    fontWeight: '700',
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  filterBtn: {
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },

  filterBtnActive: {
    backgroundColor: Colors.primary,
  },

  filterBtnText: {
    color: Colors.white,
    fontWeight: '700',
  },

  filterBtnTextActive: {
    color: Colors.white,
  },

  countBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  countBadgeText: {
    color: Colors.white,
    fontWeight: '800',
  },

  empty: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  emptyCard: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  emptyText: {
    flex: 1,
    color: Colors.white,
    fontWeight: '500',
  },

  goBtn: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  goBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  tipText: {
    flex: 1,
    color: Colors.white,
    fontWeight: '500',
  },

  cardActions: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  actionBtn: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SavedFishingTips;