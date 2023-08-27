import { Colors } from '../../../constants/styles';
import FileCustom from '../../../util/types/FileCustom';
import { AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
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
      console.log('Finished downloading to ', downloadResult?.uri);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View>
      <Text style={styles.label}>Arquivos</Text>
      {files?.map((file, index) => {
        return (
          <View key={file.id}>
            <Text style={styles.fileName}>{`${index + 1} - ${file.name}`}</Text>
            <View style={styles.actions_container}>
              <Pressable style={{ margin: 5 }} onPress={downloadFile.bind(this, file)}>
                <AntDesign name="clouddownload" size={32} color="black" />
              </Pressable>
              <Pressable style={{ margin: 5 }} onPress={deleteFile.bind(this, file.id)}>
                <AntDesign name="delete" size={32} color="black" />
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
