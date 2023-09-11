import Input from '../../../../../components/ui/custom-form/Input';
import InputCheckboxGroup from '../../../../../components/ui/custom-form/InputCheckboxGroup';
import { Colors } from '../../../../../constants/styles';
import {
  GetAnamnesisTypeByIdResponse,
  GetQuestionItem
} from '../../../../../models/customers/anamnesis-types/GetAnamnesisTypeByIdResponse';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

type Props = {
  anamnesisTypeId: string;
};

const AnamnesisGeneralForm: React.FC<Props> = ({ anamnesisTypeId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [anamensisType, setAnamnesisType] = useState<GetAnamnesisTypeByIdResponse | undefined>(
    undefined
  );
  const [inputs, setInputs] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const isFocused = useIsFocused();

  const getAnamnesisTypeAsync = useCallback(() => {
    if (anamensisType === undefined) {
      setIsLoading(true);

      const newAnamnesisType = new GetAnamnesisTypeByIdResponse(
        '89aa335f-c085-49d4-a175-a8ee6c745919',
        'Bioestimulador de colágeno',
        null,
        false,
        [
          new GetQuestionItem('1', 'simple', 'Marca do Produto'),
          new GetQuestionItem('2', 'checkbox', 'Bioestimulador de colágeno', [
            'ácido-L-Polilático',
            'Hidroxiapatita de Cálcio ',
            'Fios de tração'
          ])
        ]
      );

      setTimeout(() => {
        setAnamnesisType(newAnamnesisType);

        if (newAnamnesisType?.questions && newAnamnesisType?.questions.length > 0) {
          const inputsArray: any[] = [];
          const toucherArray: any[] = [];
          const errorsArray: any[] = [];
          newAnamnesisType.questions.map((question) => {
            inputsArray[question.questionItemId] = {
              value: '',
              isValid: true
            };

            toucherArray[question.questionItemId] = false;
            errorsArray[question.questionItemId] = null;
          });
          console.log(`ANAMNESIS LOADED: ${JSON.stringify(inputsArray)}`);
          setInputs(inputsArray);
          setTouched(toucherArray);
          setErrors(errorsArray);
        }

        setIsLoading(false);
      }, 1000);
    }
  }, [anamensisType]);

  useEffect(() => {
    getAnamnesisTypeAsync();
  }, [anamnesisTypeId, getAnamnesisTypeAsync]);

  const handleChange = (field: string, enteredValue: any) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      console.log(`CHANGE ${field}: ${enteredValue}`);
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
      {isLoading && (
        <ActivityIndicator
          color={Colors.primary800}
          size={120}
          style={{
            flex: 1,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.tertiary900Op12,
            zIndex: 2000
          }}
        />
      )}
      {!isLoading &&
        // inputs &&
        // inputs?.length > 0 &&
        anamensisType?.questions &&
        anamensisType?.questions.length > 0 &&
        anamensisType.questions.map((question) => {
          if (question.questionType === 'simple') {
            console.log(`Question: ${question.questionPhrase}`);
            return (
              <Input
                key={question.questionItemId}
                field={question.questionItemId}
                label={question.questionPhrase}
                keyboardType="default"
                values={inputs}
                touched={touched}
                errors={errors}
                onChangeHandler={handleChange}
                onBlurHandler={handleBlur}
              />
            );
          } else if (question.questionType === 'checkbox') {
            console.log(`Question: ${question.questionPhrase}`);
            return (
              <InputCheckboxGroup
                key={`${question.questionType}-${question.questionItemId}`}
                field={question.questionItemId}
                label={question.questionPhrase}
                values={inputs}
                touched={touched}
                errors={errors}
                onChangeHandler={handleChange}
                data={question.questionAnswersOptions!.map((opt) => {
                  return {
                    label: opt,
                    value: opt
                  };
                })}
              />
            );
          }
        })}
    </>
  );
};
export default AnamnesisGeneralForm;
