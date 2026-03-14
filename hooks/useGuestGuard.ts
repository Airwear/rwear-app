import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

/**
 * Retourne un état de modal + un wrapper qui bloque l'action si l'utilisateur est invité.
 *
 * Usage:
 *   const { guestModalVisible, requireAuth, closeGuestModal } = useGuestGuard();
 *   ...
 *   <Pressable onPress={() => requireAuth(() => doSomething())} />
 *   <GuestConversionModal visible={guestModalVisible} onClose={closeGuestModal} />
 */
export function useGuestGuard() {
  const { isGuest } = useAuth();
  const [guestModalVisible, setGuestModalVisible] = useState(false);

  const requireAuth = useCallback(
    (action?: () => void) => {
      if (isGuest) {
        setGuestModalVisible(true);
        return;
      }
      action?.();
    },
    [isGuest]
  );

  const closeGuestModal = useCallback(() => setGuestModalVisible(false), []);

  return { isGuest, guestModalVisible, requireAuth, closeGuestModal };
}
