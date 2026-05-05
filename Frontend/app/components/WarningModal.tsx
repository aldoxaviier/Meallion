import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface WarningModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  isAlertOnly?: boolean;
  confirmText?: string;
  confirmColor?: string;
}

export const WarningModal = ({ visible, onClose, onConfirm, title, message, isLoading = false, isAlertOnly = false, confirmText = "Delete", confirmColor = "bg-red-500" }: WarningModalProps) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-4">
        <View className="bg-white rounded-2xl w-full max-w-sm p-6 items-center shadow-lg">
          <Text className="text-xl font-brsegma-600 text-gray-900 mb-2 text-center">{title}</Text>
          <Text className="text-sm font-brsegma-500 text-gray-500 text-center mb-6">{message}</Text>

          <View className="flex-row gap-3 w-full">
            {!isAlertOnly && (
              <TouchableOpacity
                className="flex-1 py-3 rounded-xl bg-gray-200 items-center justify-center"
                onPress={onClose}
                disabled={isLoading}
              >
                <Text className="text-gray-700 font-brsegma-500">Cancel</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl ${confirmColor} items-center justify-center`}
              onPress={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-brsegma-500">{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};