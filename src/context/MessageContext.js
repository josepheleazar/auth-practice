import React, { createContext, useContext } from 'react';

import { message } from 'antd';

const MessageContext = createContext({});

function MessageProvider(props) {
  const { children } = props;

  const [messageApi, contextHolder] = message.useMessage();

  const customMessage = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
    });
  };

  return(
    <MessageContext.Provider
      value={{ 
        contextHolder,
        customMessage
      }}
    >
      { children }
    </MessageContext.Provider>
  )
}

function useMessageContext() {
  return useContext(MessageContext);
};

export {
  MessageContext,
  MessageProvider,
  useMessageContext,
}