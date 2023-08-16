export const DateParser = (date?: Date): string => {
  if (date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} `;
  } else {
    return 'Data inválida';
  }
};
