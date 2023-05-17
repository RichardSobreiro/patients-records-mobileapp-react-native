import { Colors } from '../../../constants/styles';
import FlatButton from '../../ui/FlatButton';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';

type Props = {
  title: string;
  field: string;
  handleChange;
  handleBlur;
  handleSubmit;
  values;
  errors;
  touched;
};

const PatientPhotos: React.FC<Props> = ({
  title,
  field,
  handleChange,
  handleBlur,
  handleSubmit,
  values,
  errors,
  touched
}) => {
  const [images, setImages] = useState<any>(
    values[field]?.value && values[field]?.value?.length >= 0
      ? values[field]?.value.map((image) => {
          return { uri: image.url };
        })
      : null
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 4
    });

    console.log(result);

    if (!result.canceled) {
      handleChange(field, result.assets);
      setImages(result.assets);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={{ alignItems: 'center' }}>
          {images?.map(
            (image, index) =>
              index === 0 && <Image key={index} source={{ uri: image.uri }} style={styles.image} />
          )}
          {images?.length - 1 > 0 && (
            <Text style={{ fontSize: 20, color: 'white' }}>+{images.length - 1}</Text>
          )}
        </View>
        <FlatButton
          onPress={pickImage}
          text={styles.selectButtonText}
          pressable={styles.selectButton}
        >
          Selecionar imagens da galeria
        </FlatButton>
      </View>
    </>
  );
};

export default PatientPhotos;

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 4 },
  title: {
    fontSize: 18,
    color: 'white',
    marginBottom: 4
  },
  selectButtonText: {
    fontSize: 20,
    color: 'white'
  },
  selectButton: {
    margin: 5,
    borderRadius: 25,
    borderColor: Colors.primary100,
    borderWidth: 2
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 25,
    marginVertical: 10
  }
});
