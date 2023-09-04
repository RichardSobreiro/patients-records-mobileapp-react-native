import { Colors } from '../../../constants/styles';
import React, { useCallback } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type Props = {
  text: string;
  open: boolean;
  setOpen: (openState: boolean) => void;
  startDate: Date | undefined;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  endDate: Date | undefined;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

const DateRangePicker: React.FC<Props> = ({
  text,
  open,
  setOpen,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}: Props) => {
  const onDismiss = useCallback(() => {
    setOpen(false);
    setStartDate(undefined);
    setEndDate(undefined);
  }, [setOpen, setStartDate, setEndDate]);

  const onConfirm = useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);
      setStartDate(startDate);
      setEndDate(endDate);
    },
    [setOpen, setStartDate, setEndDate]
  );

  return (
    <>
      <View
        style={{ alignContent: 'center', justifyContent: 'center', flex: 1, alignItems: 'center' }}
      >
        <Text
          style={{
            color: Colors.primary500
          }}
        >
          {text}
        </Text>
      </View>
      <SafeAreaView>
        <DatePickerModal
          locale="pt"
          mode="range"
          visible={open}
          onDismiss={onDismiss}
          startDate={startDate}
          endDate={endDate}
          onConfirm={onConfirm}
          disableStatusBar={true}
        />
      </SafeAreaView>
    </>
  );
};

export default DateRangePicker;
