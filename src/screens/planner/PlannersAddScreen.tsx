import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  Modal,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlannerStore } from '../../store/plannerStore';
import { Colors } from '../../constants/colors';

type Step = 'name' | 'notes';
type StatusTab = 'upcoming' | 'today' | 'completed';
type FocusField = 'location' | 'notes';

const TAB_COLORS: Record<StatusTab, string> = {
  upcoming: '#4A90D9',
  today: '#4CAF50',
  completed: '#E53935',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const KB_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
  ['123', 'space', '.', '↵'],
];

const NUM_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', '.', ',', '?', '!'],
  ['ABC', 'space', '⌫', '↵'],
];

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

type UiConfig = {
  isVerySmall: boolean;
  isSmall: boolean;
  isNarrow: boolean;
  sidePad: number;
  topGap: number;
  sectionGap: number;
  contentBottomPad: number;
  boardWidth: number;
  boardHeight: number;
  boardFont: number;
  exitFont: number;
  cardWidth: number;
  cardRadius: number;
  cardPad: number;
  pillFont: number;
  labelFont: number;
  tabFont: number;
  fieldHeight: number;
  notesHeight: number;
  fieldFont: number;
  iconSize: number;
  buttonHeight: number;
  arrowWidth: number;
  keyGap: number;
  keyHeight: number;
  keyFont: number;
  calendarWidth: number;
  helperFont: number;
  clearBtnFont: number;
};

const buildUi = (width: number, height: number): UiConfig => {
  const isVerySmall = height < 700;
  const isSmall = height < 780;
  const isNarrow = width < 360;

  const sidePad = isNarrow ? 14 : 16;
  const cardWidth = Math.min(width - sidePad * 2, 600);
  const boardWidth = clamp(width * 0.76, 230, 560);

  return {
    isVerySmall,
    isSmall,
    isNarrow,
    sidePad,
    topGap: isVerySmall ? 6 : isSmall ? 10 : 14,
    sectionGap: isVerySmall ? 8 : isSmall ? 10 : 14,
    contentBottomPad: isVerySmall ? 18 : 24,
    boardWidth,
    boardHeight: isVerySmall ? 58 : isSmall ? 68 : 78,
    boardFont: isVerySmall ? 16 : isSmall ? 18 : 20,
    exitFont: isVerySmall ? 12 : isSmall ? 13 : 14,
    cardWidth,
    cardRadius: isVerySmall ? 16 : isSmall ? 20 : 22,
    cardPad: isVerySmall ? 10 : isSmall ? 12 : 14,
    pillFont: isVerySmall ? 13 : isSmall ? 14 : 16,
    labelFont: isVerySmall ? 11 : isSmall ? 12 : 14,
    tabFont: isVerySmall ? 10 : isSmall ? 11 : 12,
    fieldHeight: isVerySmall ? 40 : isSmall ? 44 : 48,
    notesHeight: isVerySmall ? 72 : isSmall ? 86 : 98,
    fieldFont: isVerySmall ? 12 : isSmall ? 13 : 15,
    iconSize: isVerySmall ? 14 : isSmall ? 15 : 17,
    buttonHeight: isVerySmall ? 42 : isSmall ? 46 : 52,
    arrowWidth: isVerySmall ? 42 : isSmall ? 46 : 48,
    keyGap: isVerySmall ? 4 : 5,
    keyHeight: isVerySmall ? 32 : isSmall ? 36 : 40,
    keyFont: isVerySmall ? 13 : isSmall ? 14 : 16,
    calendarWidth: Math.min(width - 24, 400),
    helperFont: isVerySmall ? 10 : isSmall ? 11 : 12,
    clearBtnFont: isVerySmall ? 11 : isSmall ? 12 : 13,
  };
};

const SimpleKeyboard = ({
  value,
  onChange,
  onNext,
  initUpper = false,
  ui,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext?: () => void;
  initUpper?: boolean;
  ui: UiConfig;
}) => {
  const [upper, setUpper] = useState(initUpper);
  const [numMode, setNumMode] = useState(false);

  const rows = numMode ? NUM_ROWS : KB_ROWS;

  const handleKey = (key: string) => {
    if (key === '⌫') {
      onChange(value.slice(0, -1));
      return;
    }

    if (key === 'space') {
      onChange(value + ' ');
      return;
    }

    if (key === '⇧') {
      setUpper(prev => !prev);
      return;
    }

    if (key === '123') {
      setNumMode(true);
      return;
    }

    if (key === 'ABC') {
      setNumMode(false);
      return;
    }

    if (key === '↵') {
      onNext?.();
      return;
    }

    const char = !numMode && upper ? key.toUpperCase() : key;
    onChange(value + char);

    if (upper && !numMode) {
      setUpper(false);
    }
  };

  return (
    <View style={{ gap: ui.keyGap }}>
      {rows.map((row, rIdx) => (
        <View key={rIdx} style={[styles.keyRow, { gap: ui.keyGap }]}>
          {row.map(key => {
            const isSpecial = ['⇧', '⌫', '123', 'ABC', 'space', '↵'].includes(key);
            const isSpace = key === 'space';
            const isEnter = key === '↵';

            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.7}
                onPress={() => handleKey(key)}
                style={[
                  styles.key,
                  { height: ui.keyHeight },
                  isSpace ? { flex: 3 } : null,
                  isEnter ? { flex: 1.2 } : null,
                  isSpecial && !isSpace ? styles.keySpecial : null,
                ]}
              >
                <Text style={[styles.keyText, { fontSize: ui.keyFont }]}>
                  {key === 'space'
                    ? '·'
                    : key === '↵'
                      ? 'next'
                      : !numMode && upper && !isSpecial
                        ? key.toUpperCase()
                        : key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const PlannerAddScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { addTrip } = usePlannerStore();
  const { width, height } = useWindowDimensions();

  const ui = useMemo(() => buildUi(width, height), [width, height]);

  const [step, setStep] = useState<Step>('name');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [remindMe, setRemindMe] = useState(false);
  const [status, setStatus] = useState<StatusTab>('today');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [focusField, setFocusField] = useState<FocusField>('location');

  const today = new Date();

  const formatDate = (date: Date) =>
    `${String(date.getDate()).padStart(2, '0')}.${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}.${date.getFullYear()}`;

  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDay = (month: number, year: number) =>
    new Date(year, month, 1).getDay();

  const currentMonthLabel = `${MONTHS[calMonth]} ${calYear}`;
  const canContinueName = location.trim().length > 0;
  const canSave = location.trim().length > 0;
  const dateLabel = selectedDate ? formatDate(selectedDate) : 'Date';

  const handleSave = () => {
    if (!location.trim()) {
      return;
    }

    addTrip({
      id: Date.now().toString(),
      name: location.trim(),
      location: location.trim(),
      date: selectedDate ? formatDate(selectedDate) : '',
      notes: notes.trim(),
      remindMe,
      status,
    });

    navigation.goBack();
  };

  const handleKeyboardChange = (nextValue: string) => {
    if (focusField === 'location') {
      setLocation(nextValue);
      return;
    }

    setNotes(nextValue);
  };

  const handleClearField = () => {
    if (focusField === 'location') {
      setLocation('');
      return;
    }

    setNotes('');
  };

  const handleKeyboardNext = () => {
    if (step === 'name') {
      if (canContinueName) {
        setStep('notes');
        setFocusField('notes');
      }
      return;
    }

    handleSave();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(calMonth, calYear);
    const firstDay = getFirstDay(calMonth, calYear);
    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      cells.push(i);
    }

    return (
      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCalendarVisible(false)}
        >
          <Pressable
            onPress={() => {}}
            style={[
              styles.calendarBox,
              {
                width: ui.calendarWidth,
              },
            ]}
          >
            <View style={styles.calHeader}>
              <TouchableOpacity
                onPress={() => {
                  if (calMonth === 0) {
                    setCalMonth(11);
                    setCalYear(prev => prev - 1);
                  } else {
                    setCalMonth(prev => prev - 1);
                  }
                }}
              >
                <Text style={styles.calArrow}>‹</Text>
              </TouchableOpacity>

              <Text style={styles.calTitle}>{currentMonthLabel}</Text>

              <TouchableOpacity
                onPress={() => {
                  if (calMonth === 11) {
                    setCalMonth(0);
                    setCalYear(prev => prev + 1);
                  } else {
                    setCalMonth(prev => prev + 1);
                  }
                }}
              >
                <Text style={styles.calArrow}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calDaysRow}>
              {DAYS.map(day => (
                <Text key={day} style={styles.calDayName}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calGrid}>
              {cells.map((day, idx) => {
                const isSelected =
                  day !== null &&
                  selectedDate?.getDate() === day &&
                  selectedDate?.getMonth() === calMonth &&
                  selectedDate?.getFullYear() === calYear;

                const isToday =
                  day === today.getDate() &&
                  calMonth === today.getMonth() &&
                  calYear === today.getFullYear();

                return (
                  <TouchableOpacity
                    key={idx}
                    disabled={!day}
                    onPress={() => {
                      if (!day) {
                        return;
                      }

                      setSelectedDate(new Date(calYear, calMonth, day));
                      setCalendarVisible(false);
                    }}
                    style={[
                      styles.calCell,
                      isSelected ? styles.calCellSelected : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.calCellText,
                        isToday ? styles.calCellToday : null,
                        isSelected ? styles.calCellSelectedText : null,
                      ]}
                    >
                      {day ?? ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
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
          Trip Planner
        </Text>

        <TouchableOpacity
          style={styles.exitBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.exitTxt, { fontSize: ui.exitFont }]}>Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: ui.sidePad,
          paddingTop: ui.sectionGap,
          paddingBottom: insets.bottom + ui.contentBottomPad,
          flexGrow: 1,
        }}
      >
        <View
          style={[
            styles.card,
            {
              width: ui.cardWidth,
              borderRadius: ui.cardRadius,
              padding: ui.cardPad,
              gap: ui.sectionGap,
              alignSelf: 'center',
            },
          ]}
        >
          <View style={styles.topMetaRow}>
            <TouchableOpacity activeOpacity={1} style={styles.locationPill}>
              <Text
                numberOfLines={1}
                style={[
                  styles.locationText,
                  { fontSize: ui.pillFont },
                  !location ? styles.placeholder : null,
                ]}
              >
                {location || 'Welcome aboard!'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleClearField} activeOpacity={0.85}>
              <Text style={[styles.clearBtnText, { fontSize: ui.clearBtnFont }]}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>

          {step === 'name' ? (
            <>
              <Text style={[styles.sectionLabel, { fontSize: ui.labelFont }]}>
                Status:
              </Text>

              <View style={styles.tabs}>
                {(['upcoming', 'today', 'completed'] as StatusTab[]).map(tab => (
                  <TouchableOpacity
                    key={tab}
                    activeOpacity={0.85}
                    style={[
                      styles.tab,
                      status === tab ? { backgroundColor: TAB_COLORS[tab] } : null,
                    ]}
                    onPress={() => setStatus(tab)}
                  >
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={[
                        styles.tabText,
                        { fontSize: ui.tabFont },
                        status === tab ? styles.tabTextActive : null,
                      ]}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.inputRow, { minHeight: ui.fieldHeight }]}
                onPress={() => setFocusField('location')}
              >
                <Text style={{ fontSize: ui.iconSize }}>📍</Text>
                <View
                  style={[
                    styles.inputField,
                    styles.inputFieldSelectable,
                    { flex: 1, minHeight: ui.fieldHeight },
                    focusField === 'location' ? styles.inputFieldActive : null,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.inputText,
                      { fontSize: ui.fieldFont },
                      !location ? styles.placeholder : null,
                    ]}
                  >
                    {location || 'Location'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.inputRow, { minHeight: ui.fieldHeight }]}
                onPress={() => setCalendarVisible(true)}
              >
                <Text style={{ fontSize: ui.iconSize }}>📅</Text>
                <View
                  style={[
                    styles.inputField,
                    { flex: 1, minHeight: ui.fieldHeight },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.inputText,
                      { fontSize: ui.fieldFont },
                      !selectedDate ? styles.placeholder : null,
                    ]}
                  >
                    {dateLabel}
                  </Text>
                </View>
              </TouchableOpacity>

              <Text style={[styles.helperText, { fontSize: ui.helperFont }]}>
                Add a place and choose a date for your trip.
              </Text>

              <SimpleKeyboard
                value={location}
                onChange={handleKeyboardChange}
                onNext={handleKeyboardNext}
                initUpper
                ui={ui}
              />

              <View style={styles.navRow}>
                <TouchableOpacity
                  style={[
                    styles.arrowBtn,
                    {
                      width: ui.arrowWidth,
                      height: ui.buttonHeight,
                      marginRight: 8,
                    },
                  ]}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={{ fontSize: ui.iconSize + 2 }}>←</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.continueBtn,
                    {
                      height: ui.buttonHeight,
                    },
                    !canContinueName ? styles.continueBtnDisabled : null,
                  ]}
                  onPress={() => {
                    if (!canContinueName) {
                      return;
                    }

                    setStep('notes');
                    setFocusField('notes');
                  }}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[
                      styles.continueBtnText,
                      { fontSize: ui.fieldFont + 2 },
                    ]}
                  >
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.sectionLabel, { fontSize: ui.labelFont }]}>
                Welcome to your fishing companion.
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.inputField,
                  styles.inputFieldSelectable,
                  {
                    minHeight: ui.notesHeight,
                    justifyContent: 'flex-start',
                    paddingTop: 10,
                  },
                  focusField === 'notes' ? styles.inputFieldActive : null,
                ]}
                onPress={() => setFocusField('notes')}
              >
                <Text
                  style={[
                    styles.inputText,
                    { fontSize: ui.fieldFont },
                    !notes ? styles.placeholder : null,
                  ]}
                >
                  {notes || 'Notes (optional)...'}
                </Text>
              </TouchableOpacity>

              <View style={[styles.remindRow, { minHeight: ui.fieldHeight }]}>
                <Text style={{ fontSize: ui.iconSize }}>🔔</Text>

                <Text
                  style={[styles.remindLabel, { fontSize: ui.fieldFont }]}
                >
                  Remind Me
                </Text>

                <TouchableOpacity
                  style={[
                    styles.remindToggle,
                    remindMe ? styles.remindToggleOn : null,
                  ]}
                  onPress={() => setRemindMe(prev => !prev)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.remindToggleText,
                      { fontSize: ui.tabFont },
                    ]}
                  >
                    {remindMe ? 'Yes' : 'No'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.helperText, { fontSize: ui.helperFont }]}>
                Add notes or leave this step empty.
              </Text>

              <SimpleKeyboard
                value={notes}
                onChange={handleKeyboardChange}
                onNext={handleKeyboardNext}
                ui={ui}
              />

              <View style={styles.navRow}>
                <TouchableOpacity
                  style={[
                    styles.arrowBtn,
                    {
                      width: ui.arrowWidth,
                      height: ui.buttonHeight,
                      marginRight: 8,
                    },
                  ]}
                  onPress={() => {
                    setStep('name');
                    setFocusField('location');
                  }}
                >
                  <Text style={{ fontSize: ui.iconSize + 2 }}>←</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.continueBtn,
                    {
                      height: ui.buttonHeight,
                    },
                    !canSave ? styles.continueBtnDisabled : null,
                  ]}
                  onPress={handleSave}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[
                      styles.continueBtnText,
                      { fontSize: ui.fieldFont + 2 },
                    ]}
                  >
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {renderCalendar()}
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
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  exitBtn: {
    position: 'absolute',
    right: 14,
    top: '50%',
    marginTop: -12,
  },

  exitTxt: {
    color: '#fff',
    fontWeight: '700',
  },

  card: {
    backgroundColor: 'rgba(245,235,215,0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },

  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  locationPill: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 7,
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: '92%',
    flex: 1,
  },

  locationText: {
    color: Colors.text,
    fontWeight: '600',
  },

  placeholder: {
    color: '#aaa',
  },

  clearBtnText: {
    color: Colors.primary,
    fontWeight: '700',
  },

  sectionLabel: {
    color: '#555',
    fontWeight: '600',
  },

  helperText: {
    color: '#7a7a7a',
    fontWeight: '500',
  },

  tabs: {
    flexDirection: 'row',
    gap: 6,
  },

  tab: {
    flex: 1,
    minHeight: 38,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabText: {
    color: '#555',
    fontWeight: '600',
  },

  tabTextActive: {
    color: '#fff',
    fontWeight: '800',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  inputField: {
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
  },

  inputFieldSelectable: {
    borderColor: 'rgba(0,0,0,0.1)',
  },

  inputFieldActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },

  inputText: {
    color: Colors.text,
  },

  remindRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  remindLabel: {
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
  },

  remindToggle: {
    backgroundColor: '#E53935',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  remindToggleOn: {
    backgroundColor: Colors.green,
  },

  remindToggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  arrowBtn: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueBtn: {
    flex: 1,
    backgroundColor: Colors.green,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  continueBtnDisabled: {
    opacity: 0.5,
  },

  continueBtnText: {
    color: '#fff',
    fontWeight: '800',
  },

  keyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  key: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    elevation: 1,
  },

  keySpecial: {
    backgroundColor: '#d1d5db',
    flex: 1.4,
  },

  keyText: {
    color: '#1a1a1a',
    fontWeight: '500',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  calendarBox: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
  },

  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  calArrow: {
    fontSize: 28,
    color: Colors.primary,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },

  calTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },

  calDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },

  calDayName: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },

  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },

  calCellSelected: {
    backgroundColor: Colors.primary,
  },

  calCellText: {
    fontSize: 14,
    color: Colors.text,
  },

  calCellToday: {
    color: Colors.primary,
    fontWeight: 'bold',
  },

  calCellSelectedText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default PlannerAddScreen;