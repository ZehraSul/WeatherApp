// Importing components

import React, { Component } from "react";
import "isomorphic-fetch";
import "./App.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

// Setting original state values

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: {},
      error: null,
      isLoaded: false,
      place: "cape town",
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.getWeather = this.getWeather.bind(this);
  }

  // Updating value of place

  changeHandler(e) {
    this.setState({
      place: e.target.value,
    });
  }

  // On click of submit button call getWeather function

  submitHandler(e) {
    e.preventDefault();
    this.getWeather();
  }

  // Calls the api, sets state if user entered value is found, else shows error

  getWeather() {
    const apiKey = process.env.REACT_APP_API_KEY;
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${this.state.place}&units=metric&appid=${apiKey}`;

    fetch(apiURL)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.cod === 200) {
            this.setState({
              isLoaded: true,
              apiData: result,
            });
          } else {
            this.setState({
              isLoaded: true,
              error: result,
            });
          }
        },

        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  // Calls the getWeather function on page load

  componentDidMount() {
    this.getWeather();
  }

  render() {
    const { error, isLoaded, apiData } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="App">
          <h1>Weather App</h1>

          {/* Input field and button */}

          <InputGroup
            id="input"
            style={{ width: "25rem" }}
            onChange={this.changeHandler}
          >
            <FormControl
              placeholder="Please enter a location"
              aria-label="Please enter a location"
              aria-describedby="basic-addon2"
            />
            <Button variant="primary" onClick={this.submitHandler}>
              Submit
            </Button>
          </InputGroup>

          {/* Card to display information */}

          <Card className="mx-auto" style={{ width: "25rem" }}>
            <Card.Img
              src={`https://openweathermap.org/img/wn/${apiData.weather[0].icon}@4x.png`}
              alt="Weather icon"
            />
            <Card.Body>
              <Card.Title>{apiData.name}</Card.Title>
              <Card.Text>
                It is <strong>{apiData.main.temp}°C </strong>
                and feels like <strong>{apiData.main.feels_like}°C </strong>with
                a low of <strong>{apiData.main.temp_min}°C </strong>and a high
                of <strong>{apiData.main.temp_max}°C </strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      );
    }
  }
}

export default App;
