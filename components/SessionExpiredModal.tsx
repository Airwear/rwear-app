import React from 'react';
import { Modal, Text, Button, View } from 'react-native';

export default function SessionExpiredModal({ visible, onReconnect }: { visible: boolean, onReconnect: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor:'#fff', padding:24, borderRadius:8, alignItems:'center' }}>
          <Text style={{ fontWeight:'bold', fontSize:18, marginBottom:12 }}>Session expirée</Text>
          <Text style={{ marginBottom:20 }}>Votre session a expiré, veuillez vous reconnecter pour continuer.</Text>
          <Button title="Se reconnecter" onPress={onReconnect} />
        </View>
      </View>
    </Modal>
  );
}