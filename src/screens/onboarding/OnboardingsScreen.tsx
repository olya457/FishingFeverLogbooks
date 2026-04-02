import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/types';
import { onboardingData } from '../../data/onboardingData';
import { Colors } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

const slideImages: Record<string, any> = {
  onboarding1: require('../../assets/images/onboarding/onboarding1.png'),
  onboarding2: require('../../assets/images/onboarding/onboarding2.png'),
  onboarding3: require('../../assets/images/onboarding/onboarding3.png'),
  onboarding4: require('../../assets/images/onboarding/onboarding4.png'),
  onboarding5: require('../../assets/images/onboarding/onboarding5.png'),
};

const OnboardingScreen = ({ navigation }: Props) => {
  const { width, height } = useWindowDimensions();

  const ui = useMemo(() => {
    const isVerySmall = height < 640;
    const isSmall = height < 700;
    const isMedium = height >= 700 && height < 800;

    return {
      isVerySmall,
      isSmall,
      isMedium,
      skipTop: isVerySmall ? 50 : isSmall ? 56 : isMedium ? 62 : 70,
      topPadding: isVerySmall ? 104 : isSmall ? 116 : isMedium ? 130 : 146,
      imageSize: clamp(width * (isVerySmall ? 0.46 : isSmall ? 0.5 : isMedium ? 0.56 : 0.62), 180, 360),
      contentMarginTop: isVerySmall ? 10 : isSmall ? 14 : isMedium ? 18 : 22,
      contentRadius: isVerySmall ? 16 : isSmall ? 18 : 20,
      contentPadH: isVerySmall ? 16 : isSmall ? 18 : 20,
      contentPadV: isVerySmall ? 10 : isSmall ? 12 : isMedium ? 14 : 16,
      titleFont: isVerySmall ? 16 : isSmall ? 17 : isMedium ? 19 : 22,
      titleGap: isVerySmall ? 5 : isSmall ? 6 : 8,
      descFont: isVerySmall ? 11 : isSmall ? 12 : 14,
      descLine: isVerySmall ? 16 : isSmall ? 18 : 20,
      footerBottom: isVerySmall ? 30 : isSmall ? 40 : isMedium ? 52 : 62,
      dotSize: isVerySmall ? 7 : 8,
      dotActiveW: isVerySmall ? 18 : 20,
      buttonPadH: isVerySmall ? 34 : isSmall ? 36 : 48,
      buttonPadV: isVerySmall ? 10 : isSmall ? 11 : 14,
      buttonRadius: isVerySmall ? 12 : 14,
      buttonFont: isVerySmall ? 13 : isSmall ? 14 : 16,
      skipFont: isVerySmall ? 12 : 14,
      navGap: isVerySmall ? 8 : 12,
      footerGap: isVerySmall ? 10 : 12,
      sidePad: isVerySmall ? 16 : 24,
    };
  }, [width, height]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(1)).current;
  const imageScale = useRef(new Animated.Value(1)).current;

  const slide = onboardingData[currentIndex];
  const isLast = currentIndex === onboardingData.length - 1;
  const canGoBack = currentIndex > 0;

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.spring(imageScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 70,
      }),
    ]).start(() => {
      setIsAnimating(false);
    });
  };

  const animateTransition = (direction: 'next' | 'prev', callback: () => void) => {
    if (isAnimating) return;

    setIsAnimating(true);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === 'next' ? -28 : 28,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 0.92,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 0.94,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(direction === 'next' ? 28 : -28);
      fadeAnim.setValue(0);
      textAnim.setValue(0.92);
      imageScale.setValue(0.94);
      animateIn();
    });
  };

  const goToMain = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    await AsyncStorage.setItem('onboarding_done', 'true');
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainApp' }],
    });
  };

  const handleNext = async () => {
    if (isAnimating) return;

    if (isLast) {
      await goToMain();
      return;
    }

    animateTransition('next', () => setCurrentIndex((i) => i + 1));
  };

  const handleBack = () => {
    if (!canGoBack || isAnimating) return;
    animateTransition('prev', () => setCurrentIndex((i) => i - 1));
  };

  const handleSkip = async () => {
    await goToMain();
  };

  return (
    <ImageBackground
      source={require('../../assets/images/backgrounds/loader_bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={[styles.skip, { top: ui.skipTop }]}
        onPress={handleSkip}
        activeOpacity={0.8}
        disabled={isAnimating}
      >
        <Text style={[styles.skipText, { fontSize: ui.skipFont }]}>Skip</Text>
      </TouchableOpacity>

      <View style={[styles.mainContent, { paddingTop: ui.topPadding, paddingHorizontal: ui.sidePad }]}>
        <Animated.View
          style={[
            styles.imageWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: imageScale }],
            },
          ]}
        >
          <Image
            source={slideImages[slide.image]}
            style={{ width: ui.imageSize, height: ui.imageSize }}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.contentBox,
            {
              marginTop: ui.contentMarginTop,
              borderRadius: ui.contentRadius,
              paddingHorizontal: ui.contentPadH,
              paddingVertical: ui.contentPadV,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: textAnim }],
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                fontSize: ui.titleFont,
                marginBottom: ui.titleGap,
              },
            ]}
          >
            {slide.title}
          </Text>

          <Text
            style={[
              styles.description,
              {
                fontSize: ui.descFont,
                lineHeight: ui.descLine,
              },
            ]}
          >
            {slide.description}
          </Text>
        </Animated.View>
      </View>

      <View style={[styles.footer, { bottom: ui.footerBottom, gap: ui.footerGap }]}>
        <View style={styles.dots}>
          {onboardingData.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: currentIndex === index ? ui.dotActiveW : ui.dotSize,
                  height: ui.dotSize,
                  borderRadius: ui.dotSize / 2,
                },
                currentIndex === index && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <View style={[styles.navRow, { gap: ui.navGap }]}>
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                paddingHorizontal: ui.buttonPadH - 8,
                paddingVertical: ui.buttonPadV,
                borderRadius: ui.buttonRadius,
                opacity: canGoBack ? 1 : 0,
              },
            ]}
            onPress={handleBack}
            activeOpacity={0.85}
            disabled={!canGoBack || isAnimating}
          >
            <Text style={[styles.secondaryButtonText, { fontSize: ui.buttonFont }]}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                paddingHorizontal: ui.buttonPadH,
                paddingVertical: ui.buttonPadV,
                borderRadius: ui.buttonRadius,
              },
            ]}
            onPress={handleNext}
            activeOpacity={0.85}
            disabled={isAnimating}
          >
            <Text style={[styles.buttonText, { fontSize: ui.buttonFont }]}>
              {slide.buttonLabel}
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
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  skip: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  skipText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentBox: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    color: Colors.white,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  secondaryButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;