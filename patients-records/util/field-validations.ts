export const validateCPF = (strCPF: string) => {
  if (!strCPF) {
    return false;
  }
  strCPF = strCPF.replace(/[^\d]+/g, '');

  let Soma;
  let Resto;
  Soma = 0;
  if (strCPF === '00000000000') return false;

  for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
};

export const validateCEP = (strCEP: string): boolean => {
  if (!strCEP) {
    return false;
  }
  // Caso o CEP não esteja nesse formato ele é inválido!
  const objER = /^[0-9]{2}[0-9]{3}-[0-9]{3}$/;

  strCEP = strCEP.trim();
  if (strCEP.length > 0) {
    if (objER.test(strCEP)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
