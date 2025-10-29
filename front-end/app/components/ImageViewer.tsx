import { StyleSheet, Image, Platform } from 'react-native';

export default function ImageViewer({ placeholderImageSource, width = '100%', height= 100, bottomRadius = false}: any) {
  
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

  return <Image source={placeholderImageSource} style={[styles.image, {...variants}]} />;
}

const styles = StyleSheet.create({
  image: {
    height: 100,
    borderRadius: 18,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
