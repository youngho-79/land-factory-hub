import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        kakao: any;
    }
}

export default function KakaoMap({ address }: { address: string }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

    useEffect(() => {
        if (!apiKey) return;

        const scriptId = 'kakao-map-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
            document.head.appendChild(script);
        }

        const initMap = () => {
            window.kakao.maps.load(() => {
                if (!mapRef.current) return;

                // 마스킹된 주소 대신, 실제 주소(address)에서 번지를 제외한 읍/면/동/리 까지만 추출
                const searchQuery = address.replace(/\s+\d+.*$/, '');

                const geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.addressSearch(searchQuery, (result: any, status: any) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                        const options = {
                            center: coords,
                            level: 5, // 반경을 넓게 보여주기 위해 레벨 조정
                        };
                        const map = new window.kakao.maps.Map(mapRef.current, options);

                        // 정확한 위치를 숨기고 "이 근방" 이라는 느낌을 주도록 반경 서클만 그리기
                        const circle = new window.kakao.maps.Circle({
                            center: coords,
                            radius: 400, // 400미터 반경
                            strokeWeight: 2,
                            strokeColor: '#D4AF37', // Gold color
                            strokeOpacity: 0.8,
                            fillColor: '#D4AF37',
                            fillOpacity: 0.2
                        });

                        circle.setMap(map);
                    }
                });
            });
        };

        if (window.kakao && window.kakao.maps) {
            initMap();
        } else {
            script.onload = initMap;
        }
    }, [address, apiKey]);

    if (!apiKey) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted border-dashed border-2 border-border p-6 text-center">
                <span className="text-3xl mb-2">🗺️</span>
                <p className="text-sm font-semibold text-foreground mb-1">카카오맵 연동 대기중</p>
                <p className="text-xs text-muted-foreground break-keep">
                    서비스 배포 후 카카오에서 API 키(JavaScript 키)를 발급받아<br />
                    환경변수(<code>VITE_KAKAO_MAP_API_KEY</code>)에 입력해주세요.
                </p>
            </div>
        );
    }

    return <div ref={mapRef} className="w-full h-full" />;
}
