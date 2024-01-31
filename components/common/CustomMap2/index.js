import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import styles from '../../../pages/createApplication/style.module.css'

const CustomMap2 = () => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState([55.75, 37.57]);

  useEffect(() => {
    if (address.length > 3) {
      fetchSuggestions(address);
    }
  }, [address]);

  const fetchCoordinates = async (selectedAddress) => {
    const apiKey = process.env.YANDEX_MAP_API_KEY;
    console.log("APIKEY:", apiKey);
    try {
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${selectedAddress}`
      );
  
      if (!response.ok) {
        throw new Error('Response from Yandex Geocoder was not ok.');
      }
  
      const data = await response.json();
      const firstResult = data.response.GeoObjectCollection.featureMember[0];
      if (firstResult) {
        const pos = firstResult.GeoObject.Point.pos.split(' ');
        const coordinates = [parseFloat(pos[1]), parseFloat(pos[0])];
        return coordinates;
      }
      return null;
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  const fetchSuggestions = async (address) => {
    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY;
    try {
      const response = await fetch(
        `https://suggest-maps.yandex.ru/suggest-geo?apikey=${apiKey}&lang=ru_RU&part=${address}`
      );
  
      if (!response.ok) {
        throw new Error('Response from Yandex Suggest was not ok.');
      }
  
      const data = await response.json();
      const suggestions = data.results.map(item => item.text);
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };  

  const handleAddressChange = (event) => {
    const newAddress = event.target.value;
    setAddress(event.target.value);
    if (newAddress.length > 3) {
        fetchSuggestions(newAddress);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setAddress(suggestion);
    const newCoordinates = await fetchCoordinates(suggestion);
    if (newCoordinates) {
      setCoordinates(newCoordinates);
    }
  };

  return (
    <YMaps>
        <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 25 }}>
            <label>Адрес</label>
            <textarea
                rows={1}
                placeholder='Адрес места осмотра'
                className={styles.textArea}
                onChange={handleAddressChange}
                value={address}
            >
            </textarea>
        </div>
        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <Map defaultState={{ center: coordinates, zoom: 9 }} width="100%" height="400px">
          <Placemark geometry={coordinates} />
        </Map>
      </div>
    </YMaps>
  );
};

export default CustomMap2;
