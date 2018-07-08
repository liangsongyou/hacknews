import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';


// const list = [
//   {
//     title:'React',
//     url:'https://facebook.github.io/react/',
//     author:'Jordan Walke',
//     num_comments:3,
//     points:4,
//     objectID:0,
//   },
//   {
//     title:'Redux',
//     url:'https://github.com/reactjs/redux',
//     author:'Dan Abramov, Andrew Clark',
//     num_comments:2,
//     points:5,
//     objectID:1,
//   },
// ];

// const isSearched = (query) => (item) => !query || item.title.toLowerCase().indexOf(
//   query.toLowerCase()) !== -1;

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      result:null,
      query:DEFAULT_QUERY,
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  onSearchSubmit(event) {
    const { query } = this.state;
    this.fetchSearchTopstories(query, DEFAULT_PAGE);
    event.preventDefault();
  }

  setSearchTopstories(result) {
    const { hits, page } = result;

    const oldHits = page === 0 ? [] : this.state.result.hits;
    const updatedHits = [ ...oldHits, ...hits];
    this.setState({ result: { hits: updatedHits, page } });
  }

  fetchSearchTopstories(query, page=0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result))
      .catch(error => error);
  }

  componentDidMount(){
    const { query } = this.state;
    this.fetchSearchTopstories(query, DEFAULT_PAGE);
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value });
  }

  render() {
    const { query, result } = this.state;
    const page = (result && result.page) || 0;
    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        { result && <Table list={result.hits}/> }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopstories(query, page+1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) => 
  <form onSubmit={onSubmit}>
    <input type="text" value={value}  onChange={onChange} />
    <button type="submit" >{children}</button>
  </form>


const Table = ({ list }) => 
  <div className="table">
    { list.map((item) => 
      <div key={item.objectID} className="table-row" >
        <span style={largeColumn }>
          <a href={item.url} >{item.title} </a>
        </span>
        <span style={midColumn}> 
          {item.author} 
        </span>
        <span style={smallColumn}> 
          {item.num_comments} 
        </span>
        <span style={smallColumn}> 
          {item.points} 
        </span>
      </div>
    )}
  </div>

  const largeColumn = { width:'40%' };
  const midColumn   = { width:'30%' };
  const smallColumn = { width:'15%' };
  const Button = ({ onClick, children }) => 
    <button onClick={onClick} type="button">
      {children}
    </button>

export default App;
