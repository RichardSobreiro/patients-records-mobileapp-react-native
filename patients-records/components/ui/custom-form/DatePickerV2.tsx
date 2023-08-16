/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import { formatDatePTBR } from '../../../util/date-helpers';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type Props = {
  field: string;
  label: string;
  values: any;
  touched: any;
  errors: any;
  onChangeHandler: (field: string, value: any) => void;
  onBlurHandler: (field: string) => void;
};

const DatePickerV2: React.FC<Props> = ({
  field,
  label,
  values,
  touched,
  errors,
  onChangeHandler,
  onBlurHandler
}) => {
  const [date, setDate] = useState<string | undefined | CalendarDate>(undefined);
  const [open, setOpen] = useState(false);

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
      onChangeHandler(field, params.date);
    },
    [onChangeHandler, field]
  );

  return (
    <SafeAreaProvider>
      <Text style={styles.label}>{label}</Text>
      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
        <Button
          onPress={() => {
            setOpen(true);
            onBlurHandler(field);
          }}
          uppercase={false}
          mode="outlined"
        >
          {date ? formatDatePTBR(new Date(date)) : 'Selecione a data'}
        </Button>
        {errors[field] ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors[field]}</Text>
          </View>
        ) : null}
        <DatePickerModal
          locale="pt"
          mode="single"
          visible={open}
          onDismiss={onDismissSingle}
          date={date as CalendarDate}
          onConfirm={onConfirmSingle}
        />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: Colors.primary500,
    marginBottom: 4
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: '#ff7675'
  }
});

export default DatePickerV2;
