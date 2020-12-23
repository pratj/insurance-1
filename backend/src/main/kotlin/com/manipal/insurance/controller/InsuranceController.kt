package com.manipal.insurance.controller
import com.manipal.insurance.model.CarDetails
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.nio.file.Files
import java.nio.file.Paths

@EnableAutoConfiguration
@RestController
class InsuranceController {
    @Autowired
    val carDetails: CarDetails ?=null
    @GetMapping(value = ["/getmotors"])
    fun getMotorDetails():ArrayList<CarDetails>{
//src/main/resources/static/cars_ds_final.csv
        var cars= ArrayList<CarDetails>()
        val reader = Files.newBufferedReader(Paths.get("src/main/resources/static/cars_ds_final.csv"))
        // parse the file into csv values
        val csvParser = CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())
        for (csvRecord in csvParser) {
            // Accessing Values by Column Index


            cars.add(CarDetails(csvRecord.get(2),csvRecord.get(1),csvRecord.get(3)))


        }
        return cars;

}
}