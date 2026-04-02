import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { getQuestionsByLevel } from '../../data/quizQuestions';
import { Answer } from '../../types/quiz';
import { Colors } from '../../constants/colors';

type RouteProps = RouteProp<RootStackParamList, 'QuizPlay'>;

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
  sectionGap: number;
  boardWidth: number;
  boardHeight: number;
  boardFont: number;
  titleHorizontalPad: number;
  exitFont: number;
  exitRight: number;
  cardRadius: number;
  questionPad: number;
  questionFont: number;
  questionLine: number;
  levelFont: number;
  helperFont: number;
  answerRadius: number;
  answerMinHeight: number;
  answerFont: number;
  progressGap: number;
  progressSize: number;
  progressActiveW: number;
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
    contentTopGap: isVerySmall ? 10 : 14,
    bottomPad: isVerySmall ? 90 : 110,
    sectionGap: isVerySmall ? 8 : 10,
    boardWidth: clamp(width * 0.78, 240, 560),
    boardHeight: isVerySmall ? 58 : isSmall ? 68 : 78,
    boardFont: isVerySmall ? 15 : isSmall ? 17 : 20,
    titleHorizontalPad: isVerySmall ? 74 : isSmall ? 84 : 92,
    exitFont: isVerySmall ? 12 : 14,
    exitRight: isVerySmall ? 14 : 16,
    cardRadius: isVerySmall ? 18 : 20,
    questionPad: isVerySmall ? 18 : isSmall ? 22 : 24,
    questionFont: isVerySmall ? 14 : isSmall ? 16 : 18,
    questionLine: isVerySmall ? 20 : isSmall ? 23 : 26,
    levelFont: isVerySmall ? 11 : isSmall ? 12 : 13,
    helperFont: isVerySmall ? 11 : isSmall ? 12 : 13,
    answerRadius: isVerySmall ? 12 : 14,
    answerMinHeight: isVerySmall ? 52 : isSmall ? 58 : 64,
    answerFont: isVerySmall ? 13 : isSmall ? 14 : 15,
    progressGap: isVerySmall ? 6 : 8,
    progressSize: isVerySmall ? 9 : 10,
    progressActiveW: isVerySmall ? 20 : 22,
  };
};

const QuizPlayScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const ui = useMemo(() => buildUi(width, height), [width, height]);

  const { level } = route.params;
  const questions = useMemo(() => getQuestionsByLevel(level), [level]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hasWrong, setHasWrong] = useState(false);
  const [locked, setLocked] = useState(false);

  const question = questions[currentIndex];
  const progress = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(12);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex, fadeAnim, slideAnim]);

  const goToQuiz = () => {
    if (locked) {
      return;
    }

    navigation.navigate('MainApp', { screen: 'Quiz' } as any);
  };

  const finishQuiz = (wasCorrect: boolean) => {
    const finalHasWrong = hasWrong || !wasCorrect;

    if (!finalHasWrong) {
      navigation.replace('LevelDone', { level });
      return;
    }

    navigation.replace('GameOver');
  };

  const handleAnswer = (index: number) => {
    if (selected !== null || locked) {
      return;
    }

    setLocked(true);
    setSelected(index);

    const isCorrect = question.answers[index].isCorrect;

    if (!isCorrect) {
      setHasWrong(true);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelected(null);
        setLocked(false);
      } else {
        finishQuiz(isCorrect);
      }
    }, 850);
  };

  const getAnswerStyle = (index: number) => {
    if (selected === null) {
      return styles.answerBtn;
    }

    if (index === selected) {
      return question.answers[index].isCorrect
        ? [styles.answerBtn, styles.correct]
        : [styles.answerBtn, styles.wrong];
    }

    if (question.answers[index].isCorrect) {
      return [styles.answerBtn, styles.correct];
    }

    return styles.answerBtn;
  };

  const getAnswerTextStyle = (index: number) => {
    if (selected === null) {
      return styles.answerText;
    }

    if (index === selected || question.answers[index].isCorrect) {
      return [styles.answerText, styles.answerTextActive];
    }

    return styles.answerText;
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
          disabled={locked}
        >
          <Text style={[styles.exit, { fontSize: ui.exitFont }]}>Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: ui.sidePad,
          paddingTop: ui.contentTopGap,
          paddingBottom: insets.bottom + ui.bottomPad,
          gap: ui.sectionGap,
        }}
      >
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Text style={[styles.metaChipText, { fontSize: ui.levelFont }]}>
              Level {level}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={[styles.metaChipText, { fontSize: ui.levelFont }]}>
              Question {currentIndex + 1}/{questions.length}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={[styles.metaChipText, { fontSize: ui.levelFont }]}>
              {progress}%
            </Text>
          </View>
        </View>

        <Animated.View
          style={[
            styles.questionCard,
            {
              marginTop: ui.sectionGap,
              borderRadius: ui.cardRadius,
              padding: ui.questionPad,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text
            style={[
              styles.questionText,
              {
                fontSize: ui.questionFont,
                lineHeight: ui.questionLine,
              },
            ]}
          >
            {question.text}
          </Text>
        </Animated.View>

        <Text style={[styles.helperText, { fontSize: ui.helperFont }]}>
          Choose one answer
        </Text>

        <View style={[styles.answers, { gap: ui.sectionGap }]}>
          {question.answers.map((answer: Answer, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                getAnswerStyle(index),
                {
                  minHeight: ui.answerMinHeight,
                  borderRadius: ui.answerRadius,
                  paddingHorizontal: 14,
                  paddingVertical: ui.isVerySmall ? 10 : 12,
                },
              ]}
              onPress={() => handleAnswer(index)}
              activeOpacity={0.88}
              disabled={selected !== null}
            >
              <Text
                style={[
                  getAnswerTextStyle(index),
                  {
                    fontSize: ui.answerFont,
                  },
                ]}
              >
                {answer.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={[
            styles.progress,
            {
              gap: ui.progressGap,
              marginTop: ui.isVerySmall ? 6 : 8,
            },
          ]}
        >
          {questions.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  width: ui.progressSize,
                  height: ui.progressSize,
                  borderRadius: ui.progressSize / 2,
                },
                i < currentIndex ? styles.progressDotDone : null,
                i === currentIndex
                  ? [
                      styles.progressDotActive,
                      {
                        width: ui.progressActiveW,
                        borderRadius: ui.progressSize / 2,
                      },
                    ]
                  : null,
              ]}
            />
          ))}
        </View>
      </ScrollView>
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

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },

  metaChip: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  metaChipText: {
    color: Colors.white,
    fontWeight: '700',
  },

  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  questionText: {
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },

  helperText: {
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontWeight: '600',
  },

  answers: {},

  answerBtn: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  correct: {
    backgroundColor: Colors.green,
  },

  wrong: {
    backgroundColor: Colors.red,
  },

  answerText: {
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },

  answerTextActive: {
    fontWeight: '800',
  },

  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressDot: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  progressDotDone: {
    backgroundColor: Colors.green,
  },

  progressDotActive: {
    backgroundColor: Colors.white,
  },
});

export default QuizPlayScreen;