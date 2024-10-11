export interface Stadium {
	id: string;
	name: string;
	city: string;
	state: string;
	country: string;
	zipcode: string;
	address: string;
	timezone: string;
	lon: number;
	lat: number;
}

export interface NewStadium extends Omit<Stadium, "id"> {}
export interface StadiumUpdate extends Partial<NewStadium> {}
