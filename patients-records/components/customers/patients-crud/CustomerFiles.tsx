import IconButton from '../../../components/ui/IconButton';
import { Colors } from '../../../constants/styles';
import FileCustom from '../../../util/types/FileCustom';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';

type Props = {
  files: FileCustom[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<FileCustom[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const CustomerFiles: React.FC<Props> = ({ files, setFiles, isLoading, setIsLoading }) => {
  const deleteFile = (fileId: string) => {
    setFiles((currentFiles) => {
      const newFiles = currentFiles.filter((f) => f.id !== fileId);
      return newFiles;
    });
  };

  const downloadFile = async (fileCustom: FileCustom) => {
    const callback = (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      if (progress < 1) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    };

    const downloadResumable = FileSystem.createDownloadResumable(
      fileCustom.url!,
      FileSystem.documentDirectory + fileCustom.name!,
      {},
      callback
    );

    try {
      const downloadResult = await downloadResumable.downloadAsync();
      Sharing.shareAsync(downloadResult?.uri!);
    } catch (e) {
      console.error(e);
    }
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
      multiple: true,
      copyToCacheDirectory: true
    });

    if (!result.canceled) {
      const addedFiles: FileCustom[] = [];
      for (let i = 0; i < result.assets.length; i++) {
        const response = await fetch(result.assets[i].uri);
        const data = await response.blob();
        const metadata = {
          type: data.type
        };
        const addedFile = new File([data], result.assets[i].name, metadata);
        addedFiles.push({
          file: addedFile,
          id: undefined,
          name: result.assets[i].name,
          url: result.assets[i].uri
        });
      }

      setFiles((curFiles) => {
        if (curFiles?.length > 0) {
          const newFiles = [...curFiles, ...addedFiles];
          return newFiles;
        } else {
          return addedFiles;
        }
      });
    }
  };

  return (
    <View>
      <Text style={styles.label}>Arquivos</Text>
      <IconButton
        icon={'add'}
        color={Colors.primary500}
        size={48}
        onPress={pickFile}
        label="Adicionar"
      />
      {files?.map((file, index) => {
        return (
          <View key={file.id ?? index}>
            <Text style={styles.fileName}>{`${index + 1} - ${file.name}`}</Text>
            <View style={styles.actions_container}>
              <Pressable style={{ margin: 5 }} onPress={downloadFile.bind(this, file)}>
                <FontAwesome name="share-alt" size={32} color={Colors.primary500} />
              </Pressable>
              <Pressable style={{ margin: 5 }} onPress={deleteFile.bind(this, file.id)}>
                <AntDesign name="delete" size={32} color={Colors.primary500} />
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default CustomerFiles;

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: Colors.primary500,
    marginBottom: 4
  },
  fileName: {
    color: Colors.primary500,
    marginBottom: 4,
    marginTop: 20
  },
  actions_container: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-evenly',
    alignContent: 'center',
    alignItems: 'center'
  }
});
