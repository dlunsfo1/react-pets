// function component
import React from 'react';

import pf from 'petfinder-client';
import { Consumer } from './SearchContext';
import Pet from './Pet';
import SearchBox from './SearchBox';

// class component

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

class Results extends React.Component {
  state = {
    pets: []
  };

  componentDidMount() {
    this.search();
  }

  search = () => {
    petfinder.pet
      .find({
        output: 'full',
        location: this.props.searchParams.location,
        animal: this.props.searchParams.animal,
        breed: this.props.searchParams.breed
      })
      .then(data => {
        let pets;

        if (data.petfinder.pets && data.petfinder.pets.pet) {
          if (Array.isArray(data.petfinder.pets.pet)) {
            pets = data.petfinder.pets.pet;
          } else {
            pets = [data.petfinder.pets.pet];
          }
        } else {
          pets = [];
        }

        this.setState({
          pets
        });
      });
  };

  render() {
    return (
      <div className="search">
        <SearchBox search={this.search} />
        {this.state.pets.map(currentPet => {
          let breed;

          if (Array.isArray(currentPet.breeds.breed)) {
            breed = currentPet.breeds.breed.join(', ');
          } else {
            breed = currentPet.breeds.breed;
          }
          return (
            <Pet
              name={currentPet.name}
              animal={currentPet.animal}
              breed={breed}
              media={currentPet.media}
              location={`${currentPet.contact.city}, ${
                currentPet.contact.state
              }`}
              key={currentPet.id}
              id={currentPet.id}
            />
          );
        })}
      </div>
    );
  }
}

export default function ResultsWithContext(props) {
  return (
    <Consumer>
      {context => <Results {...props} searchParams={context} />}
    </Consumer>
  );
}
