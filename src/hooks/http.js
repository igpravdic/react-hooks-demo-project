import { useReducer, useCallback } from 'react';

const initialState = { 
  loading: false, 
  error: null,
  data: null,
  extra: null,
  identifier: null
};

const httpReducer = (curState, action) => {
  switch(action.type){
    case 'SEND':
      return { 
        loading: true, 
        error: null, 
        data: null, 
        extra: null, 
        identifier: action.identifier 
      }
    case 'RESPONSE':
      return { 
        ...curState, 
        loading: false, 
        data: action.responseData, 
        extra: action.extra}
    case 'ERROR':
      return { 
        loading: false, 
        error: action.errorMessage
      }
    case 'CLEAR':
      return initialState;
      default:
        return new Error();
  }
}

const useHttp = () => {
  const [httpState, httpDispatch] = useReducer(
    httpReducer, 
    initialState
    );
  
  const clearError = useCallback(() => httpDispatch({ type: 'CLEAR' }),[]);

  const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier ) => {
    httpDispatch({ type: 'SEND', identifier: reqIdentifier});

    fetch(url,{
      method: method,
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      httpDispatch({
        type: 'RESPONSE',
        responseData: responseData,
        extra: reqExtra
      });
    }).catch(error => {
      httpDispatch({ type: 'ERROR', errorMessage: 'Something went wrong!' })
    })
  }, [])

  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    sendRequest: sendRequest,
    clearError: clearError,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier
  }
};

export default useHttp;