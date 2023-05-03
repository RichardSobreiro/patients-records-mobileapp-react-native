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
  isValid;
  isFormValid;
};

const PatientPhotos: React.FC<Props> = ({
  title,
  field,
  handleChange,
  handleBlur,
  handleSubmit,
  values,
  errors,
  touched,
  isValid,
  isFormValid
}) => {
  const [images, setImages] = useState<any>(null);

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
      isFormValid();
      values[field] = result.assets;
      setImages(result.assets);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <FlatButton
          onPress={pickImage}
          buttonTextStyles={styles.selectButtonText}
          buttonStyles={styles.selectButton}
        >
          Selecionar imagens da galeria
        </FlatButton>
        {images?.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.image} />
        ))}
      </View>
    </>
  );
};

export default PatientPhotos;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 18,
    color: Colors.primary100
  },
  selectButtonText: {
    fontSize: 20,
    color: Colors.primary500
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
