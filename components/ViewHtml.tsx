import React from 'react'
import {useWindowDimensions} from 'react-native'
import RenderHtml from 'react-native-render-html'


export default function ViewHtml({text}: any) {
  const { width } = useWindowDimensions();

  const source = {
    html: text
  };

  return (
      <>
        <RenderHtml contentWidth={width} source={source} />
      </>
  );
}
