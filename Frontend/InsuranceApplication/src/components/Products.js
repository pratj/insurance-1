import { Grid, Typography } from '@material-ui/core'
import React, {useState, useEffect} from 'react'
import { Carousel } from 'react-responsive-carousel'
import axios from "axios";
function Products() {

    const [products, setProducts] = useState([])

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/api/categories`).then((response) => {
            console.log(response.data);
            setProducts(response.data);
          });
        
    }, [])

    return (
        <Grid container className="products" data-test="products">
            <Grid item xs={false} sm={2}></Grid>
            <Grid item xs={12} sm={8}>
                <Typography variant="h3" style={{ textAlign: 'center', color:"#b58500"}}><b>Our products</b></Typography>
                <Carousel dynamicHeight={true} autoPlay>
                    {typeof products !== undefined && products.map((item, index) => {
                        return (
                            <div key={index} style={{height: 500}}>
                                <img src={item.image} alt="product not available"/>
                                <p style={{backgroundColor:"gold"}}className="legend">{item.product}</p>
                            </div>
                        )
                    })}
                </Carousel>
            </Grid>
            <Grid item xs={false} sm={2}></Grid>
        </Grid>
    )
}

export default Products