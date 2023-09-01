import { Colors } from '../../../constants/styles';
import FileCustom from '../../../util/types/FileCustom';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Button as ButtonPaper } from 'react-native-paper';
import Carousel, { Pagination } from 'react-native-snap-carousel';

type Props = {
  title: string;
  field: string;
  handleChange?;
  handleBlur?;
  values?;
  errors?;
  touched?;
};

const { width } = Dimensions.get('window');
const SPACING = 10;
const THUMB_SIZE = 80;

const CustomerPhotos: React.FC<Props> = ({ title, field, handleChange, values }) => {
  const [images, setImages] = useState<any>([]);
  const [imagesGalery, setImagesGalery] = useState<any>([]);

  useEffect(() => {
    const imagesArray: any = [];
    const imagesGalleryArray: any = [];
    let imageId = 1;
    if (values[field]?.value && values[field]?.value?.length >= 0) {
      values[field]?.value.map((image) => {
        imagesArray.push(image.uri ?? image.url);
        imagesGalleryArray.push({
          id: imageId,
          image: {
            uri: image.url
          }
        });
        imageId++;
      });
    }
    setImages(imagesArray);
    setImagesGalery(imagesGalleryArray);
  }, [field, values, values[field]]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 10
    });

    if (!result.canceled) {
      const beforePhotoFiles: FileCustom[] = [];
      for (let i = 0; i < result.assets.length; i++) {
        const response = await fetch(result.assets[i].uri);
        const data = await response.blob();
        const metadata = {
          type: data.type
        };
        const photoName = result.assets[i].uri.slice(result.assets[i].uri.lastIndexOf('/') + 1);
        const photoFile = new File([data], photoName, metadata);
        beforePhotoFiles.push({
          file: photoFile,
          id: undefined,
          name: photoName,
          url: result.assets[i].uri
        });
      }

      handleChange(field, beforePhotoFiles);
      const imagesArray: any = [];
      const imagesGalleryArray: any = [];
      let imageId = 1;
      result.assets.map((image) => {
        imagesArray.push(image.uri);
        imagesGalleryArray.push({ id: imageId, image });
        imageId++;
      });
      setImages(imagesArray);
      setImagesGalery(imagesGalleryArray);
    }
  };

  const [indexSelected, setIndexSelected] = useState(0);
  const carouselRef = useRef<any>(undefined);

  const onSelectImageInCarousel = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  const onTouchThumbnail = (touched) => {
    if (touched === indexSelected) return;

    (carouselRef?.current as any)?.snapToItem(touched);
  };

  let containerViewStyle: any = {
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    maxWidth: '95%',
    marginVertical: 0
  };
  if (imagesGalery && imagesGalery.length > 0) {
    containerViewStyle = {
      backgroundColor: 'transparent',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      maxWidth: '95%',
      marginVertical: 0,
      height: 800
    };
  }
  return (
    <View style={containerViewStyle}>
      <Text style={styles.title}>{title}</Text>

      {handleChange && (
        <ButtonPaper
          style={{ marginVertical: 10 }}
          onPress={pickImage}
          uppercase={false}
          mode="outlined"
        >
          Selecionar imagens da galeria
        </ButtonPaper>
      )}

      <View
        style={{
          flex: 0.7,
          marginTop: 0,
          alignItems: 'center',
          alignContent: 'center',
          alignSelf: 'center'
        }}
      >
        <Carousel
          ref={carouselRef}
          layout="default"
          data={imagesGalery}
          sliderWidth={width * 1}
          itemWidth={width}
          renderItem={({ item, index }) => (
            <Image
              key={index}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
              source={item.image}
            />
          )}
          onSnapToItem={(index) => onSelectImageInCarousel(index)}
        />
      </View>
      <Pagination
        inactiveDotColor="gray"
        dotColor={'orange'}
        activeDotIndex={indexSelected}
        dotsLength={imagesGalery.length}
        animatedDuration={150}
        dotContainerStyle={{
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center'
        }}
        containerStyle={{
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center'
        }}
        inactiveDotScale={1}
      />
      <View
        style={{
          alignSelf: 'flex-end'
        }}
      >
        <Text
          style={{
            color: Colors.primary800,
            fontSize: 22,
            marginHorizontal: 20
          }}
        >
          {indexSelected + 1}/{imagesGalery.length}
        </Text>
      </View>
      <FlatList
        horizontal={true}
        data={imagesGalery}
        style={{ position: 'absolute', bottom: 80 }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SPACING
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => onTouchThumbnail(index)} activeOpacity={0.9}>
            <Image
              style={{
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                marginRight: SPACING,
                borderRadius: 16,
                borderWidth: index === indexSelected ? 4 : 0.75,
                borderColor: index === indexSelected ? 'orange' : 'white'
              }}
              source={item.image}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CustomerPhotos;

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 4 },
  title: {
    fontSize: 18,
    color: Colors.primary800
  },
  selectButtonText: {
    fontSize: 16,
    color: Colors.primary800
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
