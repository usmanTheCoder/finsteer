import { Socket, io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateTransaction, deleteTransaction } from '@/store/transactionsSlice';
import { updateAccount, deleteAccount } from '@/store/accountsSlice';
import { showNotification } from '@/services/notifications';

let socket: Socket | null = null;

export const initSocketConnection = () => {
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
    reconnectionDelayMax: 10000,
    auth: {
      token: 'abcd1234',
    },
    query: {
      'my-key': 'my-value',
    },
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('update-transaction', (data) => {
    const dispatch = useAppDispatch();
    dispatch(updateTransaction(data));
    showNotification('Transaction updated', 'success');
  });

  socket.on('delete-transaction', (id) => {
    const dispatch = useAppDispatch();
    dispatch(deleteTransaction(id));
    showNotification('Transaction deleted', 'warning');
  });

  socket.on('update-account', (data) => {
    const dispatch = useAppDispatch();
    dispatch(updateAccount(data));
    showNotification('Account updated', 'success');
  });

  socket.on('delete-account', (id) => {
    const dispatch = useAppDispatch();
    dispatch(deleteAccount(id));
    showNotification('Account deleted', 'warning');
  });
};

export const useSocketConnection = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      initSocketConnection();
      setConnected(true);
    }

    const handleDisconnect = () => {
      setConnected(false);
    };

    socket?.on('disconnect', handleDisconnect);

    return () => {
      socket?.off('disconnect', handleDisconnect);
    };
  }, []);

  return connected;
};

export const emitSocketEvent = (eventName: string, data: any) => {
  if (socket) {
    socket.emit(eventName, data);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};