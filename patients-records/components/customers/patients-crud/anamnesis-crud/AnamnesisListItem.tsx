import { GetAnamnesis } from '../../../../models/customers/anamnesis/GetAnamnesisResponse';
import { formatDatePTBR } from '../../../../util/date-helpers';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Surface } from 'react-native-paper';

type Props = {
  anamnesis: GetAnamnesis;
  navigateToUpdateAnamnesis: (customerId: string, anamnesisId: string) => void;
};

const AnamnesisListItem: React.FC<Props> = ({ anamnesis, navigateToUpdateAnamnesis }) => {
  return (
    <TouchableOpacity
      onPress={navigateToUpdateAnamnesis.bind(null, anamnesis.customerId, anamnesis.anamneseId)}
    >
      <Surface style={styles.surface} elevation={1}>
        <View style={styles.anamnesisContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.anamnesisText} numberOfLines={3}>
              {anamnesis.date ? formatDatePTBR(anamnesis.date) : 'Nenhuma data cadastrada'}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            {anamnesis.anamnesisTypeDescriptions.map((item) => {
              return (
                <Text style={styles.anamnesisText} numberOfLines={3}>
                  {item}
                </Text>
              );
            })}
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

export default AnamnesisListItem;

const styles = StyleSheet.create({
  surface: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 8
  },
  anamnesisContainer: {
    flexDirection: 'row'
  },
  anamnesisText: {
    fontSize: 18,
    marginBottom: 10
  }
});
