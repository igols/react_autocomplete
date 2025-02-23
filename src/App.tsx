import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';

type Props = {
  delay?: number;
  onSelected?: (person: Person | null) => void;
};

export const App: React.FC<Props> = ({
  delay = 300,
  // onSelected = () => {},
}) => {
  const [targetPerson, setTargetPerson] = useState<Person | null>();
  const [currentTodos, setCurrentTodos] = useState(peopleFromServer);
  const [inputSort, setInputSort] = useState('');
  const applyQuery = useCallback(debounce(setInputSort, delay), [delay]);

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSort(event.target.value);
    setCurrentTodos(
      currentTodos.filter(person =>
        person.name.toLocaleLowerCase().includes(inputSort.toLocaleLowerCase()),
      ),
    );
  };

  const todos = currentTodos.map(item => (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      key={item.name}
      onClick={() => setTargetPerson(item)}
    >
      <p className={cn('has-text-link')}>({item.name})</p>
    </div>
  ));

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {targetPerson &&
            `${targetPerson?.name} (${targetPerson?.born} - ${targetPerson?.died})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleChangeInput}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content"> {todos} </div>
          </div>
        </div>

        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      </main>
    </div>
  );
};
