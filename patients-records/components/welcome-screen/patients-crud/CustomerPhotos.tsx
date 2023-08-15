import { Colors } from '../../../constants/styles';
import FlatButton from '../../ui/FlatButton';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';

type Props = {
  title: string;
  field: string;
  handleChange?;
  handleBlur?;
  values?;
  errors?;
  touched?;
};

const CustomerPhotos: React.FC<Props> = ({ title, field, handleChange, values }) => {
  const [images, setImages] = useState<any>([]);

  useEffect(() => {
    const imagesArray: any = [];
    if (values[field]?.value && values[field]?.value?.length >= 0) {
      values[field]?.value.map((image) => {
        imagesArray.push(image.uri ?? image.url);
      });
    }
    setImages(imagesArray);
  }, [field, values, values[field]]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 4
    });

    if (!result.canceled) {
      handleChange(field, result.assets, true);
      const imagesArray: any = [];
      result.assets.map((image) => {
        imagesArray.push(image.uri);
      });
      setImages(imagesArray);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <SliderBox
        images={images}
        sliderBoxHeight={400}
        dotColor="#FFEE58"
        inactiveDotColor="#90A4AE"
        onCurrentImagePressed={(index) => console.log(`image ${index} pressed`)}
        paginationBoxVerticalPadding={40}
        autoplay
        circleLoop
      />
      {images && images.length === 0 && (
        <View
          style={{
            padding: 10,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>Nenhuma imagem selecionada</Text>
        </View>
      )}
      {handleChange && (
        <FlatButton
          onPress={pickImage}
          text={styles.selectButtonText}
          pressable={styles.selectButton}
        >
          Selecionar imagens da galeria
        </FlatButton>
      )}
    </View>
  );
};

export default CustomerPhotos;

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 4 },
  title: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4
  },
  selectButtonText: {
    fontSize: 20,
    color: '#ffffff'
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
