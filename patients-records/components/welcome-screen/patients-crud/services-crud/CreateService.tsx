/* eslint-disable import/order */
import StackSheetCustom from '../../../ui/custom-form/StackSheetCustom';
import ServicesInfo from './ServicesInfo';
import { GetServiceTypeResponse } from 'models/customers/service-types/GetServiceTypesResponse';
import { GetServicePhotosResponse } from 'models/customers/services/GetServicePhotosResponse';
import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MultiSteps from 'react-native-multi-steps';
import FileCustom from 'util/types/FileCustom';

export type ErrorType = {
  date: null | string;
  selectedServiceTypes: null | string;
  beforeComments: null | string;
  beforePhotos: null | string;
  afterComments: null | string;
  afterPhotos: null | string;
};

export type Inputs = {
  date: {
    value: Date;
    isValid: boolean;
  };
  selectedServiceTypes: {
    value: GetServiceTypeResponse[];
    isValid: boolean;
  };
  beforeComments: {
    value: string | undefined;
    isValid: boolean;
  };
  beforePhotos: {
    value: GetServicePhotosResponse[] | null | undefined;
    isValid: boolean;
  };
  afterComments: {
    value: string | undefined;
    isValid: boolean;
  };
  afterPhotos: {
    value: GetServicePhotosResponse[] | null | undefined;
    isValid: boolean;
  };
};

export type Touched = {
  date: boolean;
  selectedServiceTypes: boolean;
  beforeComments: boolean;
  beforePhotos: boolean;
  afterComments: boolean;
  afterPhotos: boolean;
};

type Props = {
  customerId: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateService: React.FC<Props> = ({ customerId, visible, setVisible }) => {
  const [inputs, setInputs] = useState<Inputs>({
    date: {
      value: new Date(),
      isValid: true
    },
    selectedServiceTypes: {
      value: [],
      isValid: true
    },
    beforeComments: {
      value: '',
      isValid: true
    },
    beforePhotos: {
      value: [],
      isValid: true
    },
    afterComments: {
      value: '',
      isValid: true
    },
    afterPhotos: {
      value: [],
      isValid: true
    }
  });
  const [touched, setTouched] = useState<Touched>({
    date: false,
    selectedServiceTypes: false,
    beforeComments: false,
    beforePhotos: false,
    afterComments: false,
    afterPhotos: false
  });
  const [errors, setErrors] = useState<ErrorType>({
    date: null,
    selectedServiceTypes: null,
    beforeComments: null,
    beforePhotos: null,
    afterComments: null,
    afterPhotos: null
  });

  const handleChange = (
    field: string,
    enteredValue: string | Date | GetServiceTypeResponse[] | FileCustom[] | undefined
  ) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      const newInputs = {
        ...curInputs,
        [field]: { value: enteredValue, isValid: true }
      };
      return newInputs;
    });
  };

  const handleBlur = (field: string) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
  };

  return (
    <>
      <StackSheetCustom visible={visible} setVisible={setVisible}>
        <View style={styles.container}>
          <MultiSteps
            containerButtonStyle={styles.containerButtonStyle}
            onMoveNext={function (data: any): void {
              console.log('next', data);
            }}
            onMovePrevious={function (data: any): void {
              console.log('previous', data);
            }}
            onSubmit={function () {
              setVisible(false);
              console.log('Submit');
            }}
          >
            <View>
              <ServicesInfo
                inputs={inputs}
                touched={touched}
                errors={errors}
                changeHandler={handleChange}
                blurHandler={handleBlur}
              />
            </View>
            <View>
              <Text>Step 2</Text>
            </View>
            <View>
              <Text>Step 3</Text>
            </View>
            <View>
              <Text>Step 4</Text>
            </View>
            <View>
              <Text>Step 5</Text>
            </View>
          </MultiSteps>
        </View>
      </StackSheetCustom>
    </>
  );
};

export default CreateService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  containerButtonStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingRight: 30,
    width: '100%'
  }
});
