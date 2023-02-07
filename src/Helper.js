export const Success = (messageApi, message) => {
    messageApi.open({
        type: 'success',
        content: message,
    });
};

export const error = (messageApi, message) => {
    messageApi.open({
        type: 'error',
        content: message,
    });
};
