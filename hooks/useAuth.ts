//A simple hooks to facilitate the access to the AuthContext

import {AuthContext} from "@/contexts";
import { AuthContextType } from "@/utils/type-def";
import { useContext } from "react";

// and permit components to subscribe to AuthContext updates
export function useAuth(): AuthContextType {

    const context = useContext(AuthContext);
    
  
    if (! context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
  
    return context;
}
  