import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Hapus bagian interface ini jika kamu pakai .js biasa (bukan TypeScript)
interface ConfirmationModalProps {
  visible: boolean;
  type: 'add' | 'delete' | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationModal({ visible, type, onClose, onConfirm }: ConfirmationModalProps) {
  
  if (!type) return null; 

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-[80%] rounded-3xl p-6 items-center shadow-lg">
          
          <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
            type === 'delete' ? 'bg-primary-400' : 'bg-third-500'
          }`}>
            <Ionicons 
              name={type === 'delete' ? 'trash' : 'add-circle'} 
              size={36} 
              color='white'
            />
          </View>

          <Text className="text-xl font-bold text-black mb-2 text-center">
            {type === 'delete' ? 'Remove Recipe?' : 'Add to Meal Plan?'}
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            {type === 'delete'
              ? 'Are you sure you want to remove this recipe?'
              : 'Are you sure you want to add this recipe?'}
          </Text>

          <View className="flex-row w-full justify-between">
            <TouchableOpacity 
              className="flex-1 bg-gray-100 py-3 rounded-xl mr-2 items-center"
              onPress={onClose}
            >
              <Text className="text-gray-600 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 py-3 rounded-xl ml-2 items-center ${
                type === 'delete' ? 'bg-primary-400' : 'bg-third-500'
              }`}
              onPress={onConfirm}
            >
              <Text className="text-white font-bold">Confirm</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}