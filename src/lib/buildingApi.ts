// =============================================
// 건축물대장 API 유틸리티
// 건축HUB (eais.go.kr) Open API
// API_KEY = VITE_BUILDING_API_KEY (환경변수)
// =============================================

export interface BuildingInfo {
    buildingName: string;       // 건물명
    mainPurposeName: string;    // 주용도명 (공장, 창고 등)
    groundFloorCount: number;   // 지상층수
    undergroundFloorCount: number; // 지하층수
    totalArea: number;          // 연면적 (㎡)
    buildingArea: number;       // 건축면적 (㎡)
    plotArea: number;           // 대지면적 (㎡)
    floorAreaRatio: number;     // 용적률
    buildingCoverageRatio: number; // 건폐율
    useApprovalDate: string;    // 사용승인일
    illegalBuilding: boolean;   // 위반건축물 여부
    structureName: string;      // 구조명
}

// 주소에서 시군구코드, 법정동코드, 번, 지 파싱
export function parseAddressCode(sigunguCd: string, bjdongCd: string, bun: string, ji: string) {
    return { sigunguCd, bjdongCd, bun: bun.padStart(4, '0'), ji: (ji || '0').padStart(4, '0') };
}

// 건축물대장 표제부 조회 (건물면적, 연면적, 층수 등)
export async function fetchBuildingLedger(
    apiKey: string,
    sigunguCd: string,
    bjdongCd: string,
    bun: string,
    ji: string
): Promise<BuildingInfo | null> {
    const params = new URLSearchParams({
        serviceKey: apiKey,
        sigunguCd,
        bjdongCd,
        platGbCd: '0', // 0: 대지, 1: 산, 2: 블록
        bun: bun.padStart(4, '0'),
        ji: (ji || '0').padStart(4, '0'),
        _type: 'json',
        numOfRows: '10',
        pageNo: '1',
    });

    // 총괄표제부: 건물 전체 대표 정보
    const url = `https://apis.data.go.kr/1613000/BldRgstHubService/getBrRecapTitleInfo?${params}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const item = data?.response?.body?.items?.item;
        const row = Array.isArray(item) ? item[0] : item;
        if (!row) return null;

        return {
            buildingName: row.bldNm || '',
            mainPurposeName: row.mainPurpsCdNm || '',
            groundFloorCount: parseInt(row.grndFlrCnt) || 0,
            undergroundFloorCount: parseInt(row.ugrndFlrCnt) || 0,
            totalArea: parseFloat(row.totArea) || 0,
            buildingArea: parseFloat(row.archArea) || 0,
            plotArea: parseFloat(row.platArea) || 0,
            floorAreaRatio: parseFloat(row.vlRat) || 0,
            buildingCoverageRatio: parseFloat(row.bcRat) || 0,
            useApprovalDate: row.useAprDay || '',
            illegalBuilding: row.vlRatEstmTot === '위반' || false,
            structureName: row.mainStrctCdNm || '',
        };
    } catch (e) {
        console.error('건축물대장 API 오류:', e);
        return null;
    }
}

// 한국 행정구역 코드 매핑 (시군구코드 5자리)
// 매물 등록 시 주소에서 자동 추출하기 위한 주요 코드
export const SIGUNGU_CODES: Record<string, string> = {
    // 경기도
    '수원시장안구': '41111', '수원시권선구': '41113', '수원시팔달구': '41115', '수원시영통구': '41117',
    '성남시수정구': '41131', '성남시중원구': '41133', '성남시분당구': '41135',
    '의정부시': '41150', '안양시만안구': '41171', '안양시동안구': '41173',
    '부천시': '41190', '광명시': '41210', '평택시': '41220', '동두천시': '41250',
    '안산시상록구': '41271', '안산시단원구': '41273', '고양시덕양구': '41281',
    '고양시일산동구': '41285', '고양시일산서구': '41287', '과천시': '41290',
    '구리시': '41310', '남양주시': '41360', '오산시': '41370', '시흥시': '41390',
    '군포시': '41410', '의왕시': '41430', '하남시': '41450', '용인시처인구': '41461',
    '용인시기흥구': '41463', '용인시수지구': '41465', '파주시': '41480', '이천시': '41500',
    '안성시': '41550', '김포시': '41570', '화성시': '41590', '광주시': '41610',
    '양주시': '41630', '포천시': '41650', '여주시': '41670',
    '연천군': '41800', '가평군': '41820', '양평군': '41830',
    // 인천
    '인천중구': '28110', '인천동구': '28140', '인천미추홀구': '28177', '인천연수구': '28185',
    '인천남동구': '28200', '인천부평구': '28237', '인천계양구': '28245', '인천서구': '28260',
    // 서울
    '서울종로구': '11110', '서울중구': '11140', '서울용산구': '11170',
};
