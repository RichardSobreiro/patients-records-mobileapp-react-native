import CreateEditInputCheckboxGroup, {
  CheckboxItem
} from '../../../../../components/ui/custom-form/CreateEditInputCheckboxGroup';
import Input from '../../../../../components/ui/custom-form/Input';
import InputCheckboxGroup from '../../../../../components/ui/custom-form/InputCheckboxGroup';
import IconButton from '../../../../../components/ui/IconButton';
import { Colors } from '../../../../../constants/styles';
import { getAnamnesisTypeById } from '../../../../../http/AnamnesisTypesApi';
import { GetAnamnesisTypeByIdResponse } from '../../../../../models/customers/anamnesis-types/GetAnamnesisTypeByIdResponse';
import { GetAnamnesisTypeResponse } from '../../../../../models/customers/anamnesis-types/GetAnamnesisTypesResponse';
import { GetQuestionItem } from '../../../../../models/customers/anamnesis/GetAnamnesisByIdResponse';
import { AuthContext } from '../../../../../store/auth-context';
import { NotificationContext } from '../../../../../store/notification-context';
import CreateEditInput from '../../../../ui/custom-form/CreateEditInput';

import { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  anamnesisTypeId: string;
  selectedAnamnesisTypes?: GetAnamnesisTypeResponse[];
  setSelectedAnamnesisTypes?: React.Dispatch<React.SetStateAction<GetAnamnesisTypeResponse[]>>;
  isFocused?: boolean;
};

const AnamnesisGeneralForm: React.FC<Props> = ({
  anamnesisTypeId,
  selectedAnamnesisTypes,
  setSelectedAnamnesisTypes,
  isFocused
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

  const [typeQuestionAdding, setTypeQuestionAdding] = useState('simple');
  const [visibleAddNewQuestion, setVisibleAddNewQuestion] = useState<boolean>(false);
  const [newQuestionId, setNewQuestionId] = useState<string | undefined>(undefined);
  const [newQuestionPhrase, setNewQuestionPhrase] = useState<string>('');
  const [newAnswerQuestionOptions, setNewAnswerQuestionOptions] = useState<CheckboxItem[]>([]);

  const getAnamnesisTypeAsync = useCallback(async () => {
    setIsLoading(true);

    const response = await getAnamnesisTypeById(authCtx.token?.access_token!, anamnesisTypeId);

    if (response.ok) {
      const selectedAnamnesisType = selectedAnamnesisTypes?.find(
        (at) => at.anamnesisTypeId === anamnesisTypeId
      );
      const anamensisTypeResponse = response.body as GetAnamnesisTypeByIdResponse;

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
            value: selectedAnamnesisTypeQuestion ? selectedAnamnesisTypeQuestion.questionValue : '',
            isValid: true,
            questionPhrase: question.questionPhrase
          };
          toucherArray[question.questionItemId] = false;
          errorsArray[question.questionItemId] = null;
        });
        setAnamnesisType(anamensisTypeResponse);
        setInputs(inputsArray);
        setTouched(toucherArray);
        setErrors(errorsArray);
      }
    } else {
      notificationCtx.showNotification({
        title: 'Ops...',
        message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
      });
    }
    setIsLoading(false);
  }, [anamnesisTypeId, authCtx.token?.access_token, notificationCtx, selectedAnamnesisTypes]);

  useEffect(() => {
    getAnamnesisTypeAsync();
  }, [anamnesisTypeId, getAnamnesisTypeAsync, isFocused]);

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
      const questionChanged = anamensisType?.questions?.find((q) => q.questionItemId === field);
      if (questionChanged) {
        questionChanged.questionValue = enteredValue;
        setSelectedAnamnesisTypes?.((curSelected) => {
          const selectedType = curSelected.find((s) => s.anamnesisTypeId === anamnesisTypeId);
          if (selectedType) {
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
    const newAnamnesisType = { ...anamensisType };
    const questionChanged = newAnamnesisType?.questions?.find((q) => q.questionItemId === field);
    if (questionChanged) {
      questionChanged.questionPhrase = enteredValue;
      setAnamnesisType(newAnamnesisType as GetAnamnesisTypeByIdResponse);
    } else {
      setNewQuestionPhrase(enteredValue);
    }
  };

  const handleChangeAnswerQuestionOption = (field: string, newValue: string, oldValue: string) => {
    const newAnamnesisType = { ...anamensisType };
    const questionChanged = newAnamnesisType?.questions?.find((q) => q.questionItemId === field);
    if (questionChanged) {
      for (let i = 0; i < questionChanged.questionAnswersOptions!.length!; i++) {
        if (questionChanged.questionAnswersOptions![i] === oldValue) {
          questionChanged.questionAnswersOptions![i] = questionChanged.questionAnswersOptions![
            i
          ].replace(oldValue, newValue);
        }
      }
      setAnamnesisType(newAnamnesisType as GetAnamnesisTypeByIdResponse);
    }
  };

  const handleChangeHandlerAddAnswerQuestionOption = (field: string, newAnswerValue: string) => {
    setAnamnesisType((curAnamnesis) => {
      const newQuestions = [...curAnamnesis?.questions!];
      const questionEdited = newQuestions?.find((q) => q.questionItemId === field);
      if (questionEdited) {
        questionEdited.questionAnswersOptions?.push(newAnswerValue);
        curAnamnesis!.questions! = newQuestions;
      } else {
        setNewAnswerQuestionOptions((curValue) => {
          if (curValue === undefined) {
            curValue = [];
          }
          curValue.push({
            label: newAnswerValue,
            value: newAnswerValue,
            checked: false,
            visible: true
          } as CheckboxItem);
          return curValue;
        });
      }
      return curAnamnesis;
    });
  };

  const handleChangeHandlerRemoveAnswerQuestionOption = (field: string, answerValue: string) => {
    setAnamnesisType((curAnamnesis) => {
      const newQuestions = [...curAnamnesis?.questions!];
      const questionEdited = newQuestions?.find((q) => q.questionItemId === field);
      if (questionEdited) {
        questionEdited.questionAnswersOptions = questionEdited.questionAnswersOptions?.filter(
          (removedAnswerOption) => removedAnswerOption !== answerValue
        );
      }
      curAnamnesis!.questions! = newQuestions;
      return curAnamnesis;
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
              <CreateEditInput
                key={question.questionItemId}
                field={question.questionItemId}
                label={`Pergunta ${index + 1}: `}
                questionPhrase={question.questionPhrase}
                onChangeHandlerQuestionPhrase={handleChangeQuestionPhrase}
              />
            );
          } else if (question.questionType === 'checkbox') {
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
              <CreateEditInputCheckboxGroup
                key={`${question.questionType}-${question.questionItemId}`}
                field={question.questionItemId}
                label={`Pergunta ${index + 1}: `}
                questionPhrase={question.questionPhrase}
                onChangeHandlerQuestionPhrase={handleChangeQuestionPhrase}
                onChangeHandlerAnswerQuestionOption={handleChangeAnswerQuestionOption}
                anamnesisType={anamensisType}
                onChangeHandlerAddAnswerQuestionOption={handleChangeHandlerAddAnswerQuestionOption}
                onChangeHandlerRemoveAnswerQuestionOption={
                  handleChangeHandlerRemoveAnswerQuestionOption
                }
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
            <CreateEditInput
              field={'1'}
              label={`Nova Pergunta: `}
              questionPhrase={newQuestionPhrase}
              onChangeHandlerQuestionPhrase={handleChangeQuestionPhrase}
            />
          )}
          {typeQuestionAdding === 'checkbox' && (
            <CreateEditInputCheckboxGroup
              key={`${typeQuestionAdding}-${newQuestionId}`}
              field={newQuestionId!}
              label={`Nova Pergunta: `}
              questionPhrase={newQuestionPhrase}
              onChangeHandlerQuestionPhrase={handleChangeQuestionPhrase}
              onChangeHandlerAnswerQuestionOption={handleChangeAnswerQuestionOption}
              anamnesisType={anamensisType!}
              onChangeHandlerAddAnswerQuestionOption={handleChangeHandlerAddAnswerQuestionOption}
              onChangeHandlerRemoveAnswerQuestionOption={
                handleChangeHandlerRemoveAnswerQuestionOption
              }
            />
          )}
        </View>
      )}
      {!mode &&
        (visibleAddNewQuestion ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <IconButton
              pressable={{
                paddingVertical: 5,
                paddingHorizontal: 15,
                marginVertical: 20
              }}
              icon={'close'}
              color={Colors.primary500}
              size={36}
              onPress={() => {
                setVisibleAddNewQuestion((curValue) => {
                  setNewQuestionId(undefined);
                  return !curValue;
                });
              }}
              label={'Cancelar'}
            />
            <IconButton
              pressable={{
                paddingVertical: 5,
                paddingHorizontal: 15,
                borderColor: Colors.secondary800,
                marginVertical: 20
              }}
              icon={'save'}
              color={Colors.secondary500}
              size={36}
              onPress={() => {
                setVisibleAddNewQuestion(false);
                setNewQuestionId(undefined);
                const newAnamnesisType = { ...anamensisType };
                newAnamnesisType.questions?.push(
                  new GetQuestionItem(
                    newQuestionId!,
                    typeQuestionAdding,
                    newQuestionPhrase,
                    newAnswerQuestionOptions?.length > 0
                      ? newAnswerQuestionOptions.map((opt) => opt.label)
                      : undefined,
                    undefined
                  )
                );
                setAnamnesisType(newAnamnesisType as GetAnamnesisTypeByIdResponse);
                setNewAnswerQuestionOptions([]);
                setNewQuestionId(undefined);
                setNewQuestionPhrase('');
                setTypeQuestionAdding('simple');
              }}
              label={'Adicionar'}
              labelStyle={{ color: Colors.secondary500 }}
            />
          </View>
        ) : (
          <IconButton
            pressable={{
              paddingVertical: 5,
              borderColor: Colors.secondary800,
              marginVertical: 20
            }}
            icon={'add'}
            color={Colors.secondary500}
            size={36}
            onPress={() => {
              setNewQuestionId((cur) => {
                setVisibleAddNewQuestion(true);
                return uuidv4();
              });
            }}
            label={'Adicionar nova pergunta'}
            labelStyle={{ color: Colors.secondary500 }}
          />
        ))}
    </>
  );
};
export default AnamnesisGeneralForm;
