import { Grid, Typography } from '@material-ui/core'
import React, {useState, useEffect} from 'react'
import { Carousel } from 'react-responsive-carousel'

function Partners() {

    const [partners, setPartners] = useState([])

    useEffect(() => {
        setPartners([
            {
                "image": "https://cms-img.coverfox.com/tata%20aig.jpg",
                "partner": "Tata AIG"
            },
            {
                "image": "https://www.bajajallianz.com/content/dam/bagic/bagic-lazyloading/lazyLoadingBajajLogo.jpg",
                "partner": "Bajaj Allianz"
            },
            {
                "image": "https://static.businessworld.in/article/article_extra_large_image/1575458276_o93UrT_HDFC_ERGO_launches_Inherent_Defects_Insurance_Policy.jpg",
                "partner": "HDFC ERGO"
            }
        ])
    }, [])

    return (
        <Grid container className="partners" data-test="partners">
            <Grid item xs={false} sm={2}></Grid>
            <Grid item xs={12} sm={8}>
                <Typography variant="h3" style={{ textAlign: 'center', color:"#b58500"}}><b>Our Partners</b></Typography>
                <Carousel dynamicHeight={true} autoPlay>
                    {typeof partners !== undefined && partners.map((item, index) => {
                        return (
                            <div key={index} style={{height: 500}}>
                                <img src={item.image} alt="partner not available"/>
                                <p style={{backgroundColor:"gold"}}className="legend">{item.partner}</p>
                            </div>
                        )
                    })}
                </Carousel>
            </Grid>
            <Grid item xs={false} sm={2}></Grid>
        </Grid>
    )
}

export default Partners