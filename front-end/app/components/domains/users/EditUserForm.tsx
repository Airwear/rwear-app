import { Form, Indicator, RequiredInfo, Title, } from "@/components";
import { ButtonSimple } from "@/components/buttons";
import Colors from "@/constants/Colors";
import { useApp } from "@/contexts";
import { useAuth } from "@/contexts/authContext";
// import { useFBM } from "@/contexts/fbmContext";
import { AuthDataType } from "@/utils/type-def";
import { useState } from "react";

export default function EditUserForm () {

    const {update, error, message, updating, authData} = useAuth();
    const {label} = useApp()

    //const {token} = useFBM()
    const token = 'no-fire-base';

    const [values, setValues] = useState<any>({
        email: authData?.email,
        username: authData?.username,
        phone: authData?.phone,
    });

    const handleChange = (value: string, target : 'email' | 'username' | 'phone') => {
        setValues({
        ...values,
        [target]: value
        })
    }

    const _handleSubmit = () => {
        if(values.email?.length === 0) {
            return null
        }
        update({...values, fbm_token: token, id: String(authData?.id), slug: authData?.slug });
    }

    return (
        <>
        <Title text={message} color={Colors.green} size={17} />
        <Title text={error} color={Colors.danger} size={17} />

        <Form.InputWithIcon 
            label={label.user.username} 
            value={values['username']}
            placeholder=''
            onChangeText={(value: string) => handleChange(value, 'username')}
            error={undefined}
            required
            iconName='user'
        />

        <Form.InputWithIcon 
            label={label.user.email}
            value={values['email']}
            placeholder=''
            onChangeText={(value: string) => handleChange(value, 'email')}
            error={undefined}
            required
            iconName='envelope'
        />

        <Form.InputWithIcon 
            label={label.user.phone} 
            value={values['phone']}
            placeholder=''
            onChangeText={(value: string) => handleChange(value, 'phone')}
            error={undefined}
            keyboardType='number-pad'
            required
            iconName='phone'
            info="We prefere your WhatsApp phone number"
        />

        <RequiredInfo />

        <ButtonSimple 
            text={label.action.save}
            color={Colors.green}
            onPress={_handleSubmit}
            showIndicator={updating}
        />
    </>)
}