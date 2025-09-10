//A simple hooks to facilitate the access to the AuthContext

import {AppContext} from "@/contexts/appContext";
import { useContext } from "react";

// and permit components to subscribe to AuthContext updates
export function useApp(): any {

    const context = useContext(AppContext);
    
    if (! context) {
      throw new Error('useApp must be used within an AuthProvider');
    }
  
    return context;
}
  