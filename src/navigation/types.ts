export type RootStackParamList = {
  Loader: undefined;
  Onboarding: undefined;
  MainApp: undefined;
  LogbookAdd: undefined;
  LogbookEdit: { id: string };
  PlannerAdd: undefined;
  PlannerEdit: { id: string };
  QuizPlay: { level: number };
  LevelDone: { level: number };
  GameOver: undefined;
  SavedFishingGuide: undefined;
  SavedFishingTips: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Logbook: undefined;
  Planner: undefined;
  Guide: undefined;
  Saved: undefined;
  Quiz: undefined;
};