import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';
import { useSavedStore } from '../../store/savedStore';

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

type UiConfig = {
  isVerySmall: boolean;
  isSmall: boolean;
  isNarrow: boolean;
  sidePad: number;
  topGap: number;
  sectionGap: number;
  bottomPad: number;
  boardWidth: number;
  boardHeight: number;
  boardFont: number;
  heroSize: number;
  buttonsWidth: number;
  buttonHeight: number;
  buttonRadius: number;
  buttonFont: number;
  countFont: number;
};

const buildUi = (width: number, height: number): UiConfig => {
  const isVerySmall = height < 700;
  const isSmall = height < 780;
  const isNarrow = width < 360;

  const sidePad = isNarrow ? 16 : 20;
  const boardWidth = clamp(width * 0.76, 230, 560);

  return {
    isVerySmall,
    isSmall,
    isNarrow,
    sidePad,
    topGap: isVerySmall ? 6 : isSmall ? 10 : 14,
    sectionGap: isVerySmall ? 18 : isSmall ? 22 : 28,
    bottomPad: isVerySmall ? 96 : 112,
    boardWidth,
    boardHeight: isVerySmall ? 58 : isSmall ? 68 : 78,
    boardFont: isVerySmall ? 16 : isSmall ? 18 : 20,
    heroSize: isVerySmall ? 150 : isSmall ? 170 : 190,
    buttonsWidth: Math.min(width - sidePad * 2, 560),
    buttonHeight: isVerySmall ? 58 : isSmall ? 64 : 70,
    buttonRadius: isVerySmall ? 18 : 20,
    buttonFont: isVerySmall ? 15 : isSmall ? 17 : 18,
    countFont: isVerySmall ? 11 : 12,
  };
};

const SavedScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { savedTipIds = [], savedGuideIds = [] } = useSavedStore();

  const ui = useMemo(() => buildUi(width, height), [width, height]);

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
              paddingHorizontal: 54,
            },
          ]}
        >
          Saved
        </Text>
      </View>

      <View
        style={[
          styles.content,
          {
            paddingHorizontal: ui.sidePad,
            paddingTop: ui.sectionGap,
            paddingBottom: insets.bottom + ui.bottomPad,
            gap: ui.sectionGap,
          },
        ]}
      >
        <Image
          source={require('../../assets/images/ui/fish3_icon.png')}
          style={{
            width: ui.heroSize,
            height: ui.heroSize,
          }}
          resizeMode="contain"
        />

        <View
          style={[
            styles.buttons,
            {
              width: ui.buttonsWidth,
              gap: ui.sectionGap,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.btn,
              {
                minHeight: ui.buttonHeight,
                borderRadius: ui.buttonRadius,
              },
            ]}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('SavedFishingGuide')}
          >
            <View style={styles.btnRow}>
              <Text
                style={[
                  styles.btnText,
                  {
                    fontSize: ui.buttonFont,
                  },
                ]}
              >
                Saved Fishing Guide
              </Text>

              <View style={styles.countBadge}>
                <Text style={[styles.countBadgeText, { fontSize: ui.countFont }]}>
                  {savedGuideIds.length}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              {
                minHeight: ui.buttonHeight,
                borderRadius: ui.buttonRadius,
              },
            ]}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('SavedFishingTips')}
          >
            <View style={styles.btnRow}>
              <Text
                style={[
                  styles.btnText,
                  {
                    fontSize: ui.buttonFont,
                  },
                ]}
              >
                Saved Fishing Tips
              </Text>

              <View style={styles.countBadge}>
                <Text style={[styles.countBadgeText, { fontSize: ui.countFont }]}>
                  {savedTipIds.length}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
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

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttons: {},

  btn: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  btnText: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },

  countBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  countBadgeText: {
    color: Colors.white,
    fontWeight: '800',
  },
});

export default SavedScreen;