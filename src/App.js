import React from "react";
import Skycons from "react-skycons";
const Loading = () => {
  return (
    <div className="wrapper-box">
      <div className="weather-box">
        <div style={{ color: "black", padding: "30px" }}>
          <h2>Loading your weather data ...</h2>
        </div>
      </div>
    </div>
  );
};
const convertToF = celsius => {
  return Math.round(celsius * 1.8 + 32);
};
const convertToC = faren => {
  return Math.round((faren - 32) / 1.8);
};
class WeatherBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: Math.round(props.weather.temp),
      type: "F"
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.state.type === "F"
      ? this.setState({ temp: convertToC(this.state.temp), type: "C" })
      : this.setState({ temp: convertToF(this.state.temp), type: "F" });
  }

  setCustomStyle(lowerC, topU) {
    return {
      background: `linear-gradient(343deg, transparent 65px, ${lowerC} 10px, ${topU} 100%)`
    };
  }
  setCustomBackground(color) {
    document.body.style.backgroundColor = color;
  }
  setCustomGradient(icon) {
    switch (icon) {
      case "CLEAR_DAY":
        this.setCustomBackground("#FFA04E");
        return this.setCustomStyle("#FFA04E", "#FF7805");
      case "CLEAR_NIGHT":
        this.setCustomBackground("#8F7BAB");
        return this.setCustomStyle("#8F7BAB", "#3C2562");
      case "PARTLY_CLOUDY_DAY":
      case "PARTLY_CLOUDY_NIGHT":
        this.setCustomBackground("#778BA4");
        return this.setCustomStyle("#778BA4", "#6791FB");
      case "CLOUDY":
        this.setCustomBackground("#535D6C");
        return this.setCustomStyle("#535D6C", "#91969F");
      case "RAIN":
        this.setCustomBackground("#92AFD1");
        return this.setCustomStyle("#92AFD1", "#58759C");
      case "SNOW":
        this.setCustomBackground("#C0DBEE");
        return this.setCustomStyle("#C0DBEE", "#D9F2FB");
      case "FOG":
        this.setCustomBackground("#808A86");
        return this.setCustomStyle("#808A86", "#374B4D");
      default:
        this.setCustomBackground("#6BA6B3");
        return this.setCustomStyle("#6BA6B3 ", "#FFFFFF");
    }
  }
  render() {
    const { icon, currentSummary, hourlySummary } = this.props.weather;
    const tempicon = icon.replace("-", "_").toUpperCase();
    const style = this.setCustomGradient(tempicon);
    console.log(style);
    return (
      <div className="wrapper-box">
        <div className="weather-box">
          <div id="weather" style={style}>
            <div className="weather-icon">
              <Skycons
                ref="canvas"
                id="weatherCanvas"
                color="white"
                icon={tempicon}
                autoplay={true}
              />
            </div>
          </div>
          <div className="weather-info">
            <div className="weather-degree" onClick={this.handleClick}>
              {this.state.temp}{`°` + this.state.type}
            </div>
            <div className="weather-status">
              <div className="weather-status-current">
                {currentSummary}
              </div>
              <hr />
              <div className="weather-status-minute">
                {hourlySummary}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: {},
      loading: true
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.getQuote();
  }
  async requestWeatherData(apiKey, position) {
    const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${apiKey}/${position
      .coords.latitude},${position.coords.longitude}`;
    return await fetch(url).then(response => response.json());
  }
  async componentDidMount() {
    //changeBodyColor();
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(position => {
        this.requestWeatherData(
          "b54f7df09d2c5d46f56168502556ae78",
          position
        ).then(d => {
          const icon = d.currently.icon;
          const temp = d.currently.temperature;
          const currentSummary = d.currently.summary;
          const hourlySummary = d.hourly.summary;
          const unit = d.flags.units;
          this.setState(
            {
              weather: { icon, temp, currentSummary, hourlySummary, unit },
              loading: false
            },
            () => {
              console.log(JSON.stringify(this.state.weather));
            }
          );
        });
      });
    }
  }
  render() {
    return (
      <div className="wrapper">
        {!this.state.loading
          ? <WeatherBox
              weather={this.state.weather}
              onClick={this.handleClick}
            />
          : <Loading loadMessage />}
      </div>
    );
  }
}
export default App;
