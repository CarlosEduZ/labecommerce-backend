import { type } from "os"

export type TUserDB ={
  id: string,
  name: string,
  email: string,
  password:string
};

export type TProductsDB = {
  id: string,
  name: string,
  price: number,
  description: string,
  image_url: string
}
