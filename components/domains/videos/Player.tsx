import { View, StyleSheet, Platform } from "react-native";
import { VideoRawType } from "@/utils/type-def";
import { Video, AVPlaybackStatus, VideoReadyForDisplayEvent, VideoFullscreenUpdateEvent, ResizeMode } from 'expo-av';
import { useEffect, useRef, useState, useCallback } from "react";
import Loader from "@/components/Loader";
import { _get, _post, apiRoutes } from "@/services/api";
import { useAuth } from "@/contexts";
import * as ScreenOrientation from "expo-screen-orientation";
import { TimeUpdateEventPayload, useVideoPlayer, VideoView } from 'expo-video';
import { useEventListener } from "expo";
import { useFocusEffect } from 'expo-router';

export default function Player(video: VideoRawType) {

    const player = useRef<any>(undefined);
    const timer = useRef<any>(undefined);
    const slug = useRef<any>(undefined);
    const {authData} = useAuth(); 

    const [status, setStatus] = useState<any>({});
    const [ready, isReady] = useState<boolean>(false);

    const mPlayer = useVideoPlayer(video.url as string, player => {
        player.showNowPlayingNotification = false;
        // player.currentTime = 10;
        //player.play();
    });
    
    useEventListener(mPlayer, 'timeUpdate', (timeUpdate: TimeUpdateEventPayload) => {
        console.log('Player status changed: ', timeUpdate.currentTime);
    });

    useEventListener(mPlayer, 'statusChange', ({ status, error }) => {
        isReady(status === 'readyToPlay');
        console.log('Player status changed: ', status);
    });

    const _onLoad = (status: AVPlaybackStatus) => {
        console.log('current status', status.isLoaded);
    }

    const _onReadyForDisplay = (event: VideoReadyForDisplayEvent) => {
        isReady(Boolean(event?.status?.isLoaded))
    }

    const _onLoadStart = () => {
        console.log('_onLoadStart', true)
    }


    const onFullscreenUpdate = async ({fullscreenUpdate}: VideoFullscreenUpdateEvent) => {

        if(Platform.OS === 'android') {
            switch (fullscreenUpdate) {
                //@ts-ignore
                case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
                    await ScreenOrientation.unlockAsync() // only on Android required
                    break;
                //@ts-ignore
                case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT) // only on Android required
                    break;
            }
        } else {
            console.log('On Iphone');
        }
        
    }

    const _onPlaybackStatusUpdate = (playbackStatus: any) => {

        console.log(`_onPlaybackStatusUpdate`);
        console.log(playbackStatus);

        timer.current = playbackStatus.positionMillis
        slug.current = video.slug

    }

    useFocusEffect(
        useCallback(() => {
          console.log("Hello, I'm focused!");
          // Return function is invoked whenever the route gets out of focus.
          return () => {
            console.log('This route is now unfocused.', player);
          };

        }, [])
    );

    useEffect(() => {

        const _reporting = async (userId: any, time: number) => {

            const controller = new AbortController();
            let url = apiRoutes.trainings + '/' + slug?.current + '/reporting';
        
            _post(url, {user_id: userId, spend_time: time}, controller)
            .catch(error => {
                console.log('error', error.message)
            })
            .finally(() => console.log('_reporting finally')) 
        };

        return () => {

            if(timer.current !== undefined) {
                //_reporting(authData?.id, timer.current);
                console.log('God Bye !!!', timer.current);
            }
        }
    }, [])

    return (
        <View style={styles.container}>
            
            {! ready && <Loader visible />}
            {video.url && (
                <Video
                    style={styles.video}
                    ref={player}
                    source={{
                        uri: video.url
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping={false}
                    onLoad={_onLoad}
                    onLoadStart={_onLoadStart}
                    onReadyForDisplay={_onReadyForDisplay}
                    onPlaybackStatusUpdate={_onPlaybackStatusUpdate}
                    onFullscreenUpdate={onFullscreenUpdate}
                />
            )} 
            
            {/** <VideoView 
                style={styles.video} 
                player={player} 
                allowsFullscreen 
                allowsPictureInPicture 
                
            />*/}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    video: {
       flex: 1 
    },
})