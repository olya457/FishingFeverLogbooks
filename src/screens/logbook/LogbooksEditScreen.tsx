import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { RootStackParamList } from '../../navigation/types';
import { useLogbookStore } from '../../store/logbookStore';
import { Colors } from '../../constants/colors';

type RouteProps = RouteProp<RootStackParamList, 'LogbookEdit'>;
type FieldKey = 'fishType' | 'description' | 'location';

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
  ['123', 'space', 'return'],
];

const NUM_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', '.', ',', '?', '!', "'", '"', '(', ')'],
  ['#', '+', '=', '_', '<', '>', '[', ']', '{', '}'],
  ['ABC', 'space', 'return'],
];

const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(v, mx));

const LogbookEditScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { catches, updateCatch, deleteCatch } = useLogbookStore();

  const entry = catches.find((c) => c.id === route.params.id);

  const [fishType, setFishType] = useState(entry?.fishType ?? '');
  const [description, setDescription] = useState(entry?.description ?? '');
  const [location, setLocation] = useState(entry?.location ?? '');
  const [photoUri, setPhotoUri] = useState<string | null>(entry?.photoUri ?? null);
  const [activeField, setActiveField] = useState<FieldKey>('fishType');
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [isNumMode, setIsNumMode] = useState(false);

  const ui = useMemo(() => {
    const vs = height < 640;
    const sm = height < 740;
    const hPad = 12;
    const cardW = Math.min(width - hPad * 2, 620);

    return {
      hPad,
      cardW,
      boardW: clamp(width * 0.76, 220, 560),
      boardH: vs ? 58 : sm ? 66 : 76,
      boardText: vs ? 13 : sm ? 15 : 18,
      topGap: insets.top + (vs ? 6 : sm ? 10 : 16),
      gap: vs ? 6 : sm ? 10 : 14,
      photoH: vs ? 68 : sm ? 84 : 104,
      fieldH: vs ? 36 : sm ? 40 : 46,
      descH: vs ? 54 : sm ? 62 : 76,
      rowH: vs ? 28 : sm ? 32 : 38,
      btnH: vs ? 40 : sm ? 46 : 54,
      cardPad: vs ? 8 : sm ? 10 : 14,
      cardGap: vs ? 6 : sm ? 8 : 10,
      keyGap: vs ? 3 : sm ? 4 : 5,
      cardRadius: vs ? 14 : sm ? 18 : 22,
      fieldFont: vs ? 12 : sm ? 13 : 15,
      keyFont: vs ? 13 : sm ? 15 : 17,
      retFont: vs ? 10 : sm ? 11 : 13,
      btnFont: vs ? 14 : sm ? 16 : 18,
      iconSz: vs ? 14 : sm ? 16 : 18,
      emojiSz: vs ? 18 : sm ? 22 : 26,
      photoTxt: vs ? 11 : sm ? 12 : 14,
      delW: vs ? 44 : sm ? 50 : 58,
    };
  }, [width, height, insets.top]);

  if (!entry) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackTxt}>Entry not found</Text>
      </View>
    );
  }

  const getValue = (k: FieldKey) =>
    k === 'fishType' ? fishType : k === 'description' ? description : location;

  const setValue = (k: FieldKey, v: string) => {
    if (k === 'fishType') setFishType(v);
    else if (k === 'description') setDescription(v);
    else setLocation(v);
  };

  const moveNextField = () => {
    if (activeField === 'fishType') setActiveField('description');
    else if (activeField === 'description') setActiveField('location');
  };

  const handleKey = (key: string) => {
    const cur = getValue(activeField);

    if (key === '⌫') {
      setValue(activeField, cur.slice(0, -1));
      return;
    }

    if (key === 'space') {
      setValue(activeField, cur + ' ');
      return;
    }

    if (key === 'return') {
      moveNextField();
      return;
    }

    if (key === '⇧') {
      setIsUpperCase((p) => !p);
      return;
    }

    if (key === '123') {
      setIsNumMode(true);
      return;
    }

    if (key === 'ABC') {
      setIsNumMode(false);
      return;
    }

    const ch = !isNumMode && isUpperCase ? key.toUpperCase() : key;
    setValue(activeField, cur + ch);

    if (isUpperCase && !isNumMode) setIsUpperCase(false);
  };

  const handlePickPhoto = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      (r: ImagePickerResponse) => {
        const uri = r.assets?.[0]?.uri;
        if (uri) setPhotoUri(uri);
      }
    );
  }, []);

  const handleRemovePhoto = useCallback(() => {
    setPhotoUri(null);
  }, []);

  const handleSave = useCallback(() => {
    if (!fishType.trim()) return;

    updateCatch(route.params.id, {
      fishType: fishType.trim(),
      description: description.trim(),
      location: location.trim(),
      photoUri: photoUri ?? undefined,
    });

    navigation.goBack();
  }, [description, fishType, location, navigation, photoUri, route.params.id, updateCatch]);

  const handleDelete = useCallback(() => {
    Alert.alert('Delete catch', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteCatch(route.params.id);
          navigation.goBack();
        },
      },
    ]);
  }, [deleteCatch, navigation, route.params.id]);

  const rows = isNumMode ? NUM_ROWS : KEYBOARD_ROWS;
  const canSave = fishType.trim().length > 0;

  const renderField = (key: FieldKey, ph: string, multiline = false, h?: number) => {
    const val = getValue(key);
    const fh = h ?? (multiline ? ui.descH : ui.fieldH);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setActiveField(key)}
        style={[
          styles.field,
          {
            minHeight: fh,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: multiline ? 8 : 0,
          },
          activeField === key ? styles.fieldActive : undefined,
        ]}
      >
        <Text
          numberOfLines={multiline ? 3 : 1}
          style={[
            styles.fieldText,
            { fontSize: ui.fieldFont },
            !val ? styles.placeholder : undefined,
          ]}
        >
          {val || ph}
        </Text>
        {activeField === key ? (
          <View style={[styles.cursor, { height: ui.fieldFont + 4 }]} />
        ) : null}
      </TouchableOpacity>
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
          styles.headerWrap,
          {
            marginTop: ui.topGap,
            width: ui.boardW,
            height: ui.boardH,
          },
        ]}
      >
        <Image
          source={require('../../assets/images/ui/header_board.png')}
          style={styles.boardImg}
          resizeMode="stretch"
        />
        <Text style={[styles.headerTitle, { fontSize: ui.boardText }]}>Fisherman Logbook</Text>
        <TouchableOpacity style={styles.exitBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.exitTxt, { fontSize: ui.boardText - 2 }]}>Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: ui.hPad,
          paddingTop: ui.gap,
          paddingBottom: insets.bottom + 14,
        }}
      >
        <View
          style={[
            styles.card,
            {
              width: ui.cardW,
              borderRadius: ui.cardRadius,
              padding: ui.cardPad,
              gap: ui.cardGap,
              alignSelf: 'center',
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePickPhoto}
            style={[styles.photoBox, { height: ui.photoH, borderRadius: 10 }]}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
            ) : (
              <>
                <Text style={{ fontSize: ui.emojiSz }}>📷</Text>
                <Text style={[styles.photoLbl, { fontSize: ui.photoTxt }]}>+ Add a photo</Text>
              </>
            )}
          </TouchableOpacity>

          {photoUri ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleRemovePhoto}
              style={styles.removePhotoBtn}
            >
              <Text style={[styles.removePhotoTxt, { fontSize: ui.photoTxt }]}>Remove photo</Text>
            </TouchableOpacity>
          ) : null}

          {renderField('fishType', 'A type of fish...')}
          {renderField('description', 'Description (optional)...', true)}
          {renderField('location', 'Location')}

          <View style={[styles.infoRow, { minHeight: ui.fieldH }]}>
            <Text style={{ fontSize: ui.iconSz }}>📅</Text>
            <Text style={[styles.dateTxt, { fontSize: ui.fieldFont }]}>{entry.date}</Text>
          </View>

          <View style={{ gap: ui.keyGap }}>
            {rows.map((row, ri) => (
              <View key={ri} style={[styles.keyRow, { gap: ui.keyGap }]}>
                {row.map((k) => {
                  const spec = ['⇧', '⌫', '123', 'ABC', 'return', 'space'].includes(k);
                  const isSp = k === 'space';
                  const isRt = k === 'return';

                  return (
                    <TouchableOpacity
                      key={k}
                      activeOpacity={0.7}
                      onPress={() => handleKey(k)}
                      style={[
                        styles.key,
                        { height: ui.rowH },
                        spec ? styles.specKey : undefined,
                        isSp ? { flex: 2.6 } : undefined,
                        isRt ? { flex: 1.7 } : undefined,
                      ]}
                    >
                      <Text
                        style={[
                          styles.keyTxt,
                          { fontSize: isRt ? ui.retFont : ui.keyFont },
                          spec ? styles.specTxt : undefined,
                        ]}
                      >
                        {k === 'space'
                          ? '·'
                          : k === 'return'
                            ? 'next'
                            : !isNumMode && isUpperCase && !spec
                              ? k.toUpperCase()
                              : k}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={[styles.bottomRow, { gap: 8 }]}>
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.delBtn, { width: ui.delW, height: ui.btnH, borderRadius: 10 }]}
            >
              <Text style={{ fontSize: ui.emojiSz }}>🗑</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={!canSave}
              style={[
                styles.contBtn,
                { height: ui.btnH, borderRadius: 12 },
                !canSave ? styles.contBtnDisabled : undefined,
              ]}
            >
              <Text style={[styles.contTxt, { fontSize: ui.btnFont }]}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B2F63',
  },
  fallbackTxt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerWrap: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardImg: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: 56,
    textShadowColor: 'rgba(0,0,0,0.4)',
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
    backgroundColor: 'rgba(243,248,251,0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  photoBox: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.10)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 4,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoLbl: {
    color: '#F28C00',
    fontWeight: '700',
  },
  removePhotoBtn: {
    alignSelf: 'flex-end',
  },
  removePhotoTxt: {
    color: '#D46A00',
    fontWeight: '700',
  },
  field: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldActive: {
    borderColor: '#F28C00',
    backgroundColor: '#FFFDFC',
  },
  fieldText: {
    flex: 1,
    color: '#222',
    fontWeight: '500',
  },
  placeholder: {
    color: '#AAA',
    fontWeight: '400',
  },
  cursor: {
    width: 2,
    backgroundColor: '#F28C00',
    marginLeft: 6,
    borderRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTxt: {
    color: '#262626',
    fontWeight: '500',
  },
  keyRow: {
    flexDirection: 'row',
  },
  key: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.10)',
    elevation: 1,
  },
  specKey: {
    backgroundColor: '#D7DCE3',
    flex: 1.2,
  },
  keyTxt: {
    color: '#222',
    fontWeight: '500',
  },
  specTxt: {
    color: '#4A4A4A',
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  delBtn: {
    backgroundColor: 'rgba(215,199,199,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contBtn: {
    flex: 1,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  contBtnDisabled: {
    opacity: 0.5,
  },
  contTxt: {
    color: '#fff',
    fontWeight: '800',
  },
});

export default LogbookEditScreen;