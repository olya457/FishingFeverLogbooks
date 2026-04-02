import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ImageBackground,
  Image,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { TOTAL_LEVELS } from '../../data/quizQuestions';
import { Colors } from '../../constants/colors';

type RouteProps = RouteProp<RootStackParamList, 'LevelDone'>;

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
  titleHorizontalPad: number;
  exitFont: number;
  exitRight: number;
  cardWidth: number;
  cardRadius: number;
  cardPad: number;
  cardGap: number;
  titleFont: number;
  subtitleFont: number;
  subtitleLine: number;
  progressFont: number;
  progressPadH: number;
  progressPadV: number;
  actionsGap: number;
  iconBtnSize: number;
  iconSize: number;
  nextHeight: number;
  nextRadius: number;
  nextPadH: number;
  nextFont: number;
  secondaryHeight: number;
  secondaryFont: number;
};

const buildUi = (width: number, height: number): UiConfig => {
  const isVerySmall = height < 700;
  const isSmall = height < 780;
  const isNarrow = width < 360;

  const sidePad = isNarrow ? 16 : 20;
  const boardWidth = clamp(width * 0.78, 240, 560);

  return {
    isVerySmall,
    isSmall,
    isNarrow,
    sidePad,
    topGap: isVerySmall ? 6 : isSmall ? 10 : 14,
    contentTopGap: isVerySmall ? 14 : isSmall ? 18 : 24,
    bottomPad: isVerySmall ? 90 : 110,
    boardWidth,
    boardHeight: isVerySmall ? 58 : isSmall ? 68 : 78,
    boardFont: isVerySmall ? 15 : isSmall ? 17 : 20,
    titleHorizontalPad: isVerySmall ? 74 : isSmall ? 84 : 92,
    exitFont: isVerySmall ? 12 : 14,
    exitRight: isVerySmall ? 14 : 16,
    cardWidth: Math.min(width - sidePad * 2, 560),
    cardRadius: isVerySmall ? 18 : 20,
    cardPad: isVerySmall ? 22 : isSmall ? 26 : 32,
    cardGap: isVerySmall ? 14 : 16,
    titleFont: isVerySmall ? 22 : isSmall ? 25 : 28,
    subtitleFont: isVerySmall ? 12 : isSmall ? 13 : 14,
    subtitleLine: isVerySmall ? 18 : isSmall ? 20 : 22,
    progressFont: isVerySmall ? 11 : isSmall ? 12 : 13,
    progressPadH: isVerySmall ? 12 : 14,
    progressPadV: isVerySmall ? 6 : 7,
    actionsGap: isVerySmall ? 10 : 14,
    iconBtnSize: isVerySmall ? 42 : 46,
    iconSize: isVerySmall ? 18 : 20,
    nextHeight: isVerySmall ? 46 : isSmall ? 50 : 54,
    nextRadius: isVerySmall ? 12 : 14,
    nextPadH: isVerySmall ? 18 : isSmall ? 20 : 24,
    nextFont: isVerySmall ? 14 : isSmall ? 15 : 16,
    secondaryHeight: isVerySmall ? 40 : isSmall ? 44 : 46,
    secondaryFont: isVerySmall ? 12 : 13,
  };
};

const LevelDoneScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const ui = useMemo(() => buildUi(width, height), [width, height]);

  const { level } = route.params;
  const isLastLevel = level >= TOTAL_LEVELS;
  const progressPercent = Math.round((level / TOTAL_LEVELS) * 100);
  const [isProcessing, setIsProcessing] = useState(false);

  const shareScale = useRef(new Animated.Value(1)).current;
  const nextScale = useRef(new Animated.Value(1)).current;
  const homeScale = useRef(new Animated.Value(1)).current;

  const goToQuiz = () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    navigation.navigate('MainApp', { screen: 'Quiz' } as any);
  };

  const pulse = (value: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(value, {
        toValue: 0.94,
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

  const handleNext = () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    if (isLastLevel) {
      navigation.navigate('MainApp', { screen: 'Quiz' } as any);
      return;
    }

    navigation.replace('QuizPlay', { level: level + 1 });
  };

  const handleShare = async () => {
    if (isProcessing) {
      return;
    }

    await Share.share({
      message: `I completed Level ${level} of the Angler Quiz! 🎣`,
    });
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
              paddingHorizontal: ui.titleHorizontalPad,
            },
          ]}
        >
          Angler Quiz
        </Text>

        <TouchableOpacity
          style={[styles.exitBtn, { right: ui.exitRight }]}
          onPress={goToQuiz}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          disabled={isProcessing}
        >
          <Text style={[styles.exit, { fontSize: ui.exitFont }]}>Exit</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.content,
          {
            paddingHorizontal: ui.sidePad,
            paddingTop: ui.contentTopGap,
            paddingBottom: insets.bottom + ui.bottomPad,
          },
        ]}
      >
        <View
          style={[
            styles.card,
            {
              width: ui.cardWidth,
              borderRadius: ui.cardRadius,
              padding: ui.cardPad,
              gap: ui.cardGap,
            },
          ]}
        >
          <View style={styles.progressRow}>
            <View
              style={[
                styles.progressChip,
                {
                  paddingHorizontal: ui.progressPadH,
                  paddingVertical: ui.progressPadV,
                },
              ]}
            >
              <Text style={[styles.progressChipText, { fontSize: ui.progressFont }]}>
                Level {level} / {TOTAL_LEVELS}
              </Text>
            </View>

            <View
              style={[
                styles.progressChip,
                {
                  paddingHorizontal: ui.progressPadH,
                  paddingVertical: ui.progressPadV,
                },
              ]}
            >
              <Text style={[styles.progressChipText, { fontSize: ui.progressFont }]}>
                {progressPercent}%
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.title,
              {
                fontSize: ui.titleFont,
              },
            ]}
          >
            Level Complete!
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
            Great job! You answered the questions and completed this level.
          </Text>

          <View
            style={[
              styles.actions,
              {
                gap: ui.actionsGap,
                marginTop: ui.isVerySmall ? 4 : 8,
              },
            ]}
          >
            <Animated.View style={{ transform: [{ scale: shareScale }] }}>
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  {
                    width: ui.iconBtnSize,
                    height: ui.iconBtnSize,
                    borderRadius: ui.iconBtnSize / 2,
                  },
                ]}
                onPress={() => pulse(shareScale, handleShare)}
                activeOpacity={0.85}
                disabled={isProcessing}
              >
                <Text style={{ fontSize: ui.iconSize }}>📤</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ flex: 1, transform: [{ scale: nextScale }] }}>
              <TouchableOpacity
                style={[
                  styles.nextBtn,
                  {
                    minHeight: ui.nextHeight,
                    borderRadius: ui.nextRadius,
                    paddingHorizontal: ui.nextPadH,
                  },
                  isProcessing ? styles.disabledBtn : null,
                ]}
                onPress={() => pulse(nextScale, handleNext)}
                activeOpacity={0.88}
                disabled={isProcessing}
              >
                <Text
                  style={[
                    styles.nextBtnText,
                    {
                      fontSize: ui.nextFont,
                    },
                  ]}
                >
                  {isLastLevel ? 'Finish' : 'Next level'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: homeScale }] }}>
              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  {
                    width: ui.iconBtnSize,
                    height: ui.iconBtnSize,
                    borderRadius: ui.iconBtnSize / 2,
                  },
                ]}
                onPress={() => pulse(homeScale, goToQuiz)}
                activeOpacity={0.85}
                disabled={isProcessing}
              >
                <Text style={{ fontSize: ui.iconSize }}>🏠</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <TouchableOpacity
            style={[
              styles.secondaryBtn,
              {
                minHeight: ui.secondaryHeight,
                borderRadius: ui.nextRadius,
              },
              isProcessing ? styles.disabledBtn : null,
            ]}
            onPress={goToQuiz}
            activeOpacity={0.88}
            disabled={isProcessing}
          >
            <Text
              style={[
                styles.secondaryBtnText,
                {
                  fontSize: ui.secondaryFont,
                },
              ]}
            >
              Back to Quiz Menu
            </Text>
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

  exitBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -12,
  },

  exit: {
    color: Colors.white,
    fontWeight: '700',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  progressRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  progressChip: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 999,
  },

  progressChipText: {
    color: Colors.text,
    fontWeight: '700',
  },

  title: {
    fontWeight: 'bold',
    color: Colors.green,
    textAlign: 'center',
  },

  subtitle: {
    color: Colors.text,
    textAlign: 'center',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconBtn: {
    backgroundColor: 'rgba(0,0,0,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextBtn: {
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  nextBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
  },

  secondaryBtn: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryBtnText: {
    color: Colors.text,
    fontWeight: '700',
  },

  disabledBtn: {
    opacity: 0.55,
  },
});

export default LevelDoneScreen;