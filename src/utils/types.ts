export type Datapoint = {
    airline: string;
    airline_country:string;
    distance:number
    from_airport:string;
    from_city:string;
    from_country:string;
    from_lat:number;
    from_long:number;
    to_airport:string;
    to_city:string;
    to_country:string;
    to_lat:number;
    to_long:number
}

export type FlightNode = {
    city:string;
    airport:string;
    country:string;
    lat:number;
    long:number
}

export type Flights = Record<string, Flight[]>


export type Flight =  {
    from: FlightNode
    to: FlightNode
    distance: number
}

export type Arc = {
    x1: number;
    x2:number;
    y1:number;
    y2:number;
    distance:number;
}

