export class SpecialDelivery {
    name: string;
    destination: string;
    price: number;
    count: number = 3;
  
    constructor(name: string, destination: string, price: number) {
      this.name = name;
      this.destination = destination;
      this.price = price;
    }

    countDown(){
        this.count--;
    }
  }