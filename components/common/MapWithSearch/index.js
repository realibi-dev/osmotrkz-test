import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark, SearchControl } from '@pbe/react-yandex-maps';
import styles from "../../../pages/createApplication/style.module.css";
import mapStyles from "./style.module.css";

const loadYandexMapsScript = (jsApiKey, suggestApiKey) => {
  const script = document.createElement('script');
  script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${jsApiKey}&suggest_apikey=${suggestApiKey}`;
  script.type = 'text/javascript';
  document.head.appendChild(script);
};

const MapWithSearch = ({ apiKey, suggestApiKey, handleClick, handleSetAddress }) => {
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

  const getSuggestions = (query) => {
    setAddress(query);
    window.ymaps.suggest(query)
      .then(items => {
        setSuggestions(items);
      })
      .catch(error => console.log(error));
  };

  const handleSelectSuggestion = (displayName) => {
    window.ymaps.geocode(displayName, { results: 1 }).then(res => {
      const firstGeoObject = res.geoObjects.get(0);
      const coords = firstGeoObject.geometry.getCoordinates();

      // Вызов handleClick с округлением координат
      handleClick(coords[0].toPrecision(6), coords[1].toPrecision(6));

      // Обновление состояний для отображения метки и центрирования карты
      setSelectedPoint(coords);
      setMapState({ ...mapState, center: coords });

      // Обновление адреса в инпуте
      setAddress(displayName);
      handleSetAddress(displayName);
      setSuggestions([]);
    });
  };

  return (
    <div>
      {/* <input
        type="text"
        value={address}
        onChange={(e) => getSuggestions(e.target.value)}
      /> */}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>Адрес</label>
          <textarea
              rows={1}
              placeholder='Адрес места осмотра'
              className={styles.textArea}
              onChange={(e) => getSuggestions(e.target.value)}
              value={address}
          >
          </textarea>
      </div>
      <ul className={mapStyles.suggestionsList}>
        {suggestions.map((item, index) => (
          <li key={index} onClick={() => handleSelectSuggestion(item.displayName)}>
            {item.displayName}
          </li>
        ))}
      </ul>
      <YMaps query={{ apikey: apiKey, load: 'package.full' }}>
        <Map state={mapState} width="100%" height="400px">
          {selectedPoint && <Placemark geometry={selectedPoint} />}
        </Map>
      </YMaps>
      
    </div>
  );
};

export default MapWithSearch;