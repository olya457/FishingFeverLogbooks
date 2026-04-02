export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonLabel: string;
}

export const onboardingData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Fishing starts with a good log',
    description: 'Track every catch, save your best moments, and build your personal fishing history.',
    image: 'onboarding1',
    buttonLabel: 'Continue',
  },
  {
    id: '2',
    title: 'Record every catch',
    description: 'Add photos, location, date, and notes to keep your fishing results organized.',
    image: 'onboarding2',
    buttonLabel: 'Next',
  },
  {
    id: '3',
    title: 'Never miss a trip',
    description: 'Plan fishing days ahead and get timely reminders before you go.',
    image: 'onboarding3',
    buttonLabel: 'Next',
  },
  {
    id: '4',
    title: 'Test your angler knowledge',
    description: 'Challenge yourself with fishing questions and see how well you know the world of angling. Complete levels and improve your fishing knowledge.',
    image: 'onboarding4',
    buttonLabel: 'Next',
  },
  {
    id: '5',
    title: 'Fish smarter every time',
    description: 'Discover tips, avoid common mistakes, and improve your fishing skills.',
    image: 'onboarding5',
    buttonLabel: 'Get Started',
  },
];