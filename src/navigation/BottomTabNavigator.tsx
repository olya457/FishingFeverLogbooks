import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  ImageStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabParamList } from './types';

import HomeScreen from '../screens/home/HomesScreen';
import LogbookScreen from '../screens/logbook/LogbooksScreen';
import PlannerScreen from '../screens/planner/PlannersScreen';
import FishingGuideScreen from '../screens/guide/GuideScreen';
import SavedScreen from '../screens/saved/SavedScreen';
import QuizScreen from '../screens/quiz/QuizScreen';

const { height } = Dimensions.get('window');
const isSmall = height < 700;

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BOTTOM_OFFSET = Platform.OS === 'android' ? 20 : 20;
const TAB_HEIGHT = isSmall ? 54 : 62;
const ICON_SIZE = isSmall ? 22 : 26;

const icons: Record<keyof BottomTabParamList, any> = {
  Home: require('../assets/images/icons/icon_home.png'),
  Logbook: require('../assets/images/icons/icon_logbook.png'),
  Planner: require('../assets/images/icons/icon_planner.png'),
  Guide: require('../assets/images/icons/icon_guide.png'),
  Saved: require('../assets/images/icons/icon_saved.png'),
  Quiz: require('../assets/images/icons/icon_quiz.png'),
};

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: BOTTOM_OFFSET + insets.bottom,
          left: 16,
          right: 16,
          height: TAB_HEIGHT,
          borderRadius: TAB_HEIGHT / 2,
          backgroundColor: '#FF8C00',
          borderTopWidth: 0,
          borderWidth: 3,
          borderColor: 'rgba(255,255,255,0.5)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 14,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarIcon: ({ focused }) => {
          const iconSource = icons[route.name as keyof BottomTabParamList];
          return (
            <View style={[styles.iconWrapper, { height: TAB_HEIGHT, paddingTop: 10 }]}>
              <Image
                source={iconSource}
                style={[
                  {
                    width: ICON_SIZE,
                    height: ICON_SIZE,
                    tintColor: focused ? '#1A1A1A' : 'rgba(255,255,255,0.65)',
                  } as ImageStyle,
                ]}
                resizeMode="contain"
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Logbook" component={LogbookScreen} />
      <Tab.Screen name="Planner" component={PlannerScreen} />
      <Tab.Screen name="Guide" component={FishingGuideScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Quiz" component={QuizScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#1A1A1A',
  },
});

export default BottomTabNavigator;