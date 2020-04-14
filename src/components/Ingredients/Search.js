import React, { useState, useEffect, useRef } from 'react';
import ErrorModal from '../UI/ErrorModal';
import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';

const Search = React.memo(props => {

  const { onLoadIngredients } = props;
  const [enteredFitler, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const { isLoading, error, data, sendRequest, clearError} = useHttp();

  useEffect(() => {
    const time = setTimeout(() => {
      if(enteredFitler === inputRef.current.value){
        const query = enteredFitler.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFitler}"`;
        sendRequest(
          'https://react-hook-demo-998ef.firebaseio.com/ingredients.json' + query,
          'GET'
        );
      }
    },500);
    
    return () => {
      clearTimeout(time);
    }
    
  }, [enteredFitler, inputRef, sendRequest])

  useEffect(() => {
    if(!error && !isLoading && data){
      const loadedIngredients = [];
      for (let key in data){
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        })
      }
    
      onLoadIngredients(loadedIngredients);
    }
  },[isLoading, error, data, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input 
            type="text"
            ref={inputRef}
            onChange={event => setEnteredFilter(event.target.value)}
            value={enteredFitler}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
