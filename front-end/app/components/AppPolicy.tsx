import { apiRoutes } from '@/services/api';
import React from 'react'
import {useWindowDimensions} from 'react-native'
import RenderHtml from 'react-native-render-html'

const source = {
    html: `
        <p style='text-align:center;'>
          En validant ce formulaire, vous acceptez nos <a href="${apiRoutes.URL_CGU}" style="color: red">conditions d'utilisations</a> de l'application 
          ainsi que nos <a href="${apiRoutes.URL_POLICY}" style="color: red">politiques de confidentialité</a>
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
