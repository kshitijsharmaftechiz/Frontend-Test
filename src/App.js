import React from 'react'
import { Provider, Subscribe } from 'unstated'

import styled from 'styled-components'

import TodosContainer from './store'

import TodoList from './components/TodoList'
import AddTodo from './components/AddTodo'
import AddList from './components/AddList'

function App () {
  return (
    <Provider>
      <Wrapper>
        <Subscribe to={[TodosContainer]}>
          {todos => {
            let list = todos.getList()
            return (
              <TodosWrapper>
                <div>
                  Load Todo <br />
                  <select onChange={todos.changeActiveList}>
                    {
                      todos.getToDoListOptions()
                    }
                  </select>
                  &nbsp;
                  <AddList onAddList={todos.createList} />                  
                </div>
                <AddTodo onAddTodo={todos.createTodo} />
                <div>
                  Filter Todos <br />
                  <button type="button" onClick={() => {list = todos.filterList()}}>All</button>
                  <button type="button" onClick={() => {list = todos.filterList("completed")}}>Completed</button>
                  <button type="button" onClick={() => {list = todos.filterList("incompleted")}}>Incompleted</button>
                </div>
                <TodoList items={list} toggleComplete={todos.toggleComplete} />
              </TodosWrapper>
            )
          }}
        </Subscribe>
      </Wrapper>
    </Provider>
  )
}

const Wrapper = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
`

const TodosWrapper = styled.div`
  max-width: 500px;
  display: flex;
  flex-direction: column;
`

export default App
