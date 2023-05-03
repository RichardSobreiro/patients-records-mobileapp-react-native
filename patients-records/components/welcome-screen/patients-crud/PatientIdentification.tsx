import FormDatePicker from '../../ui/FormDatePicker';
import FormField from '../../ui/FormField';

type Props = {
  handleChange;
  handleBlur;
  handleSubmit;
  values;
  errors;
  touched;
  isValid;
  isFormValid?;
};

const PatientIdentification: React.FC<Props> = ({
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
      <FormField
        field="name"
        label="Nome"
        autoCapitalize="words"
        values={values}
        touched={touched}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />

      <FormField
        field="phoneNumber"
        label="Telefone"
        values={values}
        touched={touched}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />

      <FormField
        field="email"
        label="E-mail (Opcional)"
        values={values}
        touched={touched}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />

      <FormDatePicker
        field="birthDate"
        label="Data de Nascimento"
        values={values}
        touched={touched}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
    </>
  );
};

export default PatientIdentification;
