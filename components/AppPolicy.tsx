import { apiRoutes } from '@/services/api';
import React from 'react'
import {useWindowDimensions} from 'react-native'
import RenderHtml from 'react-native-render-html'

const source = {
    html: `
        <p style='text-align:center; color:#6f7782; font-size:12px; line-height:18px; margin-top:10px; margin-bottom:2px;'>
          En validant ce formulaire, vous acceptez nos <a href="${apiRoutes.URL_CGU}" style="color:#111111; font-weight:700; text-decoration:none;">conditions d'utilisations</a> de l'application 
          ainsi que nos <a href="${apiRoutes.URL_POLICY}" style="color:#111111; font-weight:700; text-decoration:none;">politiques de confidentialité</a>
        </p>`
};


const AppPolicy = () => {
  const { width } = useWindowDimensions();

  return (
      <RenderHtml
          contentWidth={width}
          source={source}
      />
  );
}

export default AppPolicy
