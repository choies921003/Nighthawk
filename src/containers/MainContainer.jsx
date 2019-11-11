import React, { Component } from 'react';
import '../css/LandingPage.css';
import CategoryContainer from './CategoryContainer.jsx';
import VenueContainer from './VenueContainer.jsx';

class MainContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // stateful components used for search bar and results
      location: '',
      searchInput: '',
      searchResults: [],
      
      // components used for map display
      latitude: '',
      longitude: '',

      // components related to selecting specific venue
      venueId: '',
      venueName: '',
      venueUrl: '',
      venueImage: '',
      venueLocation: '',
      venuePhone: '',
      waitTime: 0,
      venueWaitTimeList: [],

      // components for infinite scrolling functionality
      current: 25,
      total: 50,
      
      // components for conditional rendering of containers
      homePage: true,
      categoryPage: false,
      venuePage: false,
    }

    this.setLocation = this.setLocation.bind(this);
    this.setSearchInput = this.setSearchInput.bind(this);
    this.search = this.search.bind(this);

    this.selectVenue = this.selectVenue.bind(this);
    this.setWaitTime = this.setWaitTime.bind(this);
    this.addWaitTime = this.addWaitTime.bind(this);
  }

  // functions used for search bar
  setLocation(event) {
    this.setState({ location: event.target.value });
  }
  setSearchInput(event) {
    this.setState({ searchInput: event.target.value });
    // console.log(this.state.searchResults)
  }
  search() {
    // console.log('THIS STATE LOCATION : ', this.state.location);
    fetch ('/api', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({searchInput: this.state.searchInput, location: this.state.location})
    })
      .then(response => response.json())  
      .then(data => {
        const parsedData = JSON.parse(data);
        // console.log('PARSEDDATA: ', parsedData);
        // console.log('introspecting the data: ', parsedData.businesses[0])
        const firstBusinessLatitude = parsedData.businesses[0].coordinates.latitude;
        const firstBusinessLongitude = parsedData.businesses[0].coordinates.longitude;
        
        const listOfBusinesses = [];
        // console.log(parsedData.businesses.length)
        if (this.state.current <= 50) {
          for (let i = 0; i < this.state.current; i += 1) {
            // console.log('LIST BUSINESSES -> ', listOfBusinesses)
            listOfBusinesses.push({
              id: parsedData.businesses[i].id, 
              name: parsedData.businesses[i].name, 
              image: parsedData.businesses[i].image_url, 
              location: parsedData.businesses[i].location,
              category: parsedData.businesses[i].categories[0].title,
            });
          }
  
          // this.setState({ latitude: firstBusinessLatitude.toString(), longitude: firstBusinessLongitude.toString() })
  
          this.setState(state => {
            return {
              latitude: firstBusinessLatitude.toString(),
              longitude: firstBusinessLongitude.toString(),
              searchResults: listOfBusinesses,
              current: state.current + 5,

            }
          })
        }
      })
      this.setState({ 
        homePage: false,
        categoryPage: true,
        venuePage: false,
      })
    
  }

  // functions used for to select a specific venue on the category page to display on the venue page
  selectVenue(id, name, url, image, location, phone) {
    const venueId = id;
    const venueName = name;
    const venueUrl = url;
    const venueImage = image;
    const venueLocation = location;
    const venuePhone = phone;

    this.setState({ 
      homePage: false,
      categoryPage: false,
      venuePage: true,
      venueId,
      venueName,
      venueUrl,
      venueImage,
      venueLocation,
      venuePhone,
    })
  }
  setWaitTime(event) {
    this.setState({ waitTime: event.target.value })
  }
  addWaitTime() {
    // create body from the things we've saved in state through the setwaittime and selectvenue func
    const body = {
      waitTime: this.state.waitTime,
      venueId: this.state.venueId,
      venueName: this.state.venueName,
    }
    // console.log(body);
    fetch('/dbRouter/addWaitTime', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    })
    .then(() => console.log('addwaittime fetch request successful'))
    .catch((err) => {
      console.log(`${err}: addWaitTime function error when adding wait time`)
    })
  }

  render() {
    // conditional rendering for the homepage; default true (shows first)
    let home = null;
    if (this.state.homePage) {
      document.body.style.background = "url('https://images.pexels.com/photos/1604200/pexels-photo-1604200.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')";
      home = 
      <div id="home-content">
        <div id="logo">
          {/* <img id="logo-pic" src="https://kingendodontics.com/wp-content/uploads/2018/01/KingEndo_staff_icon.png"/> */}
          <img id="logo-pic" src="https://image.flaticon.com/icons/png/512/876/876569.png"/>
          <h1>Queue</h1>
        </div>
        <section id="home-page-search-bar">
          <input type="input" id="searchInput" placeholder="Business or Category" onChange={this.setSearchInput}/>
          <input type="input" id="location" placeholder="Location" onChange={this.setLocation}/>
          <input type="button" id="searchButton" onClick={this.search}/>
        </section>
      </div>

    }

    // conditional rendering for the category page
    let category = null;
    if (this.state.categoryPage) {
      document.body.style.background = "url('')";
      category = 
      <CategoryContainer 
        // props for search bar
        setSearchInput = {this.setSearchInput}
        setLocation = {this.setLocation}
        search = {this.search}

        searchInput={this.state.searchInput}
        location={this.state.location}
        searchResults={this.state.searchResults}

        selectVenue={this.selectVenue}
        waitTimes={this.state.waitTimes}

        latitude={this.state.latitude}
        longitude={this.state.longitude}

        homePage={this.state.homePage}
        categoryPage={this.state.categoryPage}
        venuePage={this.state.venuePage}
        current={this.state.current}
      />
    }

    // conditional rendering for the venue page
  let venue = null;
  if (this.state.venuePage) {
    venue = 
    <VenueContainer
      // props for search bar
      setSearchInput = {this.setSearchInput}
      setLocation = {this.setLocation}
      search = {this.search}

      searchInput={this.state.searchInput}
      location={this.state.location}
      searchResults={this.state.searchResults}

      // props for venue selection
      venueId={this.state.venueId}
      venueName={this.state.venueName}
      venueUrl={this.state.venueUrl}
      venueImage={this.state.venueImage}
      venueLocation={this.state.venueLocation}
      venuePhone={this.state.venuePhone}
      venueWaitTimeList={this.state.venueWaitTimeList}
      setWaitTime={this.setWaitTime}
      addWaitTime={this.addWaitTime}

      homePage={this.state.homePage}
      categoryPage={this.state.categoryPage}
      venuePage={this.state.venuePage} 
    />
  }
    
    return (
      <div>
      {home}
      {category}
      {venue}
      </div>
    )
  }
}

export default MainContainer;
