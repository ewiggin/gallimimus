export class User {
    id!: number;
    firstName!: string;
    lastName!: string;
    age!: number;

    getName() {
        return this.firstName + ' ' + this.lastName;
    }

    isAdult() {
        return this.age > 36 && this.age < 60;
    }
}
