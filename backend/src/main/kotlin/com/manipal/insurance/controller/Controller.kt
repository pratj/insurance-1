package com.manipal.insurance.controller


import com.manipal.insurance.dao.Dao
import com.manipal.insurance.model.ChargeRequest
import com.manipal.insurance.service.Service
import com.manipal.insurance.service.StripeService
import com.stripe.exception.StripeException
import org.bson.Document
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import java.util.*
import kotlin.collections.ArrayList

@CrossOrigin
@RestController
@RequestMapping("/api")
class Controller {
    @Autowired
    var mongoTemplate: MongoTemplate? = null

    @Autowired
    private val kafkaTemplate: KafkaTemplate<String, String>? = null

    @Autowired
    var service: Service? = null
    var dao: Dao? = null

    @Autowired
    private val paymentsService: StripeService? = null

    @GetMapping("/category/partner/payment/count")
    fun paymentPartnerCount(): MutableList<Document>? {
        return service?.partnerPaymentCount()
    }

    @PostMapping("/charge")
    @Throws(StripeException::class)
    fun charge(@RequestBody data: String, model: Model): ResponseEntity<String?> {
        dao = mongoTemplate?.let { Dao(it) }
        var jsonData = JSONObject(data)
        jsonData = jsonData.getJSONObject("data")

        val chargeRequest = ChargeRequest()
        chargeRequest.setStripeEmail(jsonData.getJSONObject("token").getString("email"))
        chargeRequest.setDescription("Example charge")
        chargeRequest.setAmount(jsonData.getInt("amount"))
        chargeRequest.setStripeToken(jsonData.getJSONObject("token").getString("id"))
        chargeRequest.setCurrency("INR")
        val result = JSONObject()

        val charge = paymentsService!!.charge(chargeRequest)
        model.addAttribute("id", charge.id)
        result.put("id", charge.id)
        model.addAttribute("status", charge.status)
        result.put("status", charge.status)
        model.addAttribute("chargeId", charge.id)
        result.put("balance_transaction", charge.balanceTransaction)
        model.addAttribute("balance_transaction", charge.balanceTransaction)
        jsonData.put("result", result)
        jsonData.put("time", Date())
        dao?.insert("payment", Document.parse(jsonData.toString()))
        println("Result >>>>$result")
        val headers = HttpHeaders()
        headers.add("Response-from", "payment")
        return ResponseEntity<String?>(result.toString(), headers, HttpStatus.OK)

    }

    @GetMapping("/map/location")
    fun mapLocation(): ArrayList<Document>? {
        return service?.findUserLocation()
    }

    @DeleteMapping("/category/{category}/product/{product}")
    fun deleteFormConfig(@PathVariable category: String, @PathVariable product: String): String? {
        return service?.deleteFormConfig(category, product)
    }

    @ExceptionHandler(StripeException::class)
    fun handleError(model: Model, ex: StripeException): Model? {
        model.addAttribute("error", ex.message)
        return model
    }

    @PostMapping("/configs")
    fun addAllConfigs(@RequestBody data: String?): ResponseEntity<String?>? {
        return service?.addAllConfigs(data)
    }

    @PostMapping("/config")
    @Throws(JSONException::class)
    fun addConfig(@RequestBody data: String?): ResponseEntity<String?>? {

        return service?.addConfig(data)
    }

    @GetMapping("/categories")
    fun retrieveCategory(): List<Document>? {
        return service?.findUniqueCategory()
    }

    @GetMapping("/config/category/{category}/product/{product}")
    fun retrieveConfig(@PathVariable category: String, @PathVariable product: String): List<Document>? {
        return service?.findFormConfig(category, product)
    }

    @PostMapping("/response")
    @Throws(Exception::class)
    fun getData(@RequestBody data: String): List<Document>? {
        return service?.apiRequests(data)
    }

    @GetMapping("/category/partner/count")
    fun getCategoryPartner(): List<Document>? {
        return service?.categoryPartnersCount()
    }

    @GetMapping("/partner/category/count")
    fun getPartnerCategoryCount(): List<Document>? {
        return service?.partnerCategoryCount()
    }

    @GetMapping("/category/request/count")
    fun categoryRequestCount(): List<Document>? {
        return service?.categoryRequests()
    }

    @PostMapping("/addPartner")
    fun addPartner(@RequestBody data: String): String {
        service?.addPartner(data)
        return "successfully"
    }
}