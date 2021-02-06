import axios from "axios";

export class Requests {
    
  getCategories() {
    return axios.get(`${process.env.REACT_APP_BASE_URL}/api/categories`);
  }
  postFromData(data) {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/api/response`, data);
  }
  getFormFields(category, product){
      return axios.get(`${process.env.REACT_APP_BASE_URL}/api/config/category/${category}/product/${product}`);
  }
  postPaymentData(data){
    return axios.post(`${process.env.REACT_APP_BASE_URL}/api/charge`,{data});
  }
  getCategoryRequestCount(){
      return axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/category/request/count`)
  }
}

export default new Requests();
