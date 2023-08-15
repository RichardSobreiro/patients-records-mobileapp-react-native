/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import { DateParser } from '../../util/dateParser';
import ServiceTypesModal from '../ui/ServiceTypesModal';
import DateRangePicker from '../ui/custom-form/DateRangePicker';
import { AdvancedFilters } from './CustomersList';
import { Feather, Entypo } from '@expo/vector-icons';
import { GetServiceTypeResponse } from 'models/customers/service-types/GetServiceTypesResponse';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';

type Props = {
  searchPhrase;
  setSearchPhrase;
  setAdvancedFilters: (advancedFilters: AdvancedFilters | undefined) => void;
  setMustResetList;
};

const SearchBar: React.FC<Props> = ({
  searchPhrase,
  setSearchPhrase,
  setAdvancedFilters,
  setMustResetList
}) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [openDateRangeModal, setOpenDateRangeModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [openServiceTypesModal, setOpenServiceTypesModal] = useState<boolean>(false);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<GetServiceTypeResponse[]>([]);

  useEffect(() => {
    setAdvancedFilters({
      startDate,
      startDateIsValid: true,
      endDate,
      endDateIsValid: true,
      serviceTypeIds: selectedServiceTypes.map((s) => s.serviceTypeId)
    });
  }, [startDate, endDate, selectedServiceTypes, setAdvancedFilters]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <Feather name="search" size={20} color="#000000" style={{ marginLeft: 1 }} />
          <TextInput
            style={styles.input}
            placeholder="Nome do cliente"
            value={searchPhrase}
            onChangeText={(text) => {
              setSearchPhrase(text);
              setMustResetList.current = true;
            }}
            onFocus={() => {
              setClicked(true);
            }}
          />
          <Entypo
            name="cross"
            size={50}
            color="#000000"
            style={{ padding: 0 }}
            onPress={() => {
              setMustResetList.current = true;
              setSearchPhrase('');
            }}
          />
        </View>

        <View style={styles.extraFiltersContainer}>
          <Pressable onPress={() => setOpenDateRangeModal(true)} style={styles.extraFiltersButton}>
            <DateRangePicker
              text={
                startDate && endDate
                  ? `${DateParser(startDate)} até ${DateParser(endDate)}`
                  : 'Datas de atendimento...'
              }
              open={openDateRangeModal}
              setOpen={setOpenDateRangeModal}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </Pressable>
          <Pressable onPress={() => setOpenServiceTypesModal(true)}>
            <View style={styles.extraFiltersButton}>
              <ServiceTypesModal
                visible={openServiceTypesModal}
                setVisible={setOpenServiceTypesModal}
                selectedServiceTypes={selectedServiceTypes}
                setSelectedServiceTypes={setSelectedServiceTypes}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </>
  );
};
export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    width: '90%'
  },
  searchBarContainer: {
    flex: 1,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    backgroundColor: '#d9dbda',
    borderRadius: 15
  },
  input: {
    fontSize: 20,
    marginLeft: 0,
    textAlign: 'center',
    width: '70%'
  },
  extraFiltersContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 5,
    width: '100%',
    height: '100%'
  },
  extraFiltersButton: {
    height: '100%',
    borderWidth: 1,
    borderRadius: 15,
    padding: 2,
    marginTop: 5,
    borderColor: Colors.primary500
  }
});
