// src/app/RoomsClientConnector.tsx
import { useEffect } from 'react';
import { roomsClient } from '@/features/roomsClient';
import { useToast } from '@/components/ui';

/**
 * A non-visual component responsible for connecting the roomsClient
 * to the toast notification system provided by ToastProvider.
 */
export function RoomsClientConnector() {
  const { showToast } = useToast();

  useEffect(() => {
    // Set the callback on the singleton client instance
    roomsClient.setToastCallback(showToast);

    // Clean up on unmount (optional, as client is a singleton)
    return () => {
      roomsClient.setToastCallback(() => {});
    };
  }, [showToast]);

  return null; // This component does not render anything
}
