import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { FlexContainer, Loader } from '@/components';
import { CallControlButton } from '@/src/features/services/components/CallControlButton';
import {
  hydrateMessagingState,
  isMessagingStateHydrated,
  useMessagingStateSnapshot,
} from '@/src/features/services/stores/servicesMessagingStore';
import { ServiceCallMode, ServiceCallUiState } from '@/src/features/services/types';

type ServiceCallScreenProps = {
  conversationId: string;
  mode: ServiceCallMode;
};

function getModeLabel(mode: ServiceCallMode) {
  return mode === 'video' ? 'Appel video' : 'Appel vocal';
}

export function ServiceCallScreen({ conversationId, mode }: ServiceCallScreenProps) {
  const router = useRouter();
  const { conversations } = useMessagingStateSnapshot();
  const [loading, setLoading] = React.useState(!isMessagingStateHydrated());
  const [uiState, setUiState] = React.useState<ServiceCallUiState>({
    mode,
    lifecycle: 'waiting_for_service',
    microphoneEnabled: true,
    cameraEnabled: true,
  });
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const bg = isDark ? '#0D1117' : '#EEF2F7';
  const panel = isDark ? '#151B23' : '#FFFFFF';
  const border = isDark ? '#2A3442' : '#DFE6EF';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#A9B5C4' : Colors.muted;

  React.useEffect(() => {
    if (isMessagingStateHydrated()) {
      setLoading(false);
      return;
    }

    hydrateMessagingState().finally(() => {
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    setUiState((prev) => ({
      ...prev,
      mode,
      cameraEnabled: mode === 'video' ? prev.cameraEnabled : false,
    }));
  }, [mode]);

  const conversation = React.useMemo(
    () => conversations.find((item) => item.id === conversationId) || null,
    [conversations, conversationId],
  );

  const toggleMicrophone = () => {
    setUiState((prev) => ({
      ...prev,
      microphoneEnabled: !prev.microphoneEnabled,
    }));
  };

  const toggleCamera = () => {
    if (mode !== 'video') {
      return;
    }

    setUiState((prev) => ({
      ...prev,
      cameraEnabled: !prev.cameraEnabled,
    }));
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
        <View style={[styles.missingCard, { backgroundColor: panel, borderColor: border }]}>
          <Text style={[styles.missingTitle, { color: text }]}>Conversation introuvable</Text>
          <Text style={[styles.missingText, { color: muted }]}>Impossible de preparer l'interface d'appel sans conversation associee.</Text>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed ? styles.backButtonPressed : null]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Retour a la conversation</Text>
          </Pressable>
        </View>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer color={bg}>
      <View style={styles.container}>
        <View style={[styles.headerCard, { backgroundColor: panel, borderColor: border }]}>
          <View style={[styles.avatarWrap, { borderColor: border }]}>
            {conversation.professionalAvatarUrl ? (
              <Image source={{ uri: conversation.professionalAvatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: isDark ? '#1E2632' : '#EEF2F7' }]}>
                <FontAwesome name="user" size={22} color={muted} />
              </View>
            )}
          </View>

          <View style={styles.headerTextWrap}>
            <Text style={[styles.professionalName, { color: text }]} numberOfLines={1}>
              {conversation.professionalName}
            </Text>
            <Text style={[styles.modeLabel, { color: muted }]}>{getModeLabel(uiState.mode)}</Text>
            <Text style={[styles.availabilityBadge, { color: Colors.warning }]}>Disponible apres integration du service d'appels</Text>
          </View>
        </View>

        {mode === 'video' ? (
          <View style={[styles.videoStage, { backgroundColor: panel, borderColor: border }]}>
            <View style={[styles.remotePreview, { borderColor: border }]}>
              <FontAwesome name="video-camera" size={28} color={muted} />
              <Text style={[styles.previewTitle, { color: text }]}>Zone video du correspondant</Text>
              <Text style={[styles.previewSub, { color: muted }]}>Le flux video distant apparaitra ici apres integration WebRTC.</Text>
            </View>

            <View style={[styles.localPreview, { borderColor: border, backgroundColor: isDark ? '#1B232F' : '#F4F7FB' }]}>
              <FontAwesome name="camera" size={16} color={muted} />
              <Text style={[styles.localPreviewText, { color: muted }]}>Apercu local</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.voiceStage, { backgroundColor: panel, borderColor: border }]}>
            <FontAwesome name="phone" size={34} color={Colors.orange} />
            <Text style={[styles.voiceTitle, { color: text }]}>Interface d'appel vocal prete</Text>
            <Text style={[styles.voiceSub, { color: muted }]}>La communication audio reelle sera disponible avec le service d'appels.</Text>
          </View>
        )}

        <View style={[styles.controlsCard, { backgroundColor: panel, borderColor: border }]}>
          <Text style={[styles.controlsTitle, { color: text }]}>Commandes</Text>
          <View style={styles.controlsRow}>
            <CallControlButton
              label={uiState.microphoneEnabled ? 'Micro (etat visuel)' : 'Micro coupe (etat visuel)'}
              iconName={uiState.microphoneEnabled ? 'microphone' : 'microphone-slash'}
              onPress={toggleMicrophone}
              active={uiState.microphoneEnabled}
            />

            {mode === 'video' ? (
              <CallControlButton
                label={uiState.cameraEnabled ? 'Camera (etat visuel)' : 'Camera coupee (etat visuel)'}
                iconName={uiState.cameraEnabled ? 'camera' : 'video-camera'}
                onPress={toggleCamera}
                active={uiState.cameraEnabled}
              />
            ) : null}

            <CallControlButton
              label="Raccrocher"
              iconName="phone"
              variant="danger"
              onPress={() => router.back()}
            />
          </View>
        </View>

        <Text style={[styles.footerInfo, { color: muted }]}>Aucun appel reel n'est etabli dans cette version. L'etat de connexion sera active apres integration du moteur de communication.</Text>
      </View>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 12,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    overflow: 'hidden',
    borderWidth: 1,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  professionalName: {
    fontSize: 18,
    fontWeight: '800',
  },
  modeLabel: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
  },
  availabilityBadge: {
    marginTop: 7,
    fontSize: 12,
    fontWeight: '700',
  },
  videoStage: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 10,
    minHeight: 250,
    justifyContent: 'center',
  },
  remotePreview: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    minHeight: 220,
  },
  previewTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  previewSub: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  localPreview: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 110,
    height: 72,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  localPreviewText: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
  },
  voiceStage: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 210,
  },
  voiceTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  voiceSub: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  controlsCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  controlsTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  footerInfo: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 18,
  },
  missingCard: {
    borderWidth: 1,
    borderRadius: 18,
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
  },
  missingTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  missingText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  backButton: {
    marginTop: 14,
    backgroundColor: Colors.orange,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  backButtonPressed: {
    opacity: 0.92,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
});