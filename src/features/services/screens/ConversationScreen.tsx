import React from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { FlexContainer, Loader } from '@/components';
import { MessageBubble } from '@/src/features/services/components/MessageBubble';
import { useConversationThread } from '@/src/features/services/hooks/useServiceConversations';
import { ServiceCallMode } from '@/src/features/services/types';

export function ConversationScreen({ conversationId }: { conversationId: string }) {
  const { conversation, messages, loading, sending, sendMessage } = useConversationThread(conversationId);
  const [draft, setDraft] = React.useState('');
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const listRef = React.useRef<FlatList>(null);
  const isNearBottomRef = React.useRef(true);
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const bg = isDark ? Colors.dark.background : Colors.light.background;
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;
  const inputBg = isDark ? '#1A1F25' : '#FCFCFD';
  const KeyboardContainer = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const keyboardContainerProps: KeyboardAvoidingViewProps | undefined = Platform.OS === 'ios'
    ? {
        behavior: 'padding',
        keyboardVerticalOffset: 88,
      }
    : undefined;

  // Android réel: on compense explicitement la hauteur du clavier.
  // Cette correction évite le recouvrement du composer et reste locale à cet écran.
  // Dominik
  const androidKeyboardOffset = Platform.OS === 'android' ? keyboardHeight : 0;

  const scrollToLatest = React.useCallback((animated: boolean) => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated });
    });
  }, []);

  const handleListScroll = React.useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceToBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    isNearBottomRef.current = distanceToBottom < 48;
  }, []);

  React.useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const showSub = Keyboard.addListener('keyboardDidShow', (event) => {
      const nextHeight = event?.endCoordinates?.height ?? 0;
      setKeyboardHeight((prev) => (prev === nextHeight ? prev : nextHeight));
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight((prev) => (prev === 0 ? prev : 0));
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  React.useEffect(() => {
    if (!conversation) {
      return;
    }

    navigation.setOptions({
      title: conversation.professionalName,
      headerBackTitle: 'Retour',
    });
  }, [conversation, navigation]);

  React.useEffect(() => {
    if (!messages.length) {
      return;
    }

    if (isNearBottomRef.current) {
      scrollToLatest(false);
    }
  }, [messages.length, scrollToLatest]);

  const canSend = draft.trim().length > 0 && !sending;

  const openCallScreen = (mode: ServiceCallMode) => {
    if (!conversation) {
      return;
    }

    const encodedConversationId = encodeURIComponent(conversation.id);
    router.push(`/services/messages/${encodedConversationId}/call?mode=${mode}`);
  };

  const handleSend = async () => {
    const messageText = draft.trim();
    if (!messageText) {
      return;
    }

    const nextMessage = await sendMessage(messageText);
    if (!nextMessage) {
      return;
    }

    setDraft('');
    scrollToLatest(true);
  };

  if (loading) {
    return (
      <FlexContainer color={bg}>
        <Loader visible />
      </FlexContainer>
    );
  }

  if (!conversation) {
    return (
      <FlexContainer color={bg}>
        <View style={[styles.missingCard, { backgroundColor: surface, borderColor: border }]}>
          <Text style={[styles.missingTitle, { color: text }]}>Conversation introuvable</Text>
          <Text style={[styles.missingText, { color: muted }]}>Cette conversation n’existe pas ou n’est plus disponible localement.</Text>
        </View>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer color={bg}>
      <KeyboardContainer
        style={[
          styles.keyboardWrap,
          Platform.OS === 'android' ? { paddingBottom: androidKeyboardOffset } : null,
        ]}
        {...keyboardContainerProps}
      >
        <View style={[styles.bookingCard, { backgroundColor: surface, borderColor: border }]}>
          <Text style={[styles.bookingTitle, { color: text }]} numberOfLines={1}>{conversation.offeringTitle}</Text>
          <Text style={[styles.bookingSub, { color: muted }]} numberOfLines={1}>Rendez-vous {conversation.bookingId}</Text>

          <View style={styles.callActionsRow}>
            <Pressable
              onPress={() => openCallScreen('voice')}
              style={({ pressed }) => [
                styles.callAction,
                {
                  backgroundColor: isDark ? '#1A212C' : '#F4F7FB',
                  borderColor: border,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Ouvrir l'interface d'appel vocal"
            >
              <FontAwesome name="phone" size={14} color={Colors.orange} />
              <Text style={[styles.callActionText, { color: text }]}>Appel vocal</Text>
            </Pressable>

            <Pressable
              onPress={() => openCallScreen('video')}
              style={({ pressed }) => [
                styles.callAction,
                {
                  backgroundColor: isDark ? '#1A212C' : '#F4F7FB',
                  borderColor: border,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Ouvrir l'interface d'appel vidéo"
            >
              <FontAwesome name="video-camera" size={14} color={Colors.orange} />
              <Text style={[styles.callActionText, { color: text }]}>Appel video</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.messagesWrap}>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleListScroll}
            scrollEventThrottle={16}
            nestedScrollEnabled={false}
            // On garde le clavier ouvert pendant les interactions avec la liste sur Android.
            keyboardShouldPersistTaps="always"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}
          />
        </View>

        <View style={[styles.composer, { backgroundColor: surface, borderTopColor: border }]}>
          <View style={[styles.inputWrap, { backgroundColor: inputBg, borderColor: border }]}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Votre message"
              placeholderTextColor={muted}
              style={[styles.input, { color: text }]}
              multiline
              maxLength={800}
              textAlignVertical="top"
            />
          </View>

          <Pressable
            onPress={() => {
              handleSend().catch(() => {});
            }}
            disabled={!canSend}
            style={({ pressed }) => [
              styles.sendButton,
              {
                backgroundColor: canSend ? Colors.orange : '#C8CDD3',
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <FontAwesome name="send" size={16} color={Colors.white} />
          </Pressable>
        </View>
      </KeyboardContainer>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  keyboardWrap: {
    flex: 1,
  },
  messagesWrap: {
    flex: 1,
    minHeight: 0,
  },
  messagesList: {
    flex: 1,
  },
  bookingCard: {
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 12,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bookingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  bookingSub: {
    marginTop: 3,
    fontSize: 12,
  },
  callActionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  callAction: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 10,
  },
  callActionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  messagesContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  composer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 54,
    maxHeight: 150,
  },
  input: {
    fontSize: 14,
    minHeight: 32,
    maxHeight: 120,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  missingCard: {
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 12,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  missingTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  missingText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
});