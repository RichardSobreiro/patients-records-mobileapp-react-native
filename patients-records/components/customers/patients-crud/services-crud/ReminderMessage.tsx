import { Colors } from '../../../../constants/styles';
import { Inputs } from './ServicesList';

import { StyleSheet, Text, View } from 'react-native';
import { Switch } from 'react-native-paper';

type Props = {
  enabled: boolean;
  field: string;
  inputs: Inputs;
  onChangeHandler: (field: string, value: any) => void;
};

const ReminderMessage: React.FC<Props> = ({ enabled, field, inputs, onChangeHandler }) => {
  return (
    <View style={enabled ? styles.contentEnabled : styles.contentDisabled}>
      <View style={styles.switchContainer}>
        <Text style={[styles.switchText, enabled ? {} : styles.textDisabled]}>
          Enviar lembrete?
        </Text>
        <Switch
          value={inputs[field].value.sendReminder}
          onValueChange={() => {
            onChangeHandler(field, {
              ...inputs[field].value,
              sendReminder: !inputs[field].value.sendReminder
            });
          }}
          disabled={!enabled}
        />
      </View>
    </View>
  );
};

export default ReminderMessage;

const styles = StyleSheet.create({
  contentEnabled: {
    gap: 20,
    backgroundColor: 'transparent',
    marginBottom: 20
  },
  contentDisabled: {
    gap: 20,
    backgroundColor: 'transparent',
    marginBottom: 20
  },
  textDisabled: { color: Colors.tertiary500 },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  switchText: {
    fontSize: 18,
    color: Colors.primary500
  }
});
