import { StyleSheet, Image, View, Platform, useColorScheme } from 'react-native';

export default function ImageViewer({ placeholderImageSource, width = '100%', height= 100, bottomRadius = false, isLogo = false}: any) {
  
  const isDark = useColorScheme() === 'dark';

  let variants: any = {
    width: width, 
    height: height
  }

  if(! bottomRadius) {
    variants = {
        ...variants,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    }
  }

  const img = <Image source={placeholderImageSource} style={[styles.image, {...variants}]} />;

  if (isLogo && isDark) {
    return (
      <View style={[styles.logoWrapper, { width: width, height: height }]}>
        {img}
      </View>
    );
  }

  return img;
}

const styles = StyleSheet.create({
  image: {
    height: 100,
    borderRadius: 18,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logoWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    alignSelf: 'center',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
