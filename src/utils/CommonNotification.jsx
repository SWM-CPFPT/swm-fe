import {notification} from 'antd';

export const CommonNotification = (message, description, type, placement = 'topRight') => {
    notification[type]({
        message: message,
        description: description,
        placement: placement
    });
};

export const successNotification = (msg, desc) => {
    notification.success({
        message: msg,
        description: desc,
        placement: 'topRight',
        duration: 5,
        style: {
            width: 400,
        },
    });
}; 