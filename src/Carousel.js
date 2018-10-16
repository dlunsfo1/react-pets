import React from 'react';

class Carousel extends React.Component {
  state = {
    photos: [],
    active: 0
  };

  // current method
  // constructor(props) {
  //   super(props);

  //   this.handleIndexClick = this.handleIndexClick.bind(this);
  // }

  // needs to be static and also static so I can do this Carousel.getDerivedStateFromProps

  static getDerivedStateFromProps({ media }) {
    let photos = [];

    if (media && media.photos && media.photos.photo) {
      photos = media.photos.photo.filter(photo => photo['@size'] === 'pn');
    }
    return { photos };
  }

  // arrow function
  handleIndexClick = event => {
    // always a problem, what is 'this' mean here using an arrow function fixes this issue.
    this.setState({
      active: +event.target.dataset.index
    });
  };

  render() {
    const { photos, active } = this.state;
    return (
      <div className="carousel">
        <img src={photos[active].value} alt="primary animal" />
        <div className="carousel-smaller">
          {photos.map((photo, index) => (
            /* eslint-disable-next-line */
            <img
              onClick={this.handleIndexClick}
              key={photo.value}
              src={photo.value}
              className={index === active ? 'active' : ''}
              alt="current animal thumbnail"
              data-index={index}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Carousel;
