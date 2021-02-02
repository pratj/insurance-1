import React, {useEffect, useState} from 'react'
import RenderForm from './RenderForm';
import axios from 'axios'
import { useHistory } from "react-router";
import useGeoLocation from '../geolocation/useGeoLocation'

const Form = ({cardInfo, setOpenPopup}) => {
        
    const [formFields, setFormFields] = useState()
    const history = useHistory();
    const geoLocation= useGeoLocation();

    const onSubmit = (data) => {

      const userLocation= geoLocation.loaded ? (geoLocation): "Location data not available yet."
      const finalData = {category: cardInfo.category, product: cardInfo.product, formData: data, userLocation:userLocation}
      console.log(finalData)
      axios.post(`${process.env.REACT_APP_BASE_URL}/api/response`, finalData).then((response) => {
        const quoteData={category: cardInfo.category,product: cardInfo.product, quoteData: response.data, userLocation:userLocation} 
        redirectToPath(quoteData)
      })
      setOpenPopup(false)
    }

    function redirectToPath(quoteData) {
      history.push("/quote", {quoteData: JSON.stringify(quoteData)})
    }
  
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/api/config/category/${cardInfo.category}/product/${cardInfo.product}`).then((response) => {
            setFormFields(response.data[0].fields)
        })    
    }, [cardInfo.category, cardInfo.product])


    return (

      <div className="form" data-test="form">
        {typeof formFields !== 'undefined' && 
          <RenderForm formFields={formFields} onSubmit={onSubmit}/>
        }    
      </div>
    )     
}

export default Form
