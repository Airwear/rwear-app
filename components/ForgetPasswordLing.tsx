import { webRoutes } from '@/services/api'
import React from 'react'
import {useWindowDimensions} from 'react-native'
import RenderHtml from 'react-native-render-html'

const source = {
    html: `
        <a href="${webRoutes.URL_PASSWORD_RESET}">Mot de passe oublié ?</a>
    `
}

const ForgetPasswordLink = () => {
  const { width } = useWindowDimensions();

  return (
      <RenderHtml
          contentWidth={width}
          source={source}
      />
  );
}

export default ForgetPasswordLink
