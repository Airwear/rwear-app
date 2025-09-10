import {createContext, useContext} from 'react';
import Strings from '@/constants/Strings';
// import { useAuth } from '@/contexts';

type AppContext = {
    label: any
}

const AppContext = createContext<AppContext>({
    label: {}
});

function AppProvider({children}: React.PropsWithChildren) {

    // const {authData} = useAuth();
    const label = Strings['fr']

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
