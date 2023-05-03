import * as Yup from 'yup';

// https://github.com/jquense/yup
export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nome deve ser preenchido'),
  phoneNumber: Yup.string().required('Número de telefone deve ser preenchido'),
  email: Yup.string().email('Insira um e-mail válido'),
  birthDate: Yup.date().required('A idade do paciente deve ser preenchida')
  // procedimentos: Yup.array().min(1, 'Você deve selecionar ao menos um procedimento'),
  // beforePictures: Yup.array().min(1, 'Você deve selecionar ao menos uma foto do antes'),
  // afterPictures: Yup.array().min(1, 'Você deve selecionar ao menos uma foto do depois')
});
