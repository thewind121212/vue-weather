export interface AstronomyData {
    data: Data;
}

interface Data {
    dates: Dates;
    observer: Observer;
    table: Table;
}

interface Dates {
    from: string;
    to: string;
}

interface Observer {
    location: Location;
}

interface Location {
    longitude: number;
    latitude: number;
    elevation: number;
}

interface Table {
    header: string[];
    rows: Row[];
}

interface Row {
    entry: Entry;
    cells: Cell[];
}

interface Entry {
    id: string;
    name: string;
}

export interface Cell {
    date: string;
    id: string;
    name: string;
    distance: Distance;
    position: Position;
    extraInfo: ExtraInfo;
}

interface Distance {
    fromEarth: FromEarth;
}

interface FromEarth {
    au: string;
    km: string;
}

interface Position {
    horizontal: Horizontal;
    horizonal: Horizontal;
    equatorial: Equatorial;
    constellation: Constellation;
}

interface Horizontal {
    altitude: Altitude;
    azimuth: Azimuth;
}

interface Altitude {
    degrees: string;
    string: string;
}

interface Azimuth {
    degrees: string;
    string: string;
}

interface Equatorial {
    rightAscension: RightAscension;
    declination: Declination;
}

interface RightAscension {
    hours: string;
    string: string;
}

interface Declination {
    degrees: string;
    string: string;
}

interface Constellation {
    id: string;
    short: string;
    name: string;
}

interface ExtraInfo {
    elongation: number | null;
    magnitude: number | null;
    phase?: Phase;
}

type moonPhaseType = "Waning Crescent" | "Waning Gibbous" | "Waxing Crescent" | "Waxing Gibbous"

export type responseMoonPhaseType = "New Moon" | 'Waxing Crescent' | "First Quarter" | 'Waxing Gibbous' | "Full Moon" | "Waning Gibbous" | "Last Quarter" | "Waning Crescent"

interface Phase {
    angel: string;
    fraction: string;
    string: moonPhaseType;
}


export interface MoonReturn {
    date: string
    moonPhase: responseMoonPhaseType
}



export interface  MoonResponse {
    current: string;
    data: MoonReturn[];
    message: string;
}