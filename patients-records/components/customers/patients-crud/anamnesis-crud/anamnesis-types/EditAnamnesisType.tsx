import IconButton from '../../../../../components/ui/IconButton';
import CreateEditInput from '../../../../../components/ui/custom-form/CreateEditInput';
import CreateEditInputCheckboxGroup, {
  CheckboxItem
} from '../../../../../components/ui/custom-form/CreateEditInputCheckboxGroup';
import CreateEditRichTextInput from '../../../../../components/ui/custom-form/CreateEditRichTextInput';
import Input from '../../../../../components/ui/custom-form/Input';
import { Colors } from '../../../../../constants/styles';
import { getAnamnesisTypeById, updateAnamnesisType } from '../../../../../http/AnamnesisTypesApi';
import {
  GetAnamnesisTypeByIdResponse,
  GetQuestionItem
} from '../../../../../models/customers/anamnesis-types/GetAnamnesisTypeByIdResponse';
import { UpdateAnamnesisTypeRequest } from '../../../../../models/customers/anamnesis-types/UpdateAnamnesisTypeRequest';
import { AuthContext } from '../../../../../store/auth-context';
import { NotificationContext } from '../../../../../store/notification-context';
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SegmentedButtons, Snackbar } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  anamnesisTypeId: string;
  route: any;
  navigation: any;
};

const EditAnamnesisType: React.FC<Props> = ({ anamnesisTypeId, route, navigation }) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);

  const [isLoading, setIsLoading] = useState(false);
  const [anamensisType, setAnamnesisType] = useState<GetAnamnesisTypeByIdResponse | undefined>(
    undefined
  );
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);

  const [typeQuestionAdding, setTypeQuestionAdding] = useState('simple');
  const [visibleAddNewQuestion, setVisibleAddNewQuestion] = useState<boolean>(false);
  const [newQuestionId, setNewQuestionId] = useState<string | undefined>(undefined);
  const [newQuestionPhrase, setNewQuestionPhrase] = useState<string>('');
  const [newAnswerQuestionOptions, setNewAnswerQuestionOptions] = useState<CheckboxItem[]>([]);

  const [inputs, setInputs] = useState({
    anamnesisTypeDescription: {
      value: '',
      isValid: true
    },
    anamnesisTypeTemplate: {
      value: '',
      isValid: true
    }
  });
  const [touched, setTouched] = useState({
    anamnesisTypeDescription: false,
    anamnesisTypeTemplate: false
  });
  const [errors, setErrors] = useState<{
    anamnesisTypeDescription: null | string;
    anamnesisTypeTemplate: null | string;
  }>({
    anamnesisTypeDescription: null,
    anamnesisTypeTemplate: null
  });

  const getAnamnesisTypeAsync = useCallback(async () => {
    if (anamensisType === undefined) {
      setIsLoading(true);

      const response = await getAnamnesisTypeById(authCtx.token?.access_token!, anamnesisTypeId);

      if (response.ok) {
        const anamensisTypeResponse = response.body as GetAnamnesisTypeByIdResponse;
        setAnamnesisType(anamensisTypeResponse);
        setInputs({
          anamnesisTypeDescription: {
            value: anamensisTypeResponse.anamnesisTypeDescription,
            isValid: true
          },
          anamnesisTypeTemplate: {
            value: anamensisTypeResponse.template ? anamensisTypeResponse.template : '',
            isValid: true
          }
        });
        setTouched({
          anamnesisTypeDescription: false,
          anamnesisTypeTemplate: false
        });
        setErrors({
          anamnesisTypeDescription: null,
          anamnesisTypeTemplate: null
        });
        setAnamnesisType(anamensisTypeResponse);
      } else {
        console.log(`ANAMNESIS LOADED WITH ERROR`);
        notificationCtx.showNotification({
          title: 'Ops...',
          message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
        });
      }
      setIsLoading(false);
    }
  }, [anamensisType, anamnesisTypeId, authCtx.token?.access_token, notificationCtx]);

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
      setErrors((curErrors) => {
        if (
          newInputs.anamnesisTypeDescription.value &&
          newInputs.anamnesisTypeDescription.value !== ''
        ) {
          newInputs.anamnesisTypeDescription.isValid = true;
          curErrors.anamnesisTypeDescription = null;
        } else {
          newInputs.anamnesisTypeDescription.isValid = false;
          curErrors.anamnesisTypeDescription = 'O nome do tipo de atendimento deve ser preenchido';
        }

        if (newInputs.anamnesisTypeTemplate.value && newInputs.anamnesisTypeTemplate.value !== '') {
          newInputs.anamnesisTypeTemplate.isValid = true;
          curErrors.anamnesisTypeTemplate = null;
        } else {
          newInputs.anamnesisTypeTemplate.isValid = false;
          curErrors.anamnesisTypeTemplate = 'O nome do tipo de atendimento deve ser preenchido';
        }
        return curErrors;
      });
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
      console.log(`CHANGE QUESTION PHRASE ${field}: ${enteredValue}`);
      questionChanged.questionPhrase = enteredValue;
      setAnamnesisType(newAnamnesisType as GetAnamnesisTypeByIdResponse);
    } else {
      console.log(`NEW QUESTION PHRASE ${field}: ${enteredValue}`);
      setNewQuestionPhrase(enteredValue);
    }
  };

  const handleChangeAnswerQuestionOption = (field: string, newValue: string, oldValue: string) => {
    console.log(`CHANGE ANSWER QUESTIONS OPTIONS ${field}: NEW: ${newValue} - OLD: ${oldValue}`);
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
        console.log(`NEW ANSWER OPTION ADDED ${field}: VALUE: ${newAnswerValue}`);
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
        console.log(`REMOVE ANSWER OPTION ${field}: VALUE: ${answerValue}`);
      }
      curAnamnesis!.questions! = newQuestions;
      return curAnamnesis;
    });
  };

  const saveAsync = useCallback(async () => {
    if (!inputs.anamnesisTypeDescription.value || inputs.anamnesisTypeDescription.value === '') {
      return;
    }

    setIsLoading(true);

    const request = new UpdateAnamnesisTypeRequest(
      anamnesisTypeId,
      inputs.anamnesisTypeDescription.value,
      inputs.anamnesisTypeTemplate.value,
      anamensisType?.questions
    );

    const response = await updateAnamnesisType(authCtx.token?.access_token!, request);

    if (response.ok) {
      setVisibleSnackbar(true);
      setTimeout(() => {
        setVisibleSnackbar(false);
      }, 5000);
    } else {
      notificationCtx.showNotification({
        title: 'Ops...',
        message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
      });
    }

    setIsLoading(false);
  }, [
    anamensisType?.questions,
    anamnesisTypeId,
    authCtx.token?.access_token,
    inputs.anamnesisTypeDescription.value,
    inputs.anamnesisTypeTemplate.value,
    notificationCtx
  ]);

  useEffect(() => {
    getAnamnesisTypeAsync();
  }, [anamnesisTypeId, getAnamnesisTypeAsync]);

  useLayoutEffect(() => {
    if (!navigation || !route) return;

    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity>
          <AntDesign
            style={{ paddingLeft: 0, paddingRight: 30 }}
            name="arrowleft"
            size={24}
            color={Colors.primary500}
            onPress={() => {
              navigation.setOptions({
                headerShown: false
              });
              navigation.goBack();
            }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            saveAsync();
          }}
          style={{
            borderColor: Colors.secondary500,
            borderWidth: 1,
            borderRadius: 20,
            paddingVertical: 5,
            paddingHorizontal: 10
          }}
        >
          <Text style={{ color: Colors.secondary500 }}>Salvar</Text>
        </TouchableOpacity>
      )
    });

    const tabNavigator = navigation.getParent('RootStack');
    if (tabNavigator) {
      if (route.name === 'EditAnamnesisType') {
        tabNavigator.setOptions({
          headerShown: false
        });
      }
    }

    return () => {
      tabNavigator.setOptions({
        headerShown: true
      });
    };
  }, [navigation, route, saveAsync]);

  return (
    <>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        style={{ flex: 1, marginHorizontal: 20, marginVertical: 8 }}
        overScrollMode="never"
        extraScrollHeight={150}
        extraHeight={150}
      >
        <Snackbar
          visible={visibleSnackbar}
          onDismiss={() => {}}
          wrapperStyle={{ zIndex: 7000, top: 0 }}
          style={{
            backgroundColor: Colors.secondary500
          }}
        >
          Alterações salvas com sucesso!
        </Snackbar>
        {isLoading ? (
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
        ) : (
          <>
            <Input
              field="anamnesisTypeDescription"
              label="Nome"
              values={inputs}
              touched={touched}
              errors={errors}
              onChangeHandler={handleChange}
              onBlurHandler={handleBlur}
            />
            {anamensisType?.questions &&
              anamensisType?.questions.length > 0 &&
              anamensisType.questions.map((question, index) => {
                if (question.questionType === 'simple') {
                  return (
                    <CreateEditInput
                      key={question.questionItemId}
                      field={question.questionItemId}
                      label={`Pergunta ${index + 1}: `}
                      questionPhrase={question.questionPhrase}
                      onChangeHandlerQuestionPhrase={handleChangeQuestionPhrase}
                    />
                  );
                } else if (question.questionType === 'checkbox') {
                  return (
                    <CreateEditInputCheckboxGroup
                      key={`${question.questionType}-${question.questionItemId}`}
                      field={question.questionItemId}
                      label={`Pergunta ${index + 1}: `}
                      questionPhrase={question.questionPhrase}
                      onChangeHandlerQuestionPhrase={handleChangeQuestionPhrase}
                      onChangeHandlerAnswerQuestionOption={handleChangeAnswerQuestionOption}
                      anamnesisType={anamensisType}
                      onChangeHandlerAddAnswerQuestionOption={
                        handleChangeHandlerAddAnswerQuestionOption
                      }
                      onChangeHandlerRemoveAnswerQuestionOption={
                        handleChangeHandlerRemoveAnswerQuestionOption
                      }
                    />
                  );
                } else if (question.questionType === 'textarea') {
                  return (
                    <CreateEditRichTextInput
                      key={`${question.questionType}-${question.questionItemId}`}
                      field={question.questionItemId}
                      label={`Pergunta ${index + 1}: `}
                      questionPhrase={question.questionPhrase}
                      onChangeHandlerQuestionPhrase={handleChangeQuestionPhrase}
                    />
                  );
                }
              })}
          </>
        )}

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
                },
                {
                  value: 'textarea',
                  label: 'Texto'
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
            {typeQuestionAdding === 'textarea' && (
              <CreateEditRichTextInput
                key={`${typeQuestionAdding}-${newQuestionId}`}
                field={newQuestionId!}
                label={`Nova Pergunta: `}
                questionPhrase={newQuestionPhrase}
                onChangeHandlerQuestionPhrase={handleChangeQuestionPhrase}
              />
            )}
          </View>
        )}

        {visibleAddNewQuestion ? (
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
                console.log(
                  `ADD QUESTIONS - TYPE: ${typeQuestionAdding} - QUESTION PHRASE: ${newQuestionPhrase}`
                );
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 25 }}>
            <IconButton
              pressable={{
                flex: 1,
                paddingVertical: 2,
                paddingHorizontal: 15,
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
              label={'Nova pergunta'}
              labelStyle={{ color: Colors.secondary500 }}
            />
            <IconButton
              pressable={{
                flex: 1,
                paddingVertical: 2,
                paddingHorizontal: 15,
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
              label={'Nova Seção'}
              labelStyle={{ color: Colors.secondary500 }}
            />
          </View>
        )}
      </KeyboardAwareScrollView>
    </>
  );
};

export default EditAnamnesisType;
