import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark, SearchControl } from '@pbe/react-yandex-maps';

// Карта по идее рабочая, но у нас походу API ключ ограничен, т.к. бесплатный

const MapWithSearch = ({ apiKey }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [mapState, setMapState] = useState({
    center: [55.751574, 37.573856], // Центр Москвы
    zoom: 9,
  });

  useEffect(() => {
    const searchControl = document.querySelector('.ymaps-2-1-79-searchbox__input');
    if (searchControl) {
      searchControl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          setTimeout(() => {
            const selected = document.querySelector('.ymaps-2-1-79-searchbox-list__item_selected');
            if (selected) {
              const coords = selected.getAttribute('data-coordinates').split(',');
              setSelectedPoint({ coords: [parseFloat(coords[0]), parseFloat(coords[1])] });
            }
          }, 1000);
        }
      });
    }
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
      <YMaps>
        <Map state={mapState} width="100%" height="400px">
          <Placemark geometry={mapState.center} />
          {selectedPoint && <Placemark geometry={selectedPoint.coords} />}
          <SearchControl options={{ float: 'right' }} />
        </Map>
      </YMaps>
  );
};

export default MapWithSearch;
