import React, { useMemo } from 'react';
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

type UiConfig = {
  isVerySmall: boolean;
  isSmall: boolean;
  isNarrow: boolean;
  sidePad: number;
  topGap: number;
  sectionGap: number;
  listBottom: number;
  boardWidth: number;
  boardHeight: number;
  boardFont: number;
  exitFont: number;
  exitRight: number;
  titlePadHorizontal: number;
  cardRadius: number;
  cardPad: number;
  fishSize: number;
  tipFont: number;
  tipLineHeight: number;
  actionsGap: number;
  actionBtnSize: number;
  actionIcon: number;
  emptyCardRadius: number;
  emptyImageW: number;
  emptyImageH: number;
  emptyFont: number;
  emptyLineHeight: number;
  goBtnHeight: number;
  goBtnFont: number;
};

const buildUi = (width: number, height: number): UiConfig => {
  const isVerySmall = height < 700;
  const isSmall = height < 780;
  const isNarrow = width < 360;

  return {
    isVerySmall,
    isSmall,
    isNarrow,
    sidePad: isNarrow ? 12 : 16,
    topGap: isVerySmall ? 6 : isSmall ? 10 : 14,
    sectionGap: isVerySmall ? 8 : 10,
    listBottom: isVerySmall ? 90 : 110,
    boardWidth: clamp(width * 0.78, 250, 560),
    boardHeight: isVerySmall ? 58 : isSmall ? 68 : 78,
    boardFont: isVerySmall ? 14 : isSmall ? 16 : 18,
    exitFont: isVerySmall ? 12 : 14,
    exitRight: isVerySmall ? 14 : 16,
    titlePadHorizontal: isVerySmall ? 74 : 84,
    cardRadius: isVerySmall ? 18 : 20,
    cardPad: isVerySmall ? 12 : 14,
    fishSize: isVerySmall ? 40 : isSmall ? 46 : 52,
    tipFont: isVerySmall ? 11 : isSmall ? 12 : 13,
    tipLineHeight: isVerySmall ? 16 : isSmall ? 18 : 20,
    actionsGap: isVerySmall ? 8 : 10,
    actionBtnSize: isVerySmall ? 36 : 38,
    actionIcon: isVerySmall ? 15 : 16,
    emptyCardRadius: isVerySmall ? 18 : 20,
    emptyImageW: isVerySmall ? 72 : 86,
    emptyImageH: isVerySmall ? 88 : 104,
    emptyFont: isVerySmall ? 12 : isSmall ? 13 : 14,
    emptyLineHeight: isVerySmall ? 18 : 20,
    goBtnHeight: isVerySmall ? 54 : 60,
    goBtnFont: isVerySmall ? 14 : 16,
  };
};

const SavedFishingTips = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { savedTipIds = [], toggleTip } = useSavedStore();

  const ui = useMemo(() => buildUi(width, height), [width, height]);
  const saved = fishingTips.filter((t: FishingTip) => savedTipIds.includes(t.id));

  const goToHome = () => {
    navigation.navigate('MainApp', { screen: 'Home' } as any);
  };

  if (saved.length === 0) {
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
                paddingHorizontal: ui.titlePadHorizontal,
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

        <View
          style={[
            styles.empty,
            {
              paddingHorizontal: ui.sidePad,
              paddingTop: ui.sectionGap + 8,
              paddingBottom: insets.bottom + ui.listBottom,
              gap: 16,
            },
          ]}
        >
          <View
            style={[
              styles.emptyCard,
              {
                padding: ui.cardPad,
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
                  fontSize: ui.emptyFont,
                  lineHeight: ui.emptyLineHeight,
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
                borderRadius: 16,
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
              paddingHorizontal: ui.titlePadHorizontal,
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

      <FlatList
        data={saved}
        keyExtractor={(item: FishingTip) => item.id}
        contentContainerStyle={{
          paddingHorizontal: ui.sidePad,
          paddingTop: ui.sectionGap + 8,
          paddingBottom: insets.bottom + ui.listBottom,
        }}
        ItemSeparatorComponent={() => <View style={{ height: ui.sectionGap }} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: FishingTip }) => (
          <View
            style={[
              styles.card,
              {
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
              style={[
                styles.tipText,
                {
                  fontSize: ui.tipFont,
                  lineHeight: ui.tipLineHeight,
                },
              ]}
            >
              {item.text}
            </Text>

            <View style={[styles.cardActions, { gap: ui.actionsGap }]}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    width: ui.actionBtnSize,
                    height: ui.actionBtnSize,
                    borderRadius: 10,
                  },
                ]}
                onPress={() => Share.share({ message: item.text })}
              >
                <Text style={{ fontSize: ui.actionIcon }}>📤</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    width: ui.actionBtnSize,
                    height: ui.actionBtnSize,
                    borderRadius: 10,
                  },
                ]}
                onPress={() => toggleTip(item.id)}
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