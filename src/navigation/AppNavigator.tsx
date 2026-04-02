import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import LoaderScreen from '../screens/loader/LoadersScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LogbookAddScreen from '../screens/logbook/LogbooksAddScreen';
import LogbookEditScreen from '../screens/logbook/LogbooksEditScreen';
import PlannerAddScreen from '../screens/planner/PlannersAddScreen';
import PlannerEditScreen from '../screens/planner/PlannersEditScreen';
import QuizPlayScreen from '../screens/quiz/QuizPlayScreen';
import LevelDoneScreen from '../screens/quiz/LevelDoneScreen';
import GameOverScreen from '../screens/quiz/GameOverScreen';
import SavedFishingGuide from '../screens/saved/SavedGuide';
import SavedFishingTips from '../screens/saved/SavedTips';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loader"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Loader" component={LoaderScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainApp" component={BottomTabNavigator} />
        <Stack.Screen name="LogbookAdd" component={LogbookAddScreen} />
        <Stack.Screen name="LogbookEdit" component={LogbookEditScreen} />
        <Stack.Screen name="PlannerAdd" component={PlannerAddScreen} />
        <Stack.Screen name="PlannerEdit" component={PlannerEditScreen} />
        <Stack.Screen name="QuizPlay" component={QuizPlayScreen} />
        <Stack.Screen name="LevelDone" component={LevelDoneScreen} />
        <Stack.Screen name="GameOver" component={GameOverScreen} />
        <Stack.Screen name="SavedFishingGuide" component={SavedFishingGuide} />
        <Stack.Screen name="SavedFishingTips" component={SavedFishingTips} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;