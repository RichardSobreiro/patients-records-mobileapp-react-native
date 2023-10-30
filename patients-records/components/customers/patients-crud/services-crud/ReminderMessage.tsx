import InlineInput from '../../../../components/ui/custom-form/InputInline';
import { Colors } from '../../../../constants/styles';
import { ErrorType, Inputs, Touched } from './ServicesList';

import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Switch } from 'react-native-paper';

type Props = {
  enabled: boolean;
  field: string;
  inputs: Inputs;
  touched: Touched;
  errors: ErrorType;
  onChangeHandler: (field: string, value: any) => void;
  onBlurHandler: (field: string) => void;
};

const ReminderMessage: React.FC<Props> = ({
  enabled,
  field,
  inputs,
  touched,
  errors,
  onChangeHandler,
  onBlurHandler
}) => {
  const [onOffSwitchState, setOnOffSwitchState] = useState<boolean>(enabled);

  useEffect(() => {
    setOnOffSwitchState(enabled);
  }, [enabled]);

  return (
    <View style={styles.content}>
      <View style={styles.rowContainer}>
        <Text style={[styles.rowText, onOffSwitchState ? {} : styles.textDisabled]}>
          Enviar lembrete?
        </Text>
        <Switch
          value={onOffSwitchState}
          onValueChange={(value) => {
            setOnOffSwitchState(value);

            onChangeHandler(field, {
              sendReminder: value
            });
          }}
          disabled={!enabled}
        />
      </View>
      <View style={[{ justifyContent: 'flex-start' }]}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.rowText, onOffSwitchState ? {} : styles.textDisabled]}>
            Enviar mensagem com{' '}
          </Text>
          <InlineInput
            field="reminderMessageAdvanceTime"
            inputs={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={onChangeHandler}
            onBlurHandler={onBlurHandler}
            editable={onOffSwitchState}
            keyboardType="number-pad"
            maxLength={2}
            defaultValue={'24'}
          />
          <Text style={[styles.rowText, onOffSwitchState ? {} : styles.textDisabled]}>
            {' '}
            horas de
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.rowText, onOffSwitchState ? {} : styles.textDisabled]}>
            antecedência
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReminderMessage;

const styles = StyleSheet.create({
  content: {
    gap: 20,
    backgroundColor: 'transparent',
    marginBottom: 20
  },
  textDisabled: { color: Colors.tertiary500 },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowText: {
    fontSize: 18,
    color: Colors.primary500
  }
});
