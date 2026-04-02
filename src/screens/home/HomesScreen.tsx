import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Share,
  ScrollView,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSavedStore } from '../../store/savedStore';
import { Colors } from '../../constants/colors';

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

const tips = [
  'Fish are most active during early morning and late evening.',
  'Falling pressure often increases bite activity.',
  'Match your bait size to the target fish size.',
  'Quiet movement near the shore improves your chances.',
  'Cloudy days can produce better results than bright sun.',
  "Change lure color if there's no bite after 20 minutes.",
  'Fish often stay near underwater structures and drop-offs.',
  'Use lighter line in clear water for more strikes.',
  'Wind pushing toward the shore usually improves fishing spots.',
  'Keep your hooks sharp — dull hooks lose fish.',
  'Fish deeper during hot midday hours.',
  'Slow down your retrieve when the water is cold.',
  'Natural bait often works best in pressured waters.',
  'Watch for birds — they often reveal active fish areas.',
  'After rain, focus on slightly murky water zones.',
  'Try the edges between shallow and deep water first.',
  'A steady retrieve is often better than constant twitching.',
  'Fish tend to face into the current — cast upstream.',
  'Downsizing your lure can trigger hesitant fish.',
  'Always check your drag before the first cast.',
  'Cast near structures like rocks, weeds, or fallen trees where fish often hide.',
  'Use smaller bait if fish seem cautious or inactive.',
  'Try fishing along the shoreline during early morning hours.',
  'When fishing in rivers, cast upstream and let the bait drift naturally.',
  'Keep your movements slow to avoid scaring nearby fish.',
  'Bright lure colors can work better in murky water.',
  'Natural bait often attracts fish more effectively in pressured waters.',
  'Look for areas where water depth changes suddenly.',
  'Fish tend to gather where insects fall onto the water surface.',
  'Use lighter tackle when targeting smaller fish species.',
  'After catching one fish, cast again in the same spot — others may be nearby.',
  'Pay attention to underwater shadows where fish may hide.',
  'Try fishing during cloudy days when fish often move closer to shore.',
  'A slow and steady retrieve can trigger more bites.',
  'If bites stop, change your lure color before moving to another spot.',
  'Fishing near submerged plants often increases your chances.',
  'Avoid casting directly on top of fish activity; cast slightly beyond it.',
  'Use a leader line when fishing for fish with sharp teeth.',
  'Fish often gather near places where streams enter lakes.',
  'Keep a variety of lures with you to adapt to changing conditions.',
];

const quizFacts = [
  { id: '1', emoji: '🐟', text: 'Fish can detect vibrations through their lateral line system.' },
  { id: '2', emoji: '🎣', text: 'The largest freshwater fish ever caught was a giant stingray at 300 kg.' },
  { id: '3', emoji: '🌊', text: 'Most fish are cold-blooded and rely on water temperature to regulate body heat.' },
  { id: '4', emoji: '🪱', text: 'Earthworms remain one of the most effective natural baits for freshwater fishing.' },
  { id: '5', emoji: '🌅', text: 'Dawn and dusk are peak feeding times for most freshwater species.' },
  { id: '6', emoji: '🌧️', text: 'Light rain often improves fishing by reducing surface glare and adding oxygen.' },
  { id: '7', emoji: '🎯', text: 'Accurate casting near cover increases catch rates by up to 60%.' },
  { id: '8', emoji: '🔊', text: 'Loud noises above water transmit as vibrations and scare fish away.' },
  { id: '9', emoji: '🌿', text: 'Weed beds provide both food and shelter — prime locations for predators.' },
  { id: '10', emoji: '🧲', text: 'Bright colored lures work better in murky water; natural colors in clear water.' },
];

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

type UiConfig = {
  isVerySmall: boolean;
  isSmall: boolean;
  sidePad: number;
  boardW: number;
  boardH: number;
  boardText: number;
  topOffset: number;
  scrollTop: number;
  scrollBottom: number;
  sectionGap: number;
  cardRadius: number;
  titleFont: number;
  textFont: number;
  smallText: number;
  lineHeight: number;
  fishSize: number;
  actionHeight: number;
  iconBtn: number;
  factEmoji: number;
  calendarWidth: number;
};

const buildUi = (width: number, height: number): UiConfig => {
  const isVerySmall = height < 640;
  const isSmall = height < 760;

  return {
    isVerySmall,
    isSmall,
    sidePad: isVerySmall ? 14 : isSmall ? 16 : 18,
    boardW: clamp(width * 0.65, 240, 400),
    boardH: isVerySmall ? 46 : isSmall ? 54 : 62,
    boardText: isVerySmall ? 16 : isSmall ? 19 : 22,
    topOffset: isVerySmall ? 6 : isSmall ? 10 : 16,
    scrollTop: isVerySmall ? 8 : isSmall ? 10 : 14,
    scrollBottom: isVerySmall ? 90 : 110,
    sectionGap: isVerySmall ? 8 : isSmall ? 11 : 14,
    cardRadius: isVerySmall ? 16 : isSmall ? 18 : 20,
    titleFont: isVerySmall ? 14 : isSmall ? 15 : 16,
    textFont: isVerySmall ? 12 : isSmall ? 13 : 14,
    smallText: isVerySmall ? 11 : isSmall ? 12 : 13,
    lineHeight: isVerySmall ? 17 : isSmall ? 18 : 20,
    fishSize: isVerySmall ? 48 : isSmall ? 56 : 64,
    actionHeight: isVerySmall ? 36 : 38,
    iconBtn: isVerySmall ? 36 : 38,
    factEmoji: isVerySmall ? 24 : 28,
    calendarWidth: Math.min(width * 0.88, 420),
  };
};

const getTipIndexFromDate = (date: Date) => {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  return seed % tips.length;
};

const formatDate = (date: Date) =>
  `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}.${date.getFullYear()}`;

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { savedTipIds = [], toggleTip } = useSavedStore();

  const ui = useMemo(() => buildUi(width, height), [width, height]);

  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [showAllFacts, setShowAllFacts] = useState(false);

  const baseTipIndex = useMemo(() => getTipIndexFromDate(selectedDate), [selectedDate]);
  const [manualTipOffset, setManualTipOffset] = useState(0);

  const tipIndex = useMemo(
    () => (baseTipIndex + manualTipOffset + tips.length) % tips.length,
    [baseTipIndex, manualTipOffset]
  );

  const currentTip = tips[tipIndex];
  const tipId = String(tipIndex + 1);
  const isSaved = savedTipIds.includes(tipId);

  const factsToRender = useMemo(
    () => (showAllFacts ? quizFacts : quizFacts.slice(0, 5)),
    [showAllFacts]
  );

  const dateStr = useMemo(() => formatDate(selectedDate), [selectedDate]);

  const resetToDaily = useCallback(() => {
    setManualTipOffset(0);
  }, []);

  const handleNextTip = useCallback(() => {
    setManualTipOffset((prev) => prev + 1);
  }, []);

  const handlePrevTip = useCallback(() => {
    setManualTipOffset((prev) => prev - 1);
  }, []);

  const handleRandomTip = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    const delta = randomIndex - baseTipIndex;
    setManualTipOffset(delta);
  }, [baseTipIndex]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Fishing Tip\n${dateStr}\n\n${currentTip}`,
      });
    } catch {}
  }, [currentTip, dateStr]);

  const handleSelectDate = useCallback((day: number) => {
    const nextDate = new Date(calYear, calMonth, day);
    setSelectedDate(nextDate);
    setManualTipOffset(0);
    setCalendarVisible(false);
  }, [calMonth, calYear]);

  const getDaysInMonth = useCallback((month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  }, []);

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(calMonth, calYear);
    const firstDay = getFirstDayOfMonth(calMonth, calYear);
    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let i = 1; i <= daysInMonth; i++) cells.push(i);

    const isCurrentMonth =
      calMonth === selectedDate.getMonth() && calYear === selectedDate.getFullYear();

    return (
      <Modal
        visible={calendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            style={StyleSheet.absoluteFillObject}
            onPress={() => setCalendarVisible(false)}
          />

          <View
            style={[
              styles.calendarBox,
              {
                width: ui.calendarWidth,
                borderRadius: ui.cardRadius + 2,
              },
            ]}
          >
            <View style={styles.calHeader}>
              <TouchableOpacity
                onPress={() => {
                  if (calMonth === 0) {
                    setCalMonth(11);
                    setCalYear((y) => y - 1);
                  } else {
                    setCalMonth((m) => m - 1);
                  }
                }}
              >
                <Text style={styles.calArrow}>‹</Text>
              </TouchableOpacity>

              <Text style={styles.calTitle}>
                {MONTHS[calMonth]} {calYear}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  if (calMonth === 11) {
                    setCalMonth(0);
                    setCalYear((y) => y + 1);
                  } else {
                    setCalMonth((m) => m + 1);
                  }
                }}
              >
                <Text style={styles.calArrow}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calDaysRow}>
              {DAYS.map((d) => (
                <Text key={d} style={styles.calDayName}>
                  {d}
                </Text>
              ))}
            </View>

            <View style={styles.calGrid}>
              {cells.map((day, idx) => {
                const isSelected = Boolean(
                  day &&
                    isCurrentMonth &&
                    day === selectedDate.getDate()
                );

                const isToday =
                  day &&
                  calMonth === today.getMonth() &&
                  calYear === today.getFullYear() &&
                  day === today.getDate();

                return (
                  <TouchableOpacity
                    key={`${idx}-${day ?? 'empty'}`}
                    style={[
                      styles.calCell,
                      isSelected ? styles.calCellSelected : null,
                    ]}
                    onPress={() => {
                      if (day) handleSelectDate(day);
                    }}
                    disabled={!day}
                    activeOpacity={0.85}
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
          </View>
        </View>
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
            marginTop: insets.top + ui.topOffset,
            height: ui.boardH,
            width: ui.boardW,
          },
        ]}
      >
        <Image
          source={require('../../assets/images/ui/header_board.png')}
          style={styles.boardImg}
          resizeMode="contain"
        />
        <Text style={[styles.headerText, { fontSize: ui.boardText }]}>Home</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingHorizontal: ui.sidePad,
            paddingTop: ui.scrollTop,
            paddingBottom: insets.bottom + ui.scrollBottom,
          },
        ]}
      >
        <View
          style={[
            styles.tipCard,
            {
              borderRadius: ui.cardRadius,
              marginBottom: ui.sectionGap,
            },
          ]}
        >
          <View style={styles.tipLabelRow}>
            <Text style={[styles.tipLabel, { fontSize: ui.smallText }]}>Daily Tip</Text>
            <Text style={[styles.tipCounter, { fontSize: ui.smallText }]}>
              {tipIndex + 1}/{tips.length}
            </Text>
          </View>

          <View
            style={[
              styles.tipBody,
              {
                paddingVertical: ui.sectionGap,
              },
            ]}
          >
            <Image
              source={require('../../assets/images/ui/fish_icon.png')}
              style={{ width: ui.fishSize, height: ui.fishSize }}
              resizeMode="contain"
            />

            <Text
              style={[
                styles.tipText,
                {
                  fontSize: ui.textFont,
                  lineHeight: ui.lineHeight,
                },
              ]}
            >
              {currentTip}
            </Text>
          </View>

          <View style={styles.tipMetaRow}>
            <Text style={[styles.tipMetaText, { fontSize: ui.smallText }]}>
              Date: {dateStr}
            </Text>

            {manualTipOffset !== 0 ? (
              <TouchableOpacity activeOpacity={0.85} onPress={resetToDaily}>
                <Text style={[styles.resetText, { fontSize: ui.smallText }]}>
                  Reset to daily
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View
            style={[
              styles.tipActionsTop,
              {
                paddingHorizontal: ui.sidePad - 2,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.smallActionBtn,
                { height: ui.actionHeight, borderRadius: 10 },
              ]}
              onPress={handlePrevTip}
              activeOpacity={0.85}
            >
              <Text style={[styles.smallActionText, { fontSize: ui.smallText }]}>
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.smallActionBtn,
                { height: ui.actionHeight, borderRadius: 10 },
              ]}
              onPress={handleRandomTip}
              activeOpacity={0.85}
            >
              <Text style={[styles.smallActionText, { fontSize: ui.smallText }]}>
                Random
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.smallActionBtn,
                { height: ui.actionHeight, borderRadius: 10 },
              ]}
              onPress={handleNextTip}
              activeOpacity={0.85}
            >
              <Text style={[styles.smallActionText, { fontSize: ui.smallText }]}>
                Next
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.tipActionsBottom,
              {
                paddingBottom: ui.sectionGap,
                paddingHorizontal: ui.sidePad - 2,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  width: ui.iconBtn,
                  height: ui.iconBtn,
                  borderRadius: 10,
                },
              ]}
              onPress={handleShare}
              activeOpacity={0.85}
            >
              <Text style={styles.actionIcon}>📤</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.mainActionBtn,
                {
                  height: ui.actionHeight,
                  borderRadius: 10,
                },
              ]}
              onPress={() => setCalendarVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={[styles.mainActionText, { fontSize: ui.textFont }]}>
                Select Date
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  width: ui.iconBtn,
                  height: ui.iconBtn,
                  borderRadius: 10,
                },
                isSaved ? styles.actionBtnSaved : null,
              ]}
              onPress={() => toggleTip(tipId)}
              activeOpacity={0.85}
            >
              <Text style={styles.actionIcon}>{isSaved ? '🔖' : '🏷️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.locationRow,
            {
              borderRadius: ui.cardRadius - 2,
              paddingVertical: ui.isVerySmall ? 7 : ui.isSmall ? 8 : 10,
              paddingHorizontal: ui.sidePad,
              marginBottom: ui.sectionGap,
            },
          ]}
          onPress={() => setCalendarVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={[styles.locationText, { fontSize: ui.titleFont }]}>Vinnytsia</Text>

          <View style={styles.locationRight}>
            <Text style={[styles.dateText, { fontSize: ui.smallText }]}>{dateStr}</Text>
            <Text style={styles.calIcon}>📅</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { fontSize: ui.titleFont }]}>
            🎣 Did You Know?
          </Text>

          <TouchableOpacity activeOpacity={0.85} onPress={() => setShowAllFacts((p) => !p)}>
            <Text style={[styles.toggleFactsText, { fontSize: ui.smallText }]}>
              {showAllFacts ? 'Show less' : 'Show more'}
            </Text>
          </TouchableOpacity>
        </View>

        {factsToRender.map((fact) => (
          <View
            key={fact.id}
            style={[
              styles.factCard,
              {
                borderRadius: ui.cardRadius - 2,
                marginBottom: ui.sectionGap,
                padding: ui.isVerySmall ? 12 : 14,
              },
            ]}
          >
            <Text style={[styles.factEmoji, { fontSize: ui.factEmoji }]}>{fact.emoji}</Text>
            <Text
              style={[
                styles.factText,
                {
                  fontSize: ui.smallText,
                  lineHeight: ui.lineHeight,
                },
              ]}
            >
              {fact.text}
            </Text>
          </View>
        ))}
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
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    zIndex: 1,
  },

  scroll: {
    alignItems: 'center',
  },

  tipCard: {
    width: '100%',
    backgroundColor: Colors.primary,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  tipLabelRow: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  tipLabel: {
    fontWeight: 'bold',
    color: Colors.white,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },

  tipCounter: {
    color: Colors.white,
    fontWeight: '700',
    opacity: 0.9,
  },

  tipBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },

  tipText: {
    flex: 1,
    color: Colors.white,
    fontWeight: '500',
  },

  tipMetaRow: {
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tipMetaText: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },

  resetText: {
    color: Colors.white,
    fontWeight: '700',
  },

  tipActionsTop: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },

  smallActionBtn: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallActionText: {
    color: Colors.white,
    fontWeight: '700',
  },

  tipActionsBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  actionBtn: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionBtnSaved: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },

  actionIcon: {
    fontSize: 16,
  },

  mainActionBtn: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainActionText: {
    color: Colors.white,
    fontWeight: '700',
  },

  locationRow: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  locationText: {
    color: Colors.white,
    fontWeight: '600',
  },

  locationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  dateText: {
    color: Colors.white,
  },

  calIcon: {
    fontSize: 16,
  },

  sectionHeaderRow: {
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    color: Colors.white,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  toggleFactsText: {
    color: Colors.white,
    fontWeight: '700',
  },

  factCard: {
    width: '100%',
    backgroundColor: 'rgba(255,140,0,0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  factEmoji: {},

  factText: {
    flex: 1,
    color: Colors.white,
    fontWeight: '500',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  calendarBox: {
    backgroundColor: Colors.white,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
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

export default HomeScreen;