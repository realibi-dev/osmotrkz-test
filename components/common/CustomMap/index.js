import { useYMaps } from '@pbe/react-yandex-maps';
import { useRef, useEffect } from 'react';

const CustomMap = ({ width=320, height=240, handleClick, placemarkCoordinates }) => {
    const mapRef = useRef(null);
    const ymaps = useYMaps(["Map"]);
  
    useEffect(() => {
        if (!ymaps || !mapRef.current) {
            return;
        }
  
        mapRef.current = new ymaps.Map(mapRef.current, {
            center: [43.238949, 76.889709],
            zoom: 10
        })

        mapRef.current.Placemark

        mapRef.current.events.add('click', function (e) {
            if (!mapRef.current.balloon.isOpen()) {
                var coords = e.get('coords');
                handleClick(coords[0].toPrecision(6), coords[1].toPrecision(6));
                mapRef.current.balloon.open(coords, {
                    contentHeader:'Сохранено!',
                    contentBody:'<p>Мы сохранили эти координаты.</p>',
                    contentFooter:'<sup>Если все правильно, можете ничего не менять.</sup>'
                });
            }
            else {
                mapRef.current.balloon.close();
            }
        });
    }, [ymaps]);
  
    return <div ref={mapRef} style={{ width, height }} />;
};

export default CustomMap;