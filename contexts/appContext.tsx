import {createContext, useContext, useMemo} from 'react';
import { useTranslation } from 'react-i18next';
// import { useAuth } from '@/contexts';

type AppContext = {
    label: any
}

const AppContext = createContext<AppContext>({
    label: {}
});

function AppProvider({children}: React.PropsWithChildren) {

    // const {authData} = useAuth();
    const { t } = useTranslation();

    const label = useMemo(() => ({
        navigation: {
            home: t('navigation.home'),
            search: t('navigation.search'),
            setting: t('navigation.setting'),
            preferences: t('navigation.preferences'),
            messages: t('navigation.messages'),
            documents: t('navigation.documents'),
            account: t('navigation.account'),
            help: t('navigation.help'),
            my_space: t('navigation.my_space'),
            school_life: t('navigation.school_life'),
            agenda: t('navigation.agenda'),
        },
        user: {
            login: t('user.login'),
            username: t('user.username'),
            email: t('user.email'),
            emailAddress: t('user.emailAddress'),
            password: t('user.password'),
            phone: t('user.phone'),
            forget_password: t('user.forget_password'),
        },
        action: {
            submit: t('action.submit'),
            save: t('action.save'),
            validate: t('action.validate'),
            login: t('action.login'),
            new_account: t('action.new_account'),
        },
        auth: {
            text_code: t('auth.text_code'),
            code: t('auth.code'),
        },
    }), [t])

    //console.log('AppContext', label);

    return <AppContext.Provider value={{label}}>
        {children}
    </AppContext.Provider>
}

function useApp(): AppContext {

    const context = useContext(AppContext);

    if (! context) {
        throw new Error('useAssist must be used within an SinisterProvider');
    }

    return context;
}

export {AppProvider, useApp, AppContext}
