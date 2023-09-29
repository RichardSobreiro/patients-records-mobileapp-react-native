/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import { formatDatePTBR } from '../../../util/date-helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import { Calendar, DatePickerModal } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';

type Props = {
  field: string;
  label: string;
  values: any;
  touched: any;
  errors: any;
  onChangeHandler: (field: string, value: any) => void;
  onBlurHandler: (field: string) => void;
  buttonStyle?: any;
};

const DatePickerV2: React.FC<Props> = ({
  field,
  label,
  values,
  touched,
  errors,
  onChangeHandler,
  onBlurHandler,
  buttonStyle
}) => {
  const [date, setDate] = useState<undefined | Date>(
    values[field]?.value ? values[field]?.value : undefined
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const test = new Date(values[field]?.value.toISOString());
    const newDate = new Date();
    newDate.setFullYear(test.getFullYear(), test.getMonth(), test.getDate());
    newDate.setHours(0, 0, 0);
    setDate(newDate);
  }, [field, values]);

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
    <>
      <View>
        <View style={[{ flex: 1, alignItems: 'flex-start' }, buttonStyle]}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <Button
          onPress={() => {
            setOpen(true);
            onBlurHandler(field);
          }}
          uppercase={false}
          mode="outlined"
          style={{ width: '100%', borderColor: Colors.primary500 }}
        >
          {date ? formatDatePTBR(new Date(date)) : 'Selecione a data'}
        </Button>
        {errors[field] ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors[field]}</Text>
          </View>
        ) : null}
      </View>
      <DatePickerModal
        locale="pt"
        mode="single"
        visible={open}
        onDismiss={onDismissSingle}
        date={new Date()}
        onConfirm={onConfirmSingle}
        disableStatusBar={true}
      />
    </>
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
