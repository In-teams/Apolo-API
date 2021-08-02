interface quarter {
    id: number | null;
    quarter: string;
}
interface month {
	id: number | null;
	month: string;
}
let months: month[] = [
	{ id: 1, month: 'JANUARY' },
	{ id: 2, month: 'FEBRUARY' },
	{ id: 3, month: 'MARCH' },
	{ id: 4, month: 'APRIL' },
	{ id: 5, month: 'MAY' },
	{ id: 6, month: 'JUNE' },
	{ id: 7, month: 'JULY' },
	{ id: 8, month: 'AUGUST' },
	{ id: 9, month: 'SEPTEMBER' },
	{ id: 10, month: 'OCTOBER' },
	{ id: 11, month: 'NOVEMBER' },
	{ id: 12, month: 'DECEMBER' },
];

let quarters: quarter[] = [
    { id: 1, quarter: 'QUARTER 1' },
    { id: 2, quarter: 'QUARTER 2' },
    { id: 3, quarter: 'QUARTER 3' },
    { id: 4, quarter: 'QUARTER 4' },
];

class App {
    getQuarter(month: number): quarter[]{
        let data = quarters
        if ([1, 2, 3].includes(month)) {
            data = data.slice(0, 1);
        } else if ([4, 5, 6].includes(month)) {
            data = data.slice(1, 2);
        } else if ([7, 8, 9].includes(month)) {
            data = data.slice(2, 3);
        } else if ([10, 11, 12].includes(month)) {
            data = data.slice(3, 4);
        }

        return data
    }
	getMonth(quarter: number | undefined): month[] {
        let data = months
		switch (quarter) {
			case 1:
				data = data.slice(0, 3);
				break;
			case 2:
				data = data.slice(3, 6);
				break;
			case 3:
				data = data.slice(6, 9);
				break;
			case 4:
				data = data.slice(9, 12);
				break;

			default:
				data = data;
				break;
		}
		return data;
	}
	getMonthName(id: number): string | undefined {
		return months.find((e: month) => e.id === id)?.month;
	}
	getMonthIdByQuarter(quarter: number){
		return this.getMonth(quarter).map((e: any) => e.id)
	}
	getMonthIdBySemester(semester: number){
		let data: number[] = []
		switch (semester) {
			case 1:
				data = [1, 2, 3, 4, 5, 6];
				break;
			case 2:
				data = [7, 8, 9, 10, 11, 12];
				break;
		}
		return data
	}
}

export default new App();
