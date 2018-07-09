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

const largeColumn = { width:'40%' };
const midColumn   = { width:'30%' };
const smallColumn = { width:'15%' };

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      results:null,
      query:DEFAULT_QUERY,
      searchKey:'',
    };

    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }


  setSearchTopstories(result) {
    const { hits, page } = result;
    const { searchKey } = this.state;

    const oldHits = page === 0 ? [] : this.state.results[searchKey].hits;
    const updatedHits = [ ...oldHits, ...hits];
    this.setState({ results:{ ...this.state.results, [searchKey]: { hits: updatedHits, page }}});
  }

  fetchSearchTopstories(query, page=0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount(){
    const { query } = this.state;
    this.setState({ searchKey: query });
    this.fetchSearchTopstories(query, DEFAULT_PAGE);
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value });
  }

  needsToSearchTopstories(query) {
    return !this.state.results[query];
  }

  onSearchSubmit(event) {
    const { query } = this.state;
    this.setState({ searchKey:query });
    if (this.needsToSearchTopstories(query)) {
      this.fetchSearchTopstories(query, DEFAULT_PAGE);
    }
    event.preventDefault();
  }

  render() {
    const { query, results, searchKey } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        <Table list={list}/> 
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopstories(searchKey, page+1)}>
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

  const Button = ({ onClick, children }) => 
    <button onClick={onClick} type="button">
      {children}
    </button>

export default App;
