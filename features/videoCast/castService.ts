import GoogleCast, { CastSession, MediaMetadata, MediaType } from 'react-native-google-cast'

export type CurrentMedia = {
  url: string
  contentType?: 'application/x-mpegURL' | 'video/mp4' | 'application/dash+xml'
  title?: string
  imageUrl?: string
  position?: number
}

export async function ensureSession(): Promise<CastSession | null> {
  try {
    const state = await GoogleCast.getCastState()
    if (state) {
      // show chooser to connect if needed
      await GoogleCast.showCastDialog()
      return GoogleCast.getCastSession()
    }
  } catch {}
  return GoogleCast.getCastSession()
}

export async function startCasting(media: CurrentMedia) {
  const metadata: MediaMetadata = {
    type: MediaType.MOVIE,
    title: media.title || 'Lecture',
    images: media.imageUrl ? [{ url: media.imageUrl }] : undefined,
  }

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
    imageUrl: media.imageUrl,
    title: metadata.title,
    subtitle: undefined,
    contentType,
    streamType: 'BUFFERED',
    metadata,
    playPosition: media.position || 0,
    autoplay: true,
  })
}

export async function pause() { try { await GoogleCast.pause() } catch {} }
export async function play() { try { await GoogleCast.play() } catch {} }
export async function stop() { try { await GoogleCast.stop() } catch {} }
export async function seek(position: number) { try { await GoogleCast.seek(position) } catch {} }
