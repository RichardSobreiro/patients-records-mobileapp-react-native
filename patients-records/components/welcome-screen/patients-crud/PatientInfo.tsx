import FormFieldSelect from '../../ui/FormFieldSelect';

const data = [
  { key: 1, value: 'Botox' },
  { key: 2, value: 'Limpeza de Pele' },
  { key: 3, value: 'Preenchimento' },
  { key: 4, value: 'Peeling' },
  { key: 5, value: 'Bioestimulador de Colágeno' }
];

type Props = {
  handleChange;
  handleBlur;
  handleSubmit;
  values;
  errors;
  touched;
  isValid;
  isFormValid;
};

const PatientInfo: React.FC<Props> = ({
  handleChange,
  handleBlur,
  handleSubmit,
  values,
  errors,
  touched,
  isValid,
  isFormValid
}) => {
  return (
    <>
      <FormFieldSelect
        field="procedimentos"
        label="Procedimentos"
        data={data}
        values={values}
        touched={touched}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
        isValid={isValid}
        isFormValid={isFormValid}
      />
    </>
  );
};

export default PatientInfo;
