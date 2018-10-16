// function component
import React from 'react';
import { render } from 'react-dom';
import { Router } from '@reach/router';
import pf from 'petfinder-client';
import Loadable from 'react-loadable';
import { Provider } from './SearchContext';
// import Results from './Results';

import NavBar from './NavBar';
// import SearchParams from './SearchParams';

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

// code splitting by Loadable
const LoadableDetails = Loadable({
  loader: () => import('./Details'),
  loading() {
    return <h1>loading split out code</h1>;
  }
});

const LoadableResults = Loadable({
  loader: () => import('./Results'),
  loading() {
    return <h1>loading split out code</h1>;
  }
});

const LoadableSearchParams = Loadable({
  loader: () => import('./SearchParams'),
  loading() {
    return <h1>loading split out code</h1>;
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'Seattle, WA',
      animal: '',
      breed: '',
      breeds: [],
      handleAnimalChange: this.handleAnimalChange,
      handleBreedChange: this.handleBreedChange,
      handleLocationChange: this.handleLocationChange,
      getBreeds: this.getBreeds
    };
  }

  // using the word handle indicates it handles something
  handleLocationChange = event => {
    // using event.target.value is awesome!
    this.setState({
      location: event.target.value,
      breed: ''
    });
  };

  handleAnimalChange = event => {
    this.setState(
      {
        animal: event.target.value
      },
      this.getBreeds
    );
  };

  handleBreedChange = event => {
    this.setState({
      breed: event.target.value
    });
  };

  getBreeds() {
    if (this.state.animal) {
      petfinder.breed
        .list({
          animal: this.state.animal
        })
        .then(data => {
          if (
            data.petfinder &&
            data.petfinder.breeds &&
            Array.isArray(data.petfinder.breeds.breed)
          ) {
            this.setState({
              breeds: data.petfinder.breeds.breed
            });
          } else {
            this.setState({ breeds: [] });
          }
        });
    } else {
      this.setState({
        breeds: []
      });
    }
  }

  render() {
    return (
      <div>
        <NavBar />
        <Provider value={this.state}>
          <Router>
            <LoadableResults path="/" />
            {/* changed this to the component */}
            <LoadableDetails path="/details/:id" />
            <LoadableSearchParams path="/search-params" />
          </Router>
        </Provider>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
