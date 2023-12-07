import { notification } from 'antd';

export const successNotification = async (text) => {
  return notification.success({
    message: `Успех`,
    description: text,
    placement: 'topRight'
  });
};

export const errorNotification = async (text) => {
  return notification.error({
    message: `Ошибка`,
    description: text,
    placement: 'topRight'
  });
};

export const warningNotification = async (text) => {
  return notification.warning({
    message: `Предупреждение`,
    description: text,
    placement: 'topRight'
  });
};

export const infoNotification = async (text) => {
  return notification.info({
    message: `Информация`,
    description: text,
    placement: 'topRight'
  });
};
