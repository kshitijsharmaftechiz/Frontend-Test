import { Container } from 'unstated'
import React from 'react'

const defaultState = {
  activeList: 0,
  previousList: 0,
  tempList: [],
  lists: [
    {
      id: 1,
      name: "List 1",
      list: [
        {
          id: 1,
          completed: false,
          text: 'Read README'
        },
        {
          id: 2,
          completed: false,
          text: 'Add one todo'
        },
        {
          id: 3,
          completed: false,
          text: 'Add filters'
        },
        {
          id: 4,
          completed: false,
          text: 'Add multiple lists'
        },
        {
          id: 5,
          completed: false,
          text: 'Optional: add tests'
        }
      ]
    }
  ],
  list: [
    {
      id: 1,
      completed: false,
      text: 'Read README'
    },
    {
      id: 2,
      completed: false,
      text: 'Add one todo'
    },
    {
      id: 3,
      completed: false,
      text: 'Add filters'
    },
    {
      id: 4,
      completed: false,
      text: 'Add multiple lists'
    },
    {
      id: 5,
      completed: false,
      text: 'Optional: add tests'
    }
  ]
}

class TodosContainer extends Container {
  constructor (props) {
    super(props)

    this.state = this.readStorage()
  }

  readStorage () {
    if (window && window.localStorage) {
      const state = window.localStorage.getItem('appState')
      if (state) {
        return JSON.parse(state)
      }
    }

    return defaultState
  }

  syncStorage () {
    if (window && window.localStorage) {
      const state = JSON.stringify(this.state)
      window.localStorage.setItem('appState', state)
    }
  }

  getList () {
    console.log(this.state.activeList);
    if(this.state.tempList.length === 0)
      return this.state.lists[this.state.activeList].list
    return this.state.tempList
  }

  getToDoListOptions() {
    return this.state.lists.map(item => <option value={item.id}>{item.name}</option>)
  }

  filterList = async (filter="") => {
    let {tempList, lists, activeList} = this.state
    if(filter === "completed") {
      tempList = lists[activeList].list.filter(l => l.completed == true)
    }
    else if(filter === "incompleted") {
      tempList = lists[activeList].list.filter(l => l.completed == false)
    }
    else {
      tempList = lists[activeList].list
    }
    await this.setState(state => {
      return { tempList }
    })
  }

  toggleComplete = async id => {
    const item = this.state.lists[this.state.activeList].list.find(i => i.id === id)
    console.log(item)
    const completed = !item.completed

    // We're using await on setState here because this comes from unstated package, not React
    // See: https://github.com/jamiebuilds/unstated#introducing-unstated
    await this.setState(state => {
      let lists = state.lists
      for(let index = 0; index < lists[state.activeList].list.length; index++) {
        if(lists[state.activeList].list[index].id === id) {
          lists[state.activeList].list[index].completed = completed
        }
      }
      let tempList = state.lists[state.activeList].list;
      return { lists, tempList }
    })

    this.syncStorage()
  }

  createTodo = async text => {
    console.log(this.state.activeList)
    await this.setState(state => {
      const item = {
        completed: false,
        text,
        id: state.lists[state.activeList].list.length + 1
      }

      let lists = state.lists
      lists[state.activeList].list.push(item)
      let tempList = state.lists[state.activeList].list;
      return { lists, tempList }
    })

    this.syncStorage()
  }

  createList = async name => {
    await this.setState(state => {
      const item = {
        name,
        list:[],
        id: state.lists.length + 1
      }

      const lists = state.lists.concat(item)
      return { lists }
    })

    this.syncStorage()
  }

  changeActiveList = async (e) => {
    let value = e.target.value;
    await this.setState(state => {
      let activeList = parseInt(value) - 1
      let tempList = []
      return { activeList, tempList }
    });
  }
}

export default TodosContainer
