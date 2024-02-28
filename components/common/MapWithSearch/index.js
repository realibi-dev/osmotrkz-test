import React, { useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

// Карта по идее рабочая, но у нас походу API ключ ограничен, т.к. бесплатный

const MapWithSearch = ({ apiKey }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [mapState, setMapState] = useState({
    center: [55.751574, 37.573856], // Центр Москвы
    zoom: 9,
  });

  const handleAddressChange = async (event) => {
    const newAddress = event.target.value;
    setAddress(newAddress);

    if (newAddress.length > 3) {
      // const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${apiKey}&geocode=${newAddress}`);
      // const data = await response.json();
      // console.log("YANDEX response:", data);
      // console.log("YANDEX key:", apiKey);
      // const newSuggestions = data.response.GeoObjectCollection.featureMember.map(member => member.GeoObject);
      // setSuggestions(newSuggestions);
      ymaps.suggest(newAddress).then(function (items) {
          setSuggestions(items);
          console.log(items);
      });
    }
  };

  const selectSuggestion = (suggestion) => {
    const coords = suggestion.Point.pos.split(' ').map(Number).reverse();
    setAddress(suggestion.name);
    setMapState({ ...mapState, center: coords });
    setSuggestions([]);
  };

  return (    
    <div>
      <script src='https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=5ff5c5d4-eb68-41f5-8adf-ad545fa1fee8&suggest_apikey=05fccc59-6586-4563-8d7c-87bd890b4308'></script>
      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="Введите адрес..."
      />
      <div>
        {suggestions.map((suggestion, value) => (
          <div key={value} onClick={() => selectSuggestion(suggestion)}>
            {suggestion.displayName}
          </div>
        ))}
      </div>
      <YMaps>
        <Map state={mapState} width="100%" height="400px">
          <Placemark geometry={mapState.center} />
        </Map>
      </YMaps>
    </div>
  );
};

export default MapWithSearch;
