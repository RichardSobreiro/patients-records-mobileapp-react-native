export const getAgePTBR = (brithdate?: Date): string => {
  if (brithdate) {
    const today = new Date();
    const birthDate = new Date(brithdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} anos`;
  } else {
    return '...';
  }
};

export const formatDateTimePTBR = (dateTime: Date): string => {
  let m = new Date();
  if (dateTime && typeof dateTime === 'string') {
    m = new Date((dateTime as unknown as string).slice(0, -1));
  } else {
    m = new Date(dateTime as unknown as string);
  }
  const dateString =
    (m.getDate() < 10 ? '0' + m.getDate() : m.getDate()) +
    '/' +
    (m.getMonth() + 1 < 10 ? '0' + (m.getMonth() + 1) : m.getMonth() + 1) +
    '/' +
    m.getFullYear() +
    ' ' +
    (m.getHours() < 10 ? '0' + m.getHours() : m.getHours()) +
    ':' +
    (m.getUTCMinutes() < 10 ? '0' + m.getMinutes() : m.getMinutes());
  return dateString;
};

export const formatDatePTBR = (dateTime: Date): string => {
  let m = new Date();
  if (dateTime && typeof dateTime === 'string') {
    m = new Date((dateTime as unknown as string).slice(0, -1));
  } else {
    m = new Date(dateTime as unknown as string);
  }
  const dateString =
    (m.getDate() < 10 ? '0' + m.getDate() : m.getDate()) +
    '/' +
    (m.getMonth() + 1 < 10 ? '0' + (m.getMonth() + 1) : m.getMonth() + 1) +
    '/' +
    m.getFullYear();
  return dateString;
};

export const formatTimePTBR = (dateTime: Date): string => {
  const m = new Date(dateTime as unknown as string);
  const dateString =
    (m.getHours() < 10 ? '0' + m.getHours() : m.getHours()) +
    ':' +
    (m.getMinutes() < 10 ? '0' + m.getMinutes() : m.getMinutes());
  return dateString;
};

export const isValidDate = (d: Date) => {
  return d instanceof Date && !isNaN(d.getTime());
};

export const formatDateTimeUTCFormat = (dateTime: Date): string => {
  let m = new Date();
  if (dateTime && typeof dateTime === 'string') {
    m = new Date((dateTime as unknown as string).slice(0, -1));
  } else {
    m = new Date(dateTime as unknown as string);
  }
  const dateString =
    m.getFullYear().toString() +
    '-' +
    (m.getMonth() + 1 < 10 ? '0' + (m.getMonth() + 1) : m.getMonth() + 1) +
    '-' +
    (m.getDate() < 10 ? '0' + m.getDate() : m.getDate()) +
    ' ' +
    (m.getHours() < 10 ? '0' + m.getHours() : m.getHours()) +
    ':' +
    (m.getUTCMinutes() < 10 ? '0' + m.getMinutes() : m.getMinutes()) +
    ':' +
    (m.getUTCSeconds() < 10 ? '0' + m.getSeconds() : m.getSeconds());
  return dateString;
};
