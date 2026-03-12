import { Text,  StyleSheet, View, ScrollView} from 'react-native';
import { AppPolicy, FlexContainer, ForgetPasswordLink, Form, ImageViewer, Loader, Title, } from '@/components';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { ButtonSimple } from '@/components/buttons';
import {useApp, useAuth} from '@/hooks';
import { icons } from '@/utils';

export default function RegisterScreen() {

  const navigation = useNavigation();
  const {  register, registering, error } = useAuth();
  const { label } = useApp();

  const [values, setValues] = useState<any>({
    login: undefined,
    email: undefined,
    password: undefined,
  })

  const handleChange = (value: string, target : 'login' | 'password' | 'email') => {
    setValues({
      ...values,
      [target]: value
    })
  }

  const handleSubmit = () => {
    const {email, password, login} = values
    if(email !== undefined && password !== undefined && login !== undefined) {
      register(email, login, password)
    }
  }

  useEffect(() => {
    navigation.setOptions({ 
      title: label.action.new_account
    });
  }, [navigation]);

  return (
    <FlexContainer color={Colors.white} push>

      <ImageViewer 
        placeholderImageSource={icons.logo} 
        width={125}
        height={125}

      />

      <View style={styles.container}>

        <ScrollView>

            {error.length > 0 && <Title text={error} color={Colors.danger} size={15} />}

            <Form.Input 
              label={label.user.username} 
              value={values['login']}
              placeholder={label.user.username}
              onChangeText={(value: string) => handleChange(value, 'login')}
              error={undefined}
            />

            <Form.Input 
              label={label.user.email} 
              value={values['email']}
              placeholder={label.user.emailAddress}
              onChangeText={(value: string) => handleChange(value, 'email')}
              error={undefined}
            />

            <Form.InputPassword 
              label={label.user.password} 
              placeholder={label.user.password}
              value={values['password']}
              onChangeText={(value: string) => handleChange(value, 'password')}
              error={undefined}
              secureTextEntry
            />

            {/** <ForgetPasswordLink /> */}
            
            <View style={{height: 20}} />

            <ButtonSimple 
              text={label.action.submit}
              color={Colors.primary}
              onPress={handleSubmit}
              showIndicator={registering}
            />
           <AppPolicy />
        </ScrollView>
      
      </View>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 16,
    //justifyContent: 'center'
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    color: Colors.muted,
    fontSize: 17
  },

  new: {
    fontWeight: 'bold',
    color: Colors.green
  },

  buttonAction: {
    padding: 4
  },
});
