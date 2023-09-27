/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import { Entypo, AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type AccordionItemPros = PropsWithChildren<{
  title: string;
  initiallyExpanded: boolean;
  sectionId: string;
  onRemoveSectionHandler: (sectionId: string) => void;
  onChangeHandlerSectionTitle: (sectionId: string, sectionTitle: string) => void;
}>;

const CreateEditAccordionItem: React.FC<AccordionItemPros> = ({
  children,
  title,
  initiallyExpanded,
  sectionId,
  onRemoveSectionHandler,
  onChangeHandlerSectionTitle
}: AccordionItemPros) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  function toggleItem() {
    setExpanded(!expanded);
  }

  const body = <View style={styles.accordBody}>{children}</View>;

  return (
    <View style={styles.accordContainer}>
      <TouchableOpacity style={styles.accordHeader} onPress={toggleItem}>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <TouchableOpacity onPress={() => onRemoveSectionHandler(sectionId)}>
            <AntDesign name="delete" size={30} color={Colors.primary500} />
          </TouchableOpacity>

          <TextInput
            style={styles.accordTitle}
            value={title}
            onChangeText={(text) => onChangeHandlerSectionTitle(sectionId, text)}
            returnKeyType="next"
            placeholder={'Nome da seção...'}
          />
        </View>
        <Entypo
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={48}
          color={Colors.primary500}
        />
      </TouchableOpacity>
      {expanded && body}
      <View style={styles.articleSeparator}></View>
    </View>
  );
};

export default CreateEditAccordionItem;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  accordContainer: {
    paddingBottom: 4
  },
  accordHeader: {
    padding: 0,
    backgroundColor: 'transparent',
    color: '#eee',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center'
  },
  accordTitle: {
    fontSize: 22,
    color: Colors.primary500,
    fontWeight: 'bold'
  },
  accordBody: {
    padding: 0
  },
  articleSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginVertical: 20
  }
});
