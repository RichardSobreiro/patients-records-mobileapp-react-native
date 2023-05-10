//import { formatDistanceToNow } from 'date-fns';
import { Colors } from '../../constants/styles';
import { GetPatient } from '../../models/GetPatient';
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Linking, Alert } from 'react-native';

type Props = {
  item: GetPatient;
  editPatient: (patientId: string) => void;
};

const Article: React.FC<Props> = ({ item, editPatient }) => {
  return (
    <TouchableOpacity onPress={editPatient.bind(null, item.patientId)}>
      <View style={styles.article}>
        {/* Caching image for better performance: https://github.com/DylanVann/react-native-fast-image */}
        {/* <Image
        alt="Nenhuma imagem do último procedimento"
        //source={{ uri: item.urlToImage }}
        style={styles.articleImage}
      /> */}
        <View style={styles.articleNoImage}>
          <Text style={{ color: '#ffffff' }}>Nenhuma imagem do último procedimento</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.articleTitle} numberOfLines={3}>
            {item.patientName}
          </Text>

          <Text style={styles.articlePublishedAt}>{item.phoneNumber}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Article;

const styles = StyleSheet.create({
  article: {
    flexDirection: 'row',
    paddingVertical: 15
  },
  articleImage: {
    width: 150,
    height: 85,
    resizeMode: 'contain',
    marginRight: 15
  },
  articleNoImage: {
    width: 150,
    height: 85,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary500
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  articleDescription: {
    fontSize: 16,
    marginBottom: 10
  },
  articlePublishedAt: {
    fontSize: 14
  }
});
