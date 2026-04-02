import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { useLogbookStore } from '../../store/logbookStore';
import { Colors } from '../../constants/colors';

const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(v, mx));

const LogbookScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { catches } = useLogbookStore();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [sortMode, setSortMode] = useState<'newest' | 'alphabet'>('newest');

  const ui = useMemo(() => {
    const vs = height < 640;
    const sm = height < 740;

    return {
      boardH: vs ? 58 : sm ? 68 : 76,
      boardW: clamp(width * (vs ? 0.7 : sm ? 0.74 : 0.78), 220, 560),
      boardText: vs ? 15 : sm ? 17 : 20,
      topGap: insets.top + (vs ? 18 : sm ? 24 : 30),
      sidePad: vs ? 12 : 14,
      listGap: vs ? 7 : sm ? 8 : 10,
      cardPad: vs ? 9 : 10,
      cardRadius: vs ? 12 : 14,
      imageSize: vs ? 56 : sm ? 62 : 70,
      titleFont: vs ? 13 : sm ? 14 : 15,
      subFont: vs ? 10 : sm ? 11 : 12,
      btnFont: vs ? 10 : sm ? 11 : 12,
      btnV: vs ? 3 : 4,
      btnH: vs ? 9 : sm ? 10 : 12,
      emptyPad: vs ? 12 : sm ? 14 : 16,
      emptyImageW: vs ? 80 : sm ? 95 : 110,
      emptyImageH: vs ? 100 : sm ? 115 : 130,
      emptyFont: vs ? 12 : sm ? 13 : 14,
      addBtnV: vs ? 11 : sm ? 13 : 16,
      addBtnFont: vs ? 14 : sm ? 15 : 16,
      filterH: vs ? 34 : sm ? 36 : 40,
      filterFont: vs ? 11 : sm ? 12 : 13,
    };
  }, [height, insets.top, width]);

  const sortedCatches = useMemo(() => {
    const items = [...catches];

    if (sortMode === 'alphabet') {
      return items.sort((a, b) => a.fishType.localeCompare(b.fishType));
    }

    return items.sort((a, b) => Number(b.id) - Number(a.id));
  }, [catches, sortMode]);

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
            marginTop: ui.topGap,
            height: ui.boardH,
            width: ui.boardW,
          },
        ]}
      >
        <Image
          source={require('../../assets/images/ui/header_board.png')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="stretch"
        />
        <Text style={[styles.headerText, { fontSize: ui.boardText }]}>Fisherman Logbook</Text>
      </View>

      <View style={[styles.filterRow, { paddingHorizontal: ui.sidePad }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setSortMode('newest')}
          style={[
            styles.filterBtn,
            {
              minHeight: ui.filterH,
              borderRadius: ui.filterH / 2,
            },
            sortMode === 'newest' ? styles.filterBtnActive : undefined,
          ]}
        >
          <Text
            style={[
              styles.filterTxt,
              { fontSize: ui.filterFont },
              sortMode === 'newest' ? styles.filterTxtActive : undefined,
            ]}
          >
            Newest
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setSortMode('alphabet')}
          style={[
            styles.filterBtn,
            {
              minHeight: ui.filterH,
              borderRadius: ui.filterH / 2,
            },
            sortMode === 'alphabet' ? styles.filterBtnActive : undefined,
          ]}
        >
          <Text
            style={[
              styles.filterTxt,
              { fontSize: ui.filterFont },
              sortMode === 'alphabet' ? styles.filterTxtActive : undefined,
            ]}
          >
            A-Z
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.countBadge,
            {
              minHeight: ui.filterH,
              borderRadius: ui.filterH / 2,
            },
          ]}
        >
          <Text style={[styles.countBadgeTxt, { fontSize: ui.filterFont }]}>
            {catches.length} catches
          </Text>
        </View>
      </View>

      {sortedCatches.length === 0 ? (
        <View style={[styles.empty, { paddingTop: ui.emptyPad + 6, paddingHorizontal: ui.sidePad }]}>
          <View style={[styles.emptyCard, { padding: ui.emptyPad, borderRadius: ui.cardRadius + 6 }]}>
            <Image
              source={require('../../assets/images/ui/fisherman_character.png')}
              style={{
                width: ui.emptyImageW,
                height: ui.emptyImageH,
              }}
              resizeMode="contain"
            />
            <View style={styles.emptyTextBlock}>
              <Text
                style={[
                  styles.emptyText,
                  {
                    fontSize: ui.emptyFont,
                    lineHeight: ui.emptyFont * 1.55,
                  },
                ]}
              >
                Ready to record your catch? Add the fish details, location, and a photo to keep your fishing log complete.
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          data={sortedCatches}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            {
              paddingHorizontal: ui.sidePad,
              paddingBottom: insets.bottom + 170,
            },
          ]}
          ItemSeparatorComponent={() => <View style={{ height: ui.listGap }} />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  borderRadius: ui.cardRadius,
                  padding: ui.cardPad,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('LogbookEdit', { id: item.id })}
            >
              <View
                style={[
                  styles.cardImagePlaceholder,
                  {
                    width: ui.imageSize,
                    height: ui.imageSize,
                    borderRadius: 10,
                  },
                ]}
              >
                {item.photoUri ? (
                  <Image
                    source={{ uri: item.photoUri }}
                    style={[
                      styles.cardPhoto,
                      {
                        width: ui.imageSize,
                        height: ui.imageSize,
                        borderRadius: 10,
                      },
                    ]}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={{ fontSize: ui.imageSize * 0.45 }}>🐟</Text>
                )}
              </View>

              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { fontSize: ui.titleFont }]} numberOfLines={1}>
                  {item.fishType}
                </Text>

                {item.location ? (
                  <Text style={[styles.cardSub, { fontSize: ui.subFont }]} numberOfLines={1}>
                    📍 {item.location}
                  </Text>
                ) : null}

                {item.description ? (
                  <Text style={[styles.cardSub, { fontSize: ui.subFont }]} numberOfLines={1}>
                    {item.description}
                  </Text>
                ) : null}

                <Text style={[styles.cardSub, { fontSize: ui.subFont }]}>📅 {item.date}</Text>

                <TouchableOpacity
                  style={[
                    styles.openBtn,
                    {
                      paddingVertical: ui.btnV,
                      paddingHorizontal: ui.btnH,
                    },
                  ]}
                  onPress={() => navigation.navigate('LogbookEdit', { id: item.id })}
                >
                  <Text style={[styles.openBtnText, { fontSize: ui.btnFont }]}>Open</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.cardRight}>
                <Text style={styles.cardCalIcon}>📘</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={[styles.footer, { paddingHorizontal: ui.sidePad, paddingBottom: insets.bottom + 118 }]}>
        <TouchableOpacity
          style={[styles.addBtn, { paddingVertical: ui.addBtnV, borderRadius: ui.cardRadius }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('LogbookAdd')}
        >
          <Text style={[styles.addBtnText, { fontSize: ui.addBtnFont }]}>+ Add Catch</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 12,
  },

  headerText: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 8,
  },

  filterBtn: {
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterBtnActive: {
    backgroundColor: Colors.primary,
  },

  filterTxt: {
    color: Colors.white,
    fontWeight: '600',
  },

  filterTxtActive: {
    fontWeight: '800',
  },

  countBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 14,
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countBadgeTxt: {
    color: Colors.white,
    fontWeight: '700',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  emptyCard: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  emptyTextBlock: {
    flex: 1,
  },

  emptyText: {
    color: Colors.white,
    fontWeight: '500',
  },

  list: {},

  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  cardImagePlaceholder: {
    backgroundColor: 'rgba(0,0,0,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  cardPhoto: {},

  cardInfo: {
    flex: 1,
    gap: 3,
  },

  cardTitle: {
    fontWeight: 'bold',
    color: Colors.text,
  },

  cardSub: {
    color: '#555',
  },

  openBtn: {
    marginTop: 4,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  openBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
  },

  cardRight: {
    alignItems: 'flex-end',
  },

  cardCalIcon: {
    fontSize: 16,
  },

  footer: {
    paddingTop: 8,
  },

  addBtn: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  addBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default LogbookScreen;