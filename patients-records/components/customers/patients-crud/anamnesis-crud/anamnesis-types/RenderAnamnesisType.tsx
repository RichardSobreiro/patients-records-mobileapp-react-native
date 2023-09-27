import AccordionItem from '../../../../../components/ui/AccordionItem';
import RichTextInput from '../../../../../components/ui/custom-form/RichTextInput';
import { GetAnamnesisTypeResponse } from '../../../../../models/customers/anamnesis-types/GetAnamnesisTypesResponse';
import Input from '../../../../ui/custom-form/Input';
import InputCheckboxGroup from '../../../../ui/custom-form/InputCheckboxGroup';
import { Inputs } from '../AnamnesisList';
import { useEffect, useState } from 'react';

type Props = {
  selectedAnamnesis: GetAnamnesisTypeResponse;
  inputsSelectedAnamnesis: Inputs;
  setInputsSelectedAnamnesis: React.Dispatch<React.SetStateAction<Inputs>>;
};

const RenderAnamnesisType: React.FC<Props> = ({
  selectedAnamnesis,
  inputsSelectedAnamnesis,
  setInputsSelectedAnamnesis
}) => {
  const [inputs, setInputs] = useState<any>(undefined);
  const [touched, setTouched] = useState<any>(undefined);
  const [errors, setErrors] = useState<any>(undefined);

  useEffect(() => {
    const inputsArray: any[] = [];
    const toucherArray: any[] = [];
    const errorsArray: any[] = [];
    selectedAnamnesis.questions?.forEach((question) => {
      inputsArray[question.questionItemId] = {
        value: question.questionValue ? question.questionValue : '',
        isValid: true
      };
      toucherArray[question.questionItemId] = false;
      errorsArray[question.questionItemId] = null;
    });
    setInputs(inputsArray);
    setTouched(toucherArray);
    setErrors(errorsArray);
  }, [selectedAnamnesis]);

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
      const questionChanged = selectedAnamnesis?.questions?.find((q) => q.questionItemId === field);
      setInputsSelectedAnamnesis((curInputsSelectedAnamnesis) => {
        const newSelectedAnamnesis = { ...curInputsSelectedAnamnesis };
        if (questionChanged) {
          questionChanged.questionValue = enteredValue;
        }
        const anamnesisTypeContentToBeUpdated =
          newSelectedAnamnesis.anamnesisTypeContents.value.find(
            (anamnesisTypeContent) =>
              anamnesisTypeContent.anamnesisTypeId === selectedAnamnesis.anamnesisTypeId
          );

        if (anamnesisTypeContentToBeUpdated?.questions === undefined) {
          anamnesisTypeContentToBeUpdated!.questions = [...selectedAnamnesis?.questions!];
        }

        const questionToBeUpdated = anamnesisTypeContentToBeUpdated?.questions?.find(
          (q) => q.questionItemId === field
        );
        if (questionToBeUpdated) {
          questionToBeUpdated.questionValue = enteredValue;
        }

        return newSelectedAnamnesis;
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

  return (
    <>
      {/* Questions without section */}
      {inputs &&
        selectedAnamnesis?.questions &&
        selectedAnamnesis?.questions.length > 0 &&
        selectedAnamnesis.questions.map((question, index) => {
          if (!question.sectionId) {
            if (question.questionType === 'simple') {
              return (
                <Input
                  key={`${question.questionItemId}-${index}`}
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
              return (
                <InputCheckboxGroup
                  key={`${question.questionType}-${question.questionItemId}-${index}`}
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
            } else if (question.questionType === 'textarea') {
              return (
                <RichTextInput
                  key={`${question.questionType}-${question.questionItemId}-${index}`}
                  field={question.questionItemId}
                  label={question.questionPhrase}
                  values={inputs}
                  touched={touched}
                  errors={errors}
                  onChangeHandler={handleChange}
                />
              );
            }
          }
        })}

      {/* Questions with section */}
      {inputs &&
        selectedAnamnesis?.sections &&
        selectedAnamnesis?.sections.length > 0 &&
        selectedAnamnesis.sections.map((section, index) => {
          const questionsFromSection = selectedAnamnesis?.questions?.filter(
            (q) => q.sectionId === section.sectionId
          );
          return (
            <AccordionItem
              key={`${index}-${section.sectionId}`}
              title={section.sectionTitle}
              initiallyExpanded={false}
            >
              {questionsFromSection &&
                questionsFromSection.length > 0 &&
                questionsFromSection.map((question, index) => {
                  if (question.questionType === 'simple') {
                    return (
                      <Input
                        key={`${question.questionItemId}-${index}`}
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
                    return (
                      <InputCheckboxGroup
                        key={`${question.questionType}-${question.questionItemId}-${index}`}
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
                  } else if (question.questionType === 'textarea') {
                    return (
                      <RichTextInput
                        key={`${question.questionType}-${question.questionItemId}-${index}`}
                        field={question.questionItemId}
                        label={question.questionPhrase}
                        values={inputs}
                        touched={touched}
                        errors={errors}
                        onChangeHandler={handleChange}
                      />
                    );
                  }
                })}
            </AccordionItem>
          );
        })}
    </>
  );
};
export default RenderAnamnesisType;
