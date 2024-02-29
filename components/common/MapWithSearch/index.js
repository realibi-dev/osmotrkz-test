import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark, SearchControl } from '@pbe/react-yandex-maps';

// Карта по идее рабочая, но у нас походу API ключ ограничен, т.к. бесплатный
// https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=25f9ba01-e442-4789-b995-ef1341e8d62a&suggest_apikey=f1213ace-e821-4b4e-9033-9d655ce35294
const loadYandexMapsScript = (jsApiKey, suggestApiKey) => {
  const script = document.createElement('script');
  script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${jsApiKey}&suggest_apikey=${suggestApiKey}`;
  script.type = 'text/javascript';
  document.head.appendChild(script);
};

const MapWithSearch = ({ apiKey, suggestApiKey }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [mapState, setMapState] = useState({
    center: [55.751574, 37.573856], // Центр Москвы
    zoom: 9,
  });

  useEffect(() => {
    loadYandexMapsScript(apiKey, suggestApiKey);
  }, []);


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
        console.log("ITEMS: ", items);  
        setSuggestions(items);          
      });
    }
  };


  const selectSuggestion = (suggestion) => {
    const coords = suggestion.Point.pos.split(' ').map(Number).reverse();
    setAddress(suggestion.name);
    setMapState({ ...mapState, center: coords });
    setSuggestions([]);
  };

  const getSuggestions = (query) => {
    window.ymaps.suggest(query)
      .then(items => {
        console.log("ITEMS2", items);
        setSuggestions(items);
      })
      .catch(error => console.log(error));
  };

  return (                
    <div>
      <input type="text" onChange={(e) => getSuggestions(e.target.value)} />
      <YMaps 
        query={{ 
          apikey: apiKey,
          load: 'package.full', 
        }}      
        onLoad={(ymaps) => {
          window.ymaps = ymaps; // Сохраняем ссылку на ymaps в глобальный объект для последующего доступа
        }}
      >
        <Map state={mapState} width="100%" height="400px">
          <Placemark geometry={mapState.center} />
          
          <ul>
            {suggestions.map((item, index) => (
              <li key={index}>{item.displayName}</li>
            ))}
          </ul>
        </Map>
      </YMaps>
    </div>
  );
};

export default MapWithSearch;
