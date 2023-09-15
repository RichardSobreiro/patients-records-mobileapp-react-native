import IconButton from '../../../../../components/ui/IconButton';
import CreateInputCheckboxGroup from '../../../../../components/ui/custom-form/CreateInputCheckboxGroup';
import EditInput from '../../../../../components/ui/custom-form/EditInput';
import Input from '../../../../../components/ui/custom-form/Input';
import InputCheckboxGroup from '../../../../../components/ui/custom-form/InputCheckboxGroup';
import { Colors } from '../../../../../constants/styles';
import { getAnamnesisTypeById } from '../../../../../http/AnamnesisTypesApi';
import { GetAnamnesisTypeByIdResponse } from '../../../../../models/customers/anamnesis-types/GetAnamnesisTypeByIdResponse';
import { GetAnamnesisTypeResponse } from '../../../../../models/customers/anamnesis-types/GetAnamnesisTypesResponse';
import { AuthContext } from '../../../../../store/auth-context';
import { NotificationContext } from '../../../../../store/notification-context';
import { GetQuestionItem } from '/models/customers/anamnesis/GetAnamnesisByIdResponse';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

type Props = {
  anamnesisTypeId: string;
  selectedAnamnesisTypes?: GetAnamnesisTypeResponse[];
  setSelectedAnamnesisTypes?: React.Dispatch<React.SetStateAction<GetAnamnesisTypeResponse[]>>;
};

const AnamnesisGeneralForm: React.FC<Props> = ({
  anamnesisTypeId,
  selectedAnamnesisTypes,
  setSelectedAnamnesisTypes
}) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [anamensisType, setAnamnesisType] = useState<GetAnamnesisTypeByIdResponse | undefined>(
    undefined
  );
  const [inputs, setInputs] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const [mode] = useState<boolean>(!!(selectedAnamnesisTypes && setSelectedAnamnesisTypes));

  const [typeQuestionAdding, setTypeQuestionAdding] = useState('');
  const [visibleAddNewQuestion, setVisibleAddNewQuestion] = useState<boolean>(false);
  const [newQuestionPhrase, setNewQuestionPhrase] = useState<string>('Pergunta...');

  const getAnamnesisTypeAsync = useCallback(async () => {
    console.log('TESTE');
    if (anamensisType === undefined) {
      setIsLoading(true);

      const response = await getAnamnesisTypeById(authCtx.token?.access_token!, anamnesisTypeId);

      if (response.ok) {
        const selectedAnamnesisType = selectedAnamnesisTypes?.find(
          (at) => at.anamnesisTypeId === anamnesisTypeId
        );
        const anamensisTypeResponse = response.body as GetAnamnesisTypeByIdResponse;
        setAnamnesisType(anamensisTypeResponse);
        if (anamensisTypeResponse?.questions && anamensisTypeResponse?.questions.length > 0) {
          const inputsArray: any[] = [];
          const toucherArray: any[] = [];
          const errorsArray: any[] = [];
          anamensisTypeResponse.questions.map((question) => {
            let selectedAnamnesisTypeQuestion: GetQuestionItem | undefined = undefined;
            if (selectedAnamnesisType) {
              selectedAnamnesisTypeQuestion = selectedAnamnesisType.questions?.find(
                (q) => q.questionItemId === question.questionItemId
              );
            }
            inputsArray[question.questionItemId] = {
              value: selectedAnamnesisTypeQuestion
                ? selectedAnamnesisTypeQuestion.questionValue
                : '',
              isValid: true,
              questionPhrase: question.questionPhrase
            };
            toucherArray[question.questionItemId] = false;
            errorsArray[question.questionItemId] = null;
          });
          console.log(`ANAMNESIS LOADED: ${JSON.stringify(inputsArray)}`);
          setInputs(inputsArray);
          setTouched(toucherArray);
          setErrors(errorsArray);
        }
      } else {
        console.log(`ANAMNESIS LOADED WITH ERROR`);
        notificationCtx.showNotification({
          title: 'Ops...',
          message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
        });
      }
      setIsLoading(false);
    }
  }, [
    anamensisType,
    anamnesisTypeId,
    authCtx.token?.access_token,
    notificationCtx,
    selectedAnamnesisTypes
  ]);

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
      const questionChanged = anamensisType?.questions?.find((q) => q.questionItemId === field);
      if (questionChanged) {
        questionChanged.questionValue = enteredValue;
        setSelectedAnamnesisTypes?.((curSelected) => {
          const selectedType = curSelected.find((s) => s.anamnesisTypeId === anamnesisTypeId);
          if (selectedType) {
            console.log(`QUESTIONCHANGED FOUND ${field}: ${enteredValue}`);
            selectedType.questions = anamensisType?.questions;
          }
          return curSelected;
        });
      }
      return newInputs;
    });
  };

  const handleBlur = (field: string) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
  };

  const handleChangeQuestionPhrase = (field: string, enteredValue: any) => {
    setInputs((curInputs) => {
      console.log(`CHANGE QUESTION PHRASE ${field}: ${enteredValue}`);
      const newInputs = {
        ...curInputs,
        [field]: { ...curInputs[field], questionPhrase: enteredValue }
      };
      const questionChanged = anamensisType?.questions?.find((q) => q.questionItemId === field);
      if (questionChanged) {
        questionChanged.questionPhrase = enteredValue;
        setSelectedAnamnesisTypes?.((curSelected) => {
          const selectedType = curSelected.find((s) => s.anamnesisTypeId === anamnesisTypeId);
          if (selectedType) {
            console.log(`QUESTION PHRASE CHANGED FOUND ${field}: ${enteredValue}`);
            selectedType.questions = anamensisType?.questions;
          }
          return curSelected;
        });
      }
      return newInputs;
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
        anamensisType?.questions &&
        anamensisType?.questions.length > 0 &&
        anamensisType.questions.map((question, index) => {
          if (question.questionType === 'simple') {
            console.log(`Question: ${question.questionPhrase}`);
            return mode ? (
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
            ) : (
              <EditInput
                key={question.questionItemId}
                field={question.questionItemId}
                label={`Pergunta ${index + 1}: `}
                keyboardType="default"
                values={inputs}
                touched={touched}
                errors={errors}
                onChangeHandler={handleChange}
                onChangeHandlerQuestionPhrase={handleChangeQuestionPhrase}
                onBlurHandler={handleBlur}
              />
            );
          } else if (question.questionType === 'checkbox') {
            console.log(`Question: ${question.questionPhrase}`);
            return mode ? (
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
            ) : (
              <CreateInputCheckboxGroup
                key={`${question.questionType}-${question.questionItemId}`}
                field={question.questionItemId}
                label={`Pergunta ${index + 1}: `}
                values={inputs}
                touched={touched}
                errors={errors}
                onChangeHandler={handleChange}
                onChangeHandlerQuestionPhrase={handleChangeQuestionPhrase}
                data={question.questionAnswersOptions!.map((opt) => {
                  return {
                    label: opt,
                    value: opt
                  };
                })}
                anamnesisType={anamensisType}
                setAnamnesisType={setAnamnesisType}
              />
            );
          }
        })}

      {visibleAddNewQuestion && (
        <View
          style={{
            marginVertical: 10,
            paddingVertical: 10,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: Colors.primary500
          }}
        >
          <Text
            style={{
              color: Colors.primary500,
              fontSize: 16,
              textDecorationLine: 'underline',
              fontStyle: 'italic',
              marginBottom: 20,
              marginHorizontal: 1
            }}
          >
            Nova pergunta:{' '}
          </Text>
          <SegmentedButtons
            value={typeQuestionAdding}
            onValueChange={setTypeQuestionAdding}
            buttons={[
              {
                value: 'simple',
                label: 'Simples'
              },
              {
                value: 'checkbox',
                label: 'Opções'
              }
            ]}
          />
          {typeQuestionAdding === 'simple' && (
            <EditInput
              field={'1'}
              label={`Nova Pergunta: `}
              keyboardType="default"
              values={inputs}
              touched={touched}
              errors={errors}
              onChangeHandler={handleChange}
              onChangeHandlerQuestionPhrase={handleChangeQuestionPhrase}
              onBlurHandler={handleBlur}
            />
          )}
        </View>
      )}
      <IconButton
        pressable={{ paddingVertical: 5, borderColor: Colors.secondary800, marginVertical: 20 }}
        icon={visibleAddNewQuestion ? 'close' : 'add'}
        color={Colors.secondary500}
        size={36}
        onPress={() => {
          setVisibleAddNewQuestion((curValue) => !curValue);
        }}
        label={visibleAddNewQuestion ? 'Cancelar' : 'Adicionar nova pergunta'}
        labelStyle={{ color: Colors.secondary500 }}
      />
    </>
  );
};
export default AnamnesisGeneralForm;
