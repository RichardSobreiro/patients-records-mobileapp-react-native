import DatePicker from '../../components/ui/custom-form/DatePicker';
import { getProceedingTypesByUserEmail } from '../../http/ProceedingsApi';
import { AuthContext } from '../../store/auth-context';
import Button, { ButtonTypes } from '../ui/Button';
import Dropdown, { DropdownData } from '../ui/Dropdown';
import Title from '../ui/custom-form/Title';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, Pressable, View, Dimensions } from 'react-native';

const windowDimensions = Dimensions.get('window');

type Props = {
  setModalVisible;
  setAdvancedFilters;
  setMustResetList;
};

type ErrorType = {
  startDate: null | string;
  endDate: null | string;
  proceedingType: null | string;
};

const Filters: React.FC<Props> = ({ setModalVisible, setAdvancedFilters, setMustResetList }) => {
  const authCtx = useContext(AuthContext);
  const [proceedingTypes, setProceedingTypes] = useState<DropdownData[] | undefined>(undefined);
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

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
      value: null,
      isValid: true
    },
    endDate: {
      value: null,
      isValid: true
    },
    proceedingType: {
      value: '',
      isValid: true
    }
  });
  const [touched, setTouched] = useState({
    startDate: false,
    endDate: false,
    proceedingType: false
  });
  const [errors, setErrors] = useState<ErrorType>({
    startDate: null,
    endDate: null,
    proceedingType: null
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
      setMustResetList.current = true;
      return newInputs;
    });
  };

  const validateForm = (advancedFitlers: any, validateAll?: boolean): boolean => {
    let startDateIsValid =
      touched['startDate'] && advancedFitlers.startDate.toString() !== 'Invalid Date';

    let endDateIsValid =
      touched['endDate'] && advancedFitlers.endDate.toString() !== 'Invalid Date';

    const proceedingTypeIsValid = true;

    if (touched['startDate'] && !touched['endDate']) {
      endDateIsValid = false;
    }

    if (!touched['startDate'] && touched['endDate']) {
      startDateIsValid = false;
    }

    if (
      touched['startDate'] &&
      touched['endDate'] &&
      advancedFitlers.startDate > advancedFitlers.endDate
    ) {
      startDateIsValid = false;
    }

    setErrors((curErrors) => {
      if (touched['startDate'] && !touched['endDate']) {
        curErrors['endDate'] = 'A data fim deve ser preenchida';
        setIsFormValid(false);
      } else {
        curErrors['endDate'] = !curErrors['endDate'] ? null : curErrors['endDate'];
      }

      if (!touched['startDate'] && touched['endDate']) {
        curErrors['startDate'] = 'A data início deve ser preenchida';
        setIsFormValid(false);
      } else {
        curErrors['startDate'] = !curErrors['startDate'] ? null : curErrors['startDate'];
      }

      if (
        touched['startDate'] &&
        touched['endDate'] &&
        advancedFitlers.startDate > advancedFitlers.endDate
      ) {
        curErrors['startDate'] = 'A data início deve ser menor que a data fim';
        setIsFormValid(false);
      } else {
        curErrors['startDate'] = !curErrors['startDate'] ? null : curErrors['startDate'];
      }

      return curErrors;
    });

    if (proceedingTypeIsValid) {
      setIsFormValid(true);
      return true;
    } else {
      return false;
    }
  };

  const onSubmitHandler = () => {
    const advancedFilters = {
      startDate: inputs.startDate.value,
      endDate: inputs.endDate.value,
      proceedingTypeId: inputs.proceedingType.value
    };
    if (validateForm(advancedFilters, true)) {
      setAdvancedFilters(advancedFilters);
      setModalVisible(false);
    }
  };

  const onCancelHandler = () => {
    setModalVisible(false);
    setAdvancedFilters(undefined);
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Title text="Filtrar pacientes por..."></Title>
        <View style={{ minWidth: 250 }}>
          <View style={styles.filterSeparator}></View>
          <Title text="...data do último procedimento"></Title>
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
          <Title text="...tipo de procedimento"></Title>
          <Dropdown
            field="proceedingType"
            label="Selecione o tipo de procedimento..."
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            data={proceedingTypes}
          />
          <View style={styles.filterSeparator}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginVertical: 15,
            minWidth: 250
          }}
        >
          <Button type={ButtonTypes.Cancel} onPress={onCancelHandler}>
            Cancelar
          </Button>
          <Button type={ButtonTypes.Primary} onPress={onSubmitHandler}>
            Filtrar
          </Button>
        </View>
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
    backgroundColor: '#ffffff',
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
    maxHeight: windowDimensions.height * 0.65,
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
    color: '#ffffff',
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
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
});
