import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Loader'>;

const { width, height } = Dimensions.get('window');
const isSmall = height < 700;

const LOADER_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: 100%;
    height: 100%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loader {
    --background: linear-gradient(135deg, #23C4F8, #275EFE);
    --shadow: rgba(39, 94, 254, 0.28);
    --text: #6C7486;
    --page: rgba(255, 255, 255, 0.36);
    --page-fold: rgba(255, 255, 255, 0.52);
    --duration: 3s;
    width: 200px;
    height: 140px;
    position: relative;
  }
  .loader:before, .loader:after {
    --r: -6deg;
    content: "";
    position: absolute;
    bottom: 8px;
    width: 120px;
    top: 80%;
    box-shadow: 0 16px 12px var(--shadow);
    transform: rotate(var(--r));
  }
  .loader:before { left: 4px; }
  .loader:after { --r: 6deg; right: 4px; }
  .loader div {
    width: 100%;
    height: 100%;
    border-radius: 13px;
    position: relative;
    z-index: 1;
    perspective: 600px;
    box-shadow: 0 4px 6px var(--shadow);
    background-image: var(--background);
  }
  .loader div ul {
    margin: 0;
    padding: 0;
    list-style: none;
    position: relative;
  }
  .loader div ul li {
    --r: 180deg;
    --o: 0;
    --c: var(--page);
    position: absolute;
    top: 10px;
    left: 10px;
    transform-origin: 100% 50%;
    color: var(--c);
    opacity: var(--o);
    transform: rotateY(var(--r));
    animation: var(--duration) ease infinite;
  }
  .loader div ul li:nth-child(2) { --c: var(--page-fold); animation-name: page-2; }
  .loader div ul li:nth-child(3) { --c: var(--page-fold); animation-name: page-3; }
  .loader div ul li:nth-child(4) { --c: var(--page-fold); animation-name: page-4; }
  .loader div ul li:nth-child(5) { --c: var(--page-fold); animation-name: page-5; }
  .loader div ul li svg { width: 90px; height: 120px; display: block; }
  .loader div ul li:first-child { --r: 0deg; --o: 1; }
  .loader div ul li:last-child { --o: 1; }
  .loader span {
    display: block;
    left: 0;
    right: 0;
    top: 100%;
    margin-top: 20px;
    text-align: center;
    color: var(--text);
    font-family: sans-serif;
    font-size: 14px;
  }
  @keyframes page-2 {
    0% { transform: rotateY(180deg); opacity: 0; }
    20% { opacity: 1; }
    35%, 100% { opacity: 0; }
    50%, 100% { transform: rotateY(0deg); }
  }
  @keyframes page-3 {
    15% { transform: rotateY(180deg); opacity: 0; }
    35% { opacity: 1; }
    50%, 100% { opacity: 0; }
    65%, 100% { transform: rotateY(0deg); }
  }
  @keyframes page-4 {
    30% { transform: rotateY(180deg); opacity: 0; }
    50% { opacity: 1; }
    65%, 100% { opacity: 0; }
    80%, 100% { transform: rotateY(0deg); }
  }
  @keyframes page-5 {
    45% { transform: rotateY(180deg); opacity: 0; }
    65% { opacity: 1; }
    80%, 100% { opacity: 0; }
    95%, 100% { transform: rotateY(0deg); }
  }
</style>
</head>
<body>
  <div class="loader">
    <div>
      <ul>
        <li><svg viewBox="0 0 90 120" fill="currentColor"><path d="M90 0H0v120h90V0zM86 116H4V4h82v112z"/></svg></li>
        <li><svg viewBox="0 0 90 120" fill="currentColor"><path d="M90 0H0v120h90V0zM86 116H4V4h82v112z"/></svg></li>
        <li><svg viewBox="0 0 90 120" fill="currentColor"><path d="M90 0H0v120h90V0zM86 116H4V4h82v112z"/></svg></li>
        <li><svg viewBox="0 0 90 120" fill="currentColor"><path d="M90 0H0v120h90V0zM86 116H4V4h82v112z"/></svg></li>
        <li><svg viewBox="0 0 90 120" fill="currentColor"><path d="M90 0H0v120h90V0zM86 116H4V4h82v112z"/></svg></li>
      </ul>
    </div>
    <span>Loading...</span>
  </div>
</body>
</html>
`;

const LoaderScreen = ({ navigation }: Props) => {
  useEffect(() => {
    const init = async () => {
      try {
        await AsyncStorage.removeItem('onboarding_done');

        const seen = await AsyncStorage.getItem('onboarding_done');
        const isOnboardingDone = seen === 'true';

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: isOnboardingDone ? 'MainApp' : 'Onboarding',
              },
            ],
          });
        }, 5000);
      } catch {
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
          });
        }, 5000);
      }
    };

    init();
  }, []);

  const webViewHeight = isSmall ? 160 : 200;
  const logoSize = isSmall ? width * 0.5 : width * 0.6;

  return (
    <ImageBackground
      source={require('../../assets/images/backgrounds/loader_bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.logoWrapper}>
        <Image
          source={require('../../assets/images/ui/loader_logo.png')}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.webViewWrapper, { height: webViewHeight }]}>
        <WebView
          source={{ html: LOADER_HTML }}
          style={styles.webView}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          backgroundColor="transparent"
          androidLayerType="software"
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webViewWrapper: {
    width: width,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webView: {
    width: 280,
    backgroundColor: 'transparent',
  },
});

export default LoaderScreen;