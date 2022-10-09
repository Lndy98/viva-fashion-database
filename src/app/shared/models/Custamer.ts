export interface Custamer{
    companyName: string;
    address:{
        ZIPcode: string;
        town: string;
        street: string;
        houseNumber: string;
    }
    taxNumber: string;
}