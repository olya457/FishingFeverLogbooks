import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Share,
  ImageBackground,
  Image,
  useWindowDimensions,
  TextInput,
  ListRenderItemInfo,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSavedStore } from '../../store/savedStore';
import { fishingGuide } from '../../data/fishingGuide';
import { GuideArticle } from '../../types/guide';
import { Colors } from '../../constants/colors';

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

type UiConfig = {
  isVerySmall: boolean;
  isSmall: boolean;
  isNarrow: boolean;
  sidePad: number;
  boardWidth: number;
  boardHeight: number;
  boardFont: number;
  boardTop: number;
  listTop: number;
  listBottom: number;
  itemGap: number;
  cardRadius: number;
  titlePadV: number;
  titlePadH: number;
  titleFont: number;
  bodyPad: number;
  bodyFont: number;
  bodyLineHeight: number;
  actionsPadV: number;
  actionsGap: number;
  actionBtnSize: number;
  actionIconSize: number;
  searchHeight: number;
  searchRadius: number;
  searchFont: number;
  searchTop: number;
  filterHeight: number;
  filterFont: number;
  readMoreFont: number;
  emptyTitleFont: number;
  emptyBodyFont: number;
};

const buildUi = (width: number, height: number): UiConfig => {
  const isVerySmall = height < 700;
  const isSmall = height < 780;
  const isNarrow = width < 360;

  return {
    isVerySmall,
    isSmall,
    isNarrow,
    sidePad: isNarrow ? 12 : isVerySmall ? 14 : 16,
    boardWidth: clamp(width * (isVerySmall ? 0.7 : 0.74), 230, 420),
    boardHeight: isVerySmall ? 58 : isSmall ? 66 : 76,
    boardFont: isVerySmall ? 15 : isSmall ? 17 : 20,
    boardTop: isVerySmall ? 18 : isSmall ? 22 : 30,
    listTop: isVerySmall ? 8 : isSmall ? 10 : 14,
    listBottom: isVerySmall ? 110 : 140,
    itemGap: isVerySmall ? 8 : isSmall ? 10 : 12,
    cardRadius: isVerySmall ? 18 : isSmall ? 20 : 22,
    titlePadV: isVerySmall ? 12 : 14,
    titlePadH: isVerySmall ? 12 : 14,
    titleFont: isVerySmall ? 13 : isSmall ? 14 : 15,
    bodyPad: isVerySmall ? 14 : 16,
    bodyFont: isVerySmall ? 12 : isSmall ? 13 : 14,
    bodyLineHeight: isVerySmall ? 20 : isSmall ? 22 : 24,
    actionsPadV: isVerySmall ? 10 : 12,
    actionsGap: isVerySmall ? 14 : 16,
    actionBtnSize: isVerySmall ? 42 : 46,
    actionIconSize: isVerySmall ? 18 : 20,
    searchHeight: isVerySmall ? 44 : 48,
    searchRadius: isVerySmall ? 14 : 16,
    searchFont: isVerySmall ? 13 : 14,
    searchTop: isVerySmall ? 10 : 12,
    filterHeight: isVerySmall ? 38 : 42,
    filterFont: isVerySmall ? 12 : 13,
    readMoreFont: isVerySmall ? 12 : 13,
    emptyTitleFont: isVerySmall ? 16 : 18,
    emptyBodyFont: isVerySmall ? 12 : 13,
  };
};

const normalizeText = (value: string) => value.trim().toLowerCase();

const matchesArticle = (item: GuideArticle, query: string) => {
  if (!query) return true;

  const q = normalizeText(query);
  const title = normalizeText(item.title);
  const body = normalizeText(item.body);

  return title.includes(q) || body.includes(q);
};

type GuideCardProps = {
  item: GuideArticle;
  ui: UiConfig;
  isSaved: boolean;
  expanded: boolean;
  onToggleSaved: (id: string) => void;
  onShare: (item: GuideArticle) => void;
  onToggleExpanded: (id: string) => void;
};

const GuideCard = memo(
  ({
    item,
    ui,
    isSaved,
    expanded,
    onToggleSaved,
    onShare,
    onToggleExpanded,
  }: GuideCardProps) => {
    return (
      <View
        style={[
          styles.card,
          {
            borderRadius: ui.cardRadius,
          },
        ]}
      >
        <View
          style={[
            styles.titleBar,
            {
              paddingVertical: ui.titlePadV,
              paddingHorizontal: ui.titlePadH,
            },
          ]}
        >
          <Text
            style={[
              styles.articleTitle,
              {
                fontSize: ui.titleFont,
              },
            ]}
          >
            {item.title}
          </Text>
        </View>

        <Text
          style={[
            styles.body,
            {
              paddingTop: ui.bodyPad,
              paddingHorizontal: ui.bodyPad,
              fontSize: ui.bodyFont,
              lineHeight: ui.bodyLineHeight,
            },
          ]}
          numberOfLines={expanded ? undefined : 4}
        >
          {item.body}
        </Text>

        {item.body.length > 140 ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onToggleExpanded(item.id)}
            style={[
              styles.readMoreBtn,
              {
                paddingHorizontal: ui.bodyPad,
                paddingTop: 6,
                paddingBottom: 4,
              },
            ]}
          >
            <Text
              style={[
                styles.readMoreText,
                {
                  fontSize: ui.readMoreFont,
                },
              ]}
            >
              {expanded ? 'Hide' : 'Read more'}
            </Text>
          </TouchableOpacity>
        ) : null}

        <View
          style={[
            styles.cardActions,
            {
              paddingVertical: ui.actionsPadV,
              gap: ui.actionsGap,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.actionBtn,
              {
                width: ui.actionBtnSize,
                height: ui.actionBtnSize,
                borderRadius: ui.actionBtnSize / 2,
              },
            ]}
            onPress={() => onShare(item)}
          >
            <Text style={{ fontSize: ui.actionIconSize }}>📤</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.actionBtn,
              {
                width: ui.actionBtnSize,
                height: ui.actionBtnSize,
                borderRadius: ui.actionBtnSize / 2,
              },
              isSaved ? styles.actionBtnSaved : null,
            ]}
            onPress={() => onToggleSaved(item.id)}
          >
            <Text style={{ fontSize: ui.actionIconSize }}>
              {isSaved ? '🔖' : '🏷️'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

GuideCard.displayName = 'GuideCard';

const FishingGuideScreen = () => {
  const insets = useSafeAreaInsets();
  const { savedGuideIds, toggleGuide } = useSavedStore();
  const { width, height } = useWindowDimensions();

  const ui = useMemo(() => buildUi(width, height), [width, height]);

  const [query, setQuery] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const handleShare = useCallback(async (item: GuideArticle) => {
    try {
      await Share.share({
        message: `${item.title}\n\n${item.body}`,
      });
    } catch {}
  }, []);

  const handleToggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  }, []);

  const filteredData = useMemo(() => {
    return fishingGuide.filter((item) => {
      const passesSearch = matchesArticle(item, query);
      const passesSaved = savedOnly ? savedGuideIds.includes(item.id) : true;
      return passesSearch && passesSaved;
    });
  }, [query, savedOnly, savedGuideIds]);

  const savedCount = savedGuideIds.length;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<GuideArticle>) => {
      const isSaved = savedGuideIds.includes(item.id);
      const expanded = expandedIds.includes(item.id);

      return (
        <GuideCard
          item={item}
          ui={ui}
          isSaved={isSaved}
          expanded={expanded}
          onToggleSaved={toggleGuide}
          onShare={handleShare}
          onToggleExpanded={handleToggleExpanded}
        />
      );
    },
    [expandedIds, handleShare, handleToggleExpanded, savedGuideIds, toggleGuide, ui]
  );

  const keyExtractor = useCallback((item: GuideArticle) => item.id, []);

  const ListHeader = useMemo(() => {
    return (
      <View
        style={{
          paddingHorizontal: ui.sidePad,
          paddingTop: ui.searchTop,
          paddingBottom: ui.listTop,
          gap: 10,
        }}
      >
        <View
          style={[
            styles.searchBox,
            {
              minHeight: ui.searchHeight,
              borderRadius: ui.searchRadius,
              paddingHorizontal: ui.isVerySmall ? 12 : 14,
            },
          ]}
        >
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search articles"
            placeholderTextColor="rgba(255,255,255,0.65)"
            style={[
              styles.searchInput,
              {
                fontSize: ui.searchFont,
              },
            ]}
          />
          {query.length > 0 ? (
            <TouchableOpacity activeOpacity={0.8} onPress={() => setQuery('')}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filtersRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.filterBtn,
              {
                minHeight: ui.filterHeight,
                borderRadius: ui.filterHeight / 2,
              },
              !savedOnly && styles.filterBtnActive,
            ]}
            onPress={() => setSavedOnly(false)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  fontSize: ui.filterFont,
                },
                !savedOnly && styles.filterTextActive,
              ]}
            >
              All articles
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.filterBtn,
              {
                minHeight: ui.filterHeight,
                borderRadius: ui.filterHeight / 2,
              },
              savedOnly && styles.filterBtnActive,
            ]}
            onPress={() => setSavedOnly(true)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  fontSize: ui.filterFont,
                },
                savedOnly && styles.filterTextActive,
              ]}
            >
              Saved ({savedCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [query, savedCount, savedOnly, ui]);

  const ListEmpty = useMemo(() => {
    return (
      <View
        style={[
          styles.emptyWrap,
          {
            marginTop: ui.isVerySmall ? 32 : 48,
            paddingHorizontal: ui.sidePad + 8,
          },
        ]}
      >
        <Text
          style={[
            styles.emptyTitle,
            {
              fontSize: ui.emptyTitleFont,
            },
          ]}
        >
          {savedOnly ? 'No saved articles yet' : 'Nothing found'}
        </Text>

        <Text
          style={[
            styles.emptyBody,
            {
              fontSize: ui.emptyBodyFont,
              lineHeight: ui.emptyBodyFont * 1.5,
            },
          ]}
        >
          {savedOnly
            ? 'Save useful guides and they will appear here.'
            : 'Try another search phrase or clear the search field.'}
        </Text>
      </View>
    );
  }, [savedOnly, ui]);

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
            marginTop: insets.top + ui.boardTop,
            height: ui.boardHeight,
            width: ui.boardWidth,
          },
        ]}
      >
        <Image
          source={require('../../assets/images/ui/header_board.png')}
          style={styles.headerBoard}
          resizeMode="stretch"
        />
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.headerText,
            {
              fontSize: ui.boardFont,
            },
          ]}
        >
          Fishing Guide
        </Text>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + ui.listBottom,
        }}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        ItemSeparatorComponent={() => <View style={{ height: ui.itemGap }} />}
      />
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
    overflow: 'visible',
  },

  headerBoard: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },

  headerText: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1,
    paddingHorizontal: 44,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: Colors.white,
    paddingVertical: 0,
  },

  clearText: {
    color: Colors.white,
    fontSize: 15,
    opacity: 0.8,
    marginLeft: 10,
  },

  filtersRow: {
    flexDirection: 'row',
    gap: 10,
  },

  filterBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },

  filterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  filterText: {
    color: Colors.white,
    fontWeight: '600',
  },

  filterTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },

  card: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.93)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  titleBar: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  articleTitle: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  body: {
    color: Colors.text,
  },

  readMoreBtn: {
    alignSelf: 'flex-start',
  },

  readMoreText: {
    color: Colors.primary,
    fontWeight: '700',
  },

  cardActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },

  actionBtn: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionBtnSaved: {
    backgroundColor: Colors.primary,
  },

  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  emptyBody: {
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
    maxWidth: 320,
  },
});

export default FishingGuideScreen;