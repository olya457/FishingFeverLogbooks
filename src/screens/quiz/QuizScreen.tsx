import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../constants/colors';

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

type UiConfig = {
  isVerySmall: boolean;
  isSmall: boolean;
  isNarrow: boolean;
  sidePad: number;
  topGap: number;
  contentTopGap: number;
  bottomPad: number;
  boardWidth: number;
  boardHeight: number;
  boardFont: number;
  heroSize: number;
  contentGap: number;
  badgeFont: number;
  taglineFont: number;
  subtitleFont: number;
  subtitleLine: number;
  buttonHeight: number;
  buttonRadius: number;
  buttonPadH: number;
  buttonFont: number;
  secondaryHeight: number;
  secondaryFont: number;
};

const buildUi = (width: number, height: number): UiConfig => {
  const isVerySmall = height < 700;
  const isSmall = height < 780;
  const isNarrow = width < 360;

  return {
    isVerySmall,
    isSmall,
    isNarrow,
    sidePad: isNarrow ? 18 : 24,
    topGap: isVerySmall ? 6 : isSmall ? 10 : 14,
    contentTopGap: isVerySmall ? 14 : isSmall ? 18 : 24,
    bottomPad: isVerySmall ? 90 : 110,
    boardWidth: clamp(width * 0.78, 240, 560),
    boardHeight: isVerySmall ? 58 : isSmall ? 68 : 78,
    boardFont: isVerySmall ? 15 : isSmall ? 17 : 20,
    heroSize: isVerySmall ? 130 : isSmall ? 160 : 180,
    contentGap: isVerySmall ? 18 : isSmall ? 22 : 24,
    badgeFont: isVerySmall ? 11 : isSmall ? 12 : 13,
    taglineFont: isVerySmall ? 17 : isSmall ? 20 : 22,
    subtitleFont: isVerySmall ? 12 : isSmall ? 13 : 14,
    subtitleLine: isVerySmall ? 18 : isSmall ? 20 : 22,
    buttonHeight: isVerySmall ? 54 : isSmall ? 58 : 62,
    buttonRadius: isVerySmall ? 14 : 16,
    buttonPadH: isVerySmall ? 30 : isSmall ? 38 : 48,
    buttonFont: isVerySmall ? 15 : isSmall ? 16 : 18,
    secondaryHeight: isVerySmall ? 42 : isSmall ? 44 : 46,
    secondaryFont: isVerySmall ? 12 : 13,
  };
};

const QuizScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const ui = useMemo(() => buildUi(width, height), [width, height]);

  const heroScale = useRef(new Animated.Value(1)).current;
  const startScale = useRef(new Animated.Value(1)).current;

  const pulse = (value: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(value, {
        toValue: 0.95,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 110,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const handleStart = () => {
    pulse(startScale, () => navigation.navigate('QuizPlay', { level: 1 }));
  };

  const handlePressHero = () => {
    pulse(heroScale, () => {});
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
          Angler Quiz
        </Text>
      </View>

      <View
        style={[
          styles.content,
          {
            paddingHorizontal: ui.sidePad,
            paddingTop: ui.contentTopGap,
            paddingBottom: insets.bottom + ui.bottomPad,
            gap: ui.contentGap,
          },
        ]}
      >
        <View style={styles.badge}>
          <Text style={[styles.badgeText, { fontSize: ui.badgeFont }]}>
            10 Levels
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={handlePressHero}>
          <Animated.View style={{ transform: [{ scale: heroScale }] }}>
            <Image
              source={require('../../assets/images/ui/fish2_icon.png')}
              style={{
                width: ui.heroSize,
                height: ui.heroSize,
              }}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>

        <Text
          style={[
            styles.tagline,
            {
              fontSize: ui.taglineFont,
            },
          ]}
        >
          Ready to test your angler knowledge?
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontSize: ui.subtitleFont,
              lineHeight: ui.subtitleLine,
            },
          ]}
        >
          Complete levels, answer carefully, and see how far your fishing skills can take you.
        </Text>

        <Animated.View style={{ transform: [{ scale: startScale }] }}>
          <TouchableOpacity
            style={[
              styles.startBtn,
              {
                minHeight: ui.buttonHeight,
                borderRadius: ui.buttonRadius,
                paddingHorizontal: ui.buttonPadH,
              },
            ]}
            activeOpacity={0.88}
            onPress={handleStart}
          >
            <Text
              style={[
                styles.startBtnText,
                {
                  fontSize: ui.buttonFont,
                },
              ]}
            >
              Start the Quiz
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={[
            styles.secondaryBtn,
            {
              minHeight: ui.secondaryHeight,
              borderRadius: ui.buttonRadius,
            },
          ]}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('QuizPlay', { level: 1 })}
        >
          <Text
            style={[
              styles.secondaryBtnText,
              {
                fontSize: ui.secondaryFont,
              },
            ]}
          >
            Start from Level 1
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

  badge: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  badgeText: {
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },

  tagline: {
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    maxWidth: 520,
  },

  subtitle: {
    color: Colors.white,
    textAlign: 'center',
    maxWidth: 520,
  },

  startBtn: {
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  startBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  secondaryBtnText: {
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default QuizScreen;