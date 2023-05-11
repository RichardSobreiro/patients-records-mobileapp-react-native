import DatePicker from '../../components/ui/custom-form/DatePicker';
import { Colors } from '../../constants/styles';
import { getProceedingTypesByUserEmail } from '../../http/ProceedingsApi';
import { AuthContext } from '../../store/auth-context';
import Dropdown, { DropdownData } from '../ui/Dropdown';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, Pressable, View, Dimensions } from 'react-native';

const windowDimensions = Dimensions.get('window');

type Props = {
  setModalVisible;
};

type ErrorType = {
  startDate: null | string;
  endDate: null | string;
};

const Filters: React.FC<Props> = ({ setModalVisible }) => {
  const authCtx = useContext(AuthContext);
  const [proceedingTypes, setProceedingTypes] = useState<DropdownData[] | undefined>(undefined);
  const [selected, setSelected] = useState<DropdownData | undefined>(undefined);

  const getProceedingTypes = async () => {
    const email = authCtx.userInfo?.email;
    const response = await getProceedingTypesByUserEmail(email!);
    if (response) {
      const data: DropdownData[] = [];
      for (const proceedingType of response.proceedingsTypes!) {
        const dropdownDataElem: DropdownData = {
          label: proceedingType.proceedingTypeDescription,
          value: proceedingType.proceedingTypeId
        };
        data.push(dropdownDataElem);
      }
      setProceedingTypes(data);
    }
  };

  useEffect(() => {
    getProceedingTypes();
  }, []);

  const [inputs, setInputs] = useState({
    startDate: {
      value: new Date(),
      isValid: true
    },
    endDate: {
      value: new Date(),
      isValid: true
    }
  });
  const [touched, setTouched] = useState({
    startDate: false,
    endDate: false
  });
  const [errors, setErrors] = useState<ErrorType>({
    startDate: null,
    endDate: null
  });

  const handleChange = (field: string, enteredValue: any) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      const newInputs = {
        ...curInputs,
        [field]: { value: enteredValue, isValid: true }
      };
      //validateForm(newInputs, false);
      return newInputs;
    });
  };
  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View
          style={{
            padding: 10,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center'
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: Colors.primary800,
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Filtrar pacientes por...
          </Text>
        </View>
        <View style={{ minWidth: 250 }}>
          <View style={styles.filterSeparator}></View>
          <View
            style={{
              padding: 10,
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.primary800,
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              ...data do último procedimento
            </Text>
          </View>
          <DatePicker
            field="startDate"
            label="Início"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            text={{ paddingHorizontal: 45 }}
          />
          <DatePicker
            field="endDate"
            label="Fim"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            text={{ paddingHorizontal: 45 }}
          />
          <View style={styles.filterSeparator}></View>
        </View>
        <View style={{ minWidth: 250 }}>
          <View
            style={{
              padding: 10,
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.primary800,
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              ...tipo de procedimento
            </Text>
          </View>
          <Dropdown
            label="Selecione o tipo de procedimento..."
            data={proceedingTypes}
            onSelect={setSelected}
          />
          <View style={styles.filterSeparator}></View>
        </View>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.textStyle}>Hide Modal</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Filters;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 350,
    maxHeight: windowDimensions.height * 0.6,
    minWidth: 300,
    flex: 1
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16
  },
  filterSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ed7669'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
});
