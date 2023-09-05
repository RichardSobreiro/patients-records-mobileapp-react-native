import IconButton from '../../../components/ui/IconButton';
import { Colors } from '../../../constants/styles';
import FileCustom from '../../../util/types/FileCustom';
import { AntDesign } from '@expo/vector-icons';
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
  const [imagesGalery, setImagesGalery] = useState<any[]>([]);

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
    setImagesGalery(imagesGalleryArray);
  }, [field, values]);

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
      let photoFilesArray: FileCustom[] = [];
      for (let i = 0; i < result.assets.length; i++) {
        const response = await fetch(result.assets[i].uri);
        const data = await response.blob();
        const metadata = {
          type: data.type
        };
        const photoName = result.assets[i].uri.slice(result.assets[i].uri.lastIndexOf('/') + 1);
        const photoFile = new File([data], photoName, metadata);
        photoFilesArray.push({
          file: photoFile,
          id: undefined,
          name: photoName,
          url: result.assets[i].uri
        });
      }

      if (values[field].value && values[field].value.length > 0) {
        photoFilesArray = [...values[field].value, ...photoFilesArray];
      }

      handleChange(field, photoFilesArray);

      const imagesArray: any = [];
      const imagesGalleryArray: any = [];
      let imageId = 1;
      result.assets.map((image) => {
        imagesArray.push(image.uri);
        imagesGalleryArray.push({ id: imageId, image });
        imageId++;
      });

      setImagesGalery((curImages) => {
        if (curImages?.length > 0) {
          return [...curImages, imagesGalleryArray];
        } else {
          return imagesGalleryArray;
        }
      });
    }
  };

  const [indexSelected, setIndexSelected] = useState(0);
  const carouselRef = useRef<any>(undefined);

  const onSelectImageInCarousel = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  const onRemoveImage = (indexSelected) => {
    console.log('IMAGE REMOVED: ' + indexSelected);
    setImagesGalery((curImages) => {
      const currentPhotosArray = [...values[field]?.value];
      currentPhotosArray.splice(indexSelected, 1);
      handleChange(field, currentPhotosArray);
      const newImagesArray = [...curImages];
      newImagesArray.splice(indexSelected, 1);
      return newImagesArray;
    });
  };

  const onTouchThumbnail = (touched) => {
    if (touched === indexSelected) return;

    (carouselRef?.current as any)?.snapToItem(touched);
  };

  let containerViewStyle: any = {
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    maxWidth: '100%',
    marginVertical: 0
  };
  if (imagesGalery && imagesGalery.length > 0) {
    containerViewStyle = {
      backgroundColor: 'transparent',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      maxWidth: '100%',
      marginVertical: 0,
      height: 900
    };
  }
  return (
    <View style={containerViewStyle}>
      <Text style={styles.title}>{title}</Text>

      {handleChange && (
        <IconButton
          icon={'add'}
          color={Colors.primary500}
          pressable={{ marginVertical: 10, width: '100%', marginHorizontal: 0 }}
          size={40}
          onPress={pickImage}
          label="Adicionar"
        />
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
            <View>
              <Image
                key={index}
                style={{ width: '100%', height: '90%' }}
                resizeMode="contain"
                source={item.image}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <AntDesign
                  name="delete"
                  size={40}
                  color={Colors.primary500}
                  onPress={() => onRemoveImage(index)}
                />
              </View>
            </View>
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
