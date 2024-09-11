import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings, selectSettings } from '../store/settingsSlice';
import { trpc } from '../utils/trpc';

export const useSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useContext();
  const updateSettingsMutation = trpc.useMutation('settings.update', {
    onSuccess: () => {
      utils.invalidateQueries('settings');
      setIsLoading(false);
      setError(null);
    },
    onError: (err) => {
      setIsLoading(false);
      setError(err.message);
    },
  });

  const handleSettingsChange = useCallback(
    (updatedSettings: typeof settings) => {
      dispatch(updateSettings(updatedSettings));
    },
    [dispatch]
  );

  const saveSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await updateSettingsMutation.mutateAsync({ settings });
    } catch (err) {
      console.error(err);
    }
  }, [updateSettingsMutation, settings]);

  return {
    settings,
    isLoading,
    error,
    handleSettingsChange,
    saveSettings,
  };
};