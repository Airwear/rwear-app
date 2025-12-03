import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import GoogleCast, { CastState } from 'react-native-google-cast'

type Props = {
  getCurrentMedia: () => {
    url: string
    contentType?: 'application/x-mpegURL' | 'video/mp4' | 'application/dash+xml'
    title?: string
    imageUrl?: string
    position?: number
  } | null
}

export default function CastButton({ getCurrentMedia }: Props) {
  const [castState, setCastState] = useState<CastState>(CastState.NOT_CONNECTED)

  useEffect(() => {
    GoogleCast.getCastState().then(setCastState).catch(() => {})
  }, [])

  const onPress = async () => {
    // Always show the device chooser; if already connected, we will launch media
    try {
      const media = getCurrentMedia?.()
      if (!media) return

      // Détection du type de contenu si non fourni
      let contentType = media.contentType;
      if (!contentType) {
        const u = (media.url || '').toLowerCase();
        const isHls = u.endsWith('.m3u8') || u.includes('m3u8');
        const isDash = u.endsWith('.mpd') || u.includes('manifest.mpd') || u.includes('/dash');
        const isMp4 = u.endsWith('.mp4') || u.includes('.mp4');
        contentType = isHls
          ? 'application/x-mpegURL'
          : isDash
            ? 'application/dash+xml'
            : isMp4
              ? 'video/mp4'
              : 'video/mp4';
      }

      await GoogleCast.castMedia({
        mediaUrl: media.url,
        title: media.title || 'Lecture',
        contentType,
      } as any)
    } catch (e) {
      // swallow errors to avoid disrupting UX
    }
  }

  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="button" style={styles.button}>
      <View>
        <MaterialIcons
          name={castState === CastState.CONNECTED ? 'cast-connected' : 'cast'}
          size={24}
          color={castState === CastState.CONNECTED ? '#1e88e5' : '#444'}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 8, paddingVertical: 4 },
})
