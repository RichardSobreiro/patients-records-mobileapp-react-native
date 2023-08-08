import { Colors } from '../../../constants/styles';
import { DateParser } from '../../../util/dateParser';
import { GetProceedingResponse } from 'models/proceedings/GetProceedingResponse';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

type Props = {
  proceeding: GetProceedingResponse;
  navigateToUpdateProceeding: (proceeding: GetProceedingResponse) => void;
};

const ProceedingsListItem: React.FC<Props> = ({ proceeding, navigateToUpdateProceeding }) => {
  return (
    <TouchableOpacity onPress={navigateToUpdateProceeding.bind(null, proceeding)}>
      <View style={styles.proceedingContainer}>
        {/* Caching image for better performance: https://github.com/DylanVann/react-native-fast-image */}
        {proceeding.afterPhotos && proceeding.afterPhotos.length > 0 ? (
          <Image source={{ uri: proceeding.afterPhotos[0].url }} style={styles.proceedingImage} />
        ) : (
          <View style={styles.proceedingNoImage}>
            <Text style={{ color: '#ffffff' }}>Nenhuma imagem do último procedimento</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.proceedingTitle} numberOfLines={3}>
            {proceeding.date ? DateParser(new Date(proceeding.date)) : 'Nenhuma data cadastrada'}
          </Text>

          <Text style={styles.proceedingNotes}>{proceeding.proceedingTypeDescription}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProceedingsListItem;

const styles = StyleSheet.create({
  proceedingContainer: {
    flexDirection: 'row',
    paddingVertical: 15
  },
  proceedingImage: {
    width: 150,
    height: 85,
    resizeMode: 'contain',
    marginRight: 15
  },
  proceedingNoImage: {
    width: 150,
    height: 85,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary500
  },
  proceedingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  proceedingNotes: {
    fontSize: 14
  }
});
