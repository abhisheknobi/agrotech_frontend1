import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";
import '../styles/WeatherPage.css';
import CropRecommendation from './CropRecommendation';

const cropImage = require('../components/images/crop.png');
const fertilizerImage = require('../components/images/fertilizer.png');
const newsImage = require('../components/images/news.png');

// register the neccessary chart components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const navigate = (path) => {
	window.location.href = path;
}

// Soil Types for Crop Recommendations
const soilCropData = {
	"Laterite Soil": ["Coconut", "Cashew", "Pineapple", "Pepper"],
	"Alluvial Soil": ["Paddy", "Sugarcane", "Banana", "Vegetables"],
	"Black Soil": ["Cotton", "Maize", "Turmeric", "Sunflower"],
	"Peaty Soil": ["Rice", "Coconut", "Arecanut"],
	"Sandy Soil": ["Cashew", "Coconut", "Pineapple"]
};

const WeatherPage = () => {
	const [input, setInput] = useState('');
	const [weather, setWeather] = useState({ loading: false, data: {}, error: false });
	const [airQuality, setAirQuality] = useState(null);
	const [soilType, setSoilType] = useState("Laterite Soil");
	const [predictedCrops, setPredictedCrops] = useState(soilCropData["Laterite Soil"]);
	const [forecast, setForecast] = useState([]);
	const [cropAlert, setCropAlert] = useState("");
	const [selectedSoilType, setSelectedSoilType] = useState("Laterite Soil");
	const [cropRecommendation, setCropRecommendation] = useState("");
	const [isButton, setIsButton] = useState(false);

	const api_key = 'a1261fdbd807312e84b79a61ca2ca284';

	// Function to Fetch 5-Day Weather Forecast
	const fetchWeatherForecast = async (city) => {
		try {
			const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${api_key}`);

			// Extract Daily Averages
			const dailyData = res.data.list.filter((_, index) => index % 8 === 0).map((item) => ({
				date: new Date(item.dt * 1000).toLocaleDateString(),
				temp: item.main.temp
			}));

			setForecast(dailyData);
		} catch (error) {
			console.error("Error fetching forecast:", error);
		}
	};

	// Fetch Weather & Air Quality by City
	const fetchWeatherByCity = async (city) => {
		setWeather({ ...weather, loading: true });

		try {
			// Fetch weather data
			const weatherRes = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
				params: { q: city, units: "metric", appid: api_key }
			});

			// Fetch air quality data
			const { lat, lon } = weatherRes.data.coord;
			const airRes = await axios.get("https://api.openweathermap.org/data/2.5/air_pollution", {
				params: { lat, lon, appid: api_key }
			});

			// Estimate soil moisture (Simulated based on humidity & rain)
			const temp = weatherRes.data.main.temp;
			const humidity = weatherRes.data.main.humidity;
			const precipitation = weatherRes.data.rain ? weatherRes.data.rain["1h"] || 0 : 0;
			const soilMoisture = Math.min((humidity * 0.6 + precipitation * 3), 100).toFixed(2);
			const windSpeed = weatherRes.data.wind.speed;
			const rain = weatherRes.data.rain ? weatherRes.data.rain["1h"] || 0 : 0;

			let alertMessage = "";

			if (temp >= 35) alertMessage = "🔥 Extreme heat! Irrigate crops frequently.";
			else if (temp < 5) alertMessage = "❄️ Frost warning! Cover sensitive plants.";
			else if (humidity > 80) alertMessage = "💦 High humidity! Risk of pest infestation.";
			else if (windSpeed > 40) alertMessage = "💨 Strong winds expected! Secure crops.";
			else if (rain > 10) alertMessage = "🌧️ Heavy rain expected! Ensure proper drainage.";

			setCropAlert(alertMessage);
			setWeather({ data: { ...weatherRes.data, soilMoisture }, loading: false, error: false });
			setAirQuality(airRes.data.list[0].main.aqi);
		} catch (error) {
			setWeather({ ...weather, data: {}, error: true });
		}
	};

	// Fetch Weather & Air Quality by Location
	const fetchWeatherByLocation = async (latitude, longitude) => {
		setWeather({ ...weather, loading: true });

		try {
			// Fetch weather data
			const weatherRes = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
				params: { lat: latitude, lon: longitude, units: "metric", appid: api_key }
			});

			// Fetch air quality data
			const airRes = await axios.get("https://api.openweathermap.org/data/2.5/air_pollution", {
				params: { lat: latitude, lon: longitude, appid: api_key }
			});

			// Estimate soil moisture
			const humidity = weatherRes.data.main.humidity;
			const precipitation = weatherRes.data.rain ? weatherRes.data.rain["1h"] || 0 : 0;
			const soilMoisture = Math.min((humidity * 0.6 + precipitation * 3), 100).toFixed(2);

			setWeather({ data: { ...weatherRes.data, soilMoisture }, loading: false, error: false });
			setAirQuality(airRes.data.list[0].main.aqi);
		} catch (error) {
			setWeather({ ...weather, data: {}, error: true });
		}
	};



	// Auto-fetch weather when page loads
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => fetchWeatherByLocation(position.coords.latitude, position.coords.longitude),
				() => setWeather({ ...weather, error: true })
			);
		}
	}, []);

	// Update crops based on soil type
	useEffect(() => {
		setPredictedCrops(soilCropData[soilType]);
	}, [soilType]);

	// Handle Search Input
	const handleSearch = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (input.trim()) {
				fetchWeatherByCity(input);
				fetchWeatherForecast(input);
				setInput('');
			}
		}
	};

	return (
		<div className='weather-content-container'>
			<h1 className='main-heading'>🌤 Weather & Agricultural Insights</h1>
			{/* Search Bar */}
			<div className='search-bar'>
				<input
					type="text"
					className="city-search"
					placeholder="Enter City Name..."
					value={input}
					onChange={(event) => setInput(event.target.value)}
					onKeyPress={handleSearch}
				/>
			</div>

			{/* Weather & Forecast Cards in One Row */}
			<div className='content-wrapper'>
				{weather.loading && <p>Loading data...</p>}

				{weather.data.main && (
					<div className="weather-card">
						<h2 className='weather-card-heading'>{weather.data.name}, {weather.data.sys.country}</h2>
						<p>🌡 Temperature: {Math.round(weather.data.main.temp)}°C</p>
						<p>🌡 Feels Like: {Math.round(weather.data.main.feels_like)}°C</p>
						<p>💨 Wind Speed: {weather.data.wind.speed} m/s</p>
						<p>💧 Soil Moisture (Estimated): {weather.data.soilMoisture}%</p>
						<p>🌍 Air Quality Index: {airQuality}</p>
						<p>☀️ Sunrise: {new Date(weather.data.sys.sunrise * 1000).toLocaleTimeString()}</p>
						<p>🌇 Sunset: {new Date(weather.data.sys.sunset * 1000).toLocaleTimeString()}</p>
					</div>
				)}

				{forecast.length > 0 && (
					<div className="forecast-card">
						<h3>📈 5-Day Temperature Forecast</h3>
						<Line
							data={{
								labels: forecast.map((day) => day.date),
								datasets: [{
									label: "Temperature (°C)",
									data: forecast.map((day) => day.temp),
									borderColor: "#007aff",
									backgroundColor: "rgba(0, 122, 255, 0.2)",
									fill: true,
								}]
							}}
						/>
					</div>
				)}
			</div>

			{/* Alert Section Below */}
			<div className='crop-alert'>
				<h2>Weather Alerts: </h2>
				{cropAlert ? <p className="alert">{cropAlert}</p> : 'No warnings'}
			</div>
			
			{/* Crop & Fertilizer Recommendation Cards */}
			<div className="recommendation-container">
				<div className="recommendation-card" onClick={() => navigate('/crop-recommendation')}>
					<img src={cropImage} alt='crop recommendation' className='recommendation-image' />
					<h3>🌱 Crop Recommendation</h3>
					<p>Get the best crop suggestions based on soil and climate conditions.</p>
				</div>

				<div className="recommendation-card" onClick={() => navigate('/recommend-fertilizer')}>
					<img src= {fertilizerImage} alt="Fertilizer Recommendation" className="recommendation-image" />
					<h3>🧪 Fertilizer Recommendation</h3>
					<p>Discover the best fertilizers for your crops to boost yield.</p>
				</div>

				<div className='news-card' onClick={() => navigate('/news')}>
					<img src={newsImage} alt='newsCard'/>
					<h3> 📰 Get Latest Agricultural News</h3>
					<p>Discover whats happening around you.</p>
				</div>
			</div>

		</div>

	);
};

export default WeatherPage;
