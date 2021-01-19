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
    fun charge(@RequestBody data: String, model: Model):Model? {

        var jsonData=JSONObject(data)
        var chargeRequest:ChargeRequest=ChargeRequest()
        chargeRequest.setStripeEmail(jsonData.getJSONObject("token").getString("email"))
        chargeRequest.setDescription("Example charge")
        chargeRequest.setAmount(jsonData.getInt("amount"))
        chargeRequest.setStripeToken(jsonData.getJSONObject("token").getString("id"))
        chargeRequest.setCurrency("INR")
        var result=JSONObject()
    jsonData.put("email",jsonData.getJSONObject("token").getString("email"))
        jsonData.remove("token")
        val charge = paymentsService!!.charge(chargeRequest)
        model.addAttribute("id", charge.id)
        result.put("id",charge.id)
        model.addAttribute("status", charge.status)
        result.put("status",charge.status)
        model.addAttribute("chargeId", charge.id)
        result.put("balance_transcation",charge.balanceTransaction)
        model.addAttribute("balance_transaction", charge.balanceTransaction)
        jsonData.put("result",result)
        dao?.insert("payment",Document.parse(jsonData.toString()))
        return model
    }

    @ExceptionHandler(StripeException::class)
    fun handleError(model: Model, ex: StripeException): Model? {
        model.addAttribute("error", ex.message)
        return model
    }

    @PostMapping("/configs")
    fun addAllConfigs(@RequestBody data: String?): ResponseEntity<String?> {
        val jsonData = JSONArray(data)
        for (i in 0 until jsonData.length()) {
            addConfig(jsonData.get(i).toString())
        }
        val headers = HttpHeaders()
        headers.add("Response-from", "ToDoController")
        return ResponseEntity<String?>(jsonData.toString(), headers, HttpStatus.OK)
    }

    @PostMapping("/config")
    @Throws(JSONException::class)
    fun addConfig(@RequestBody data: String?): ResponseEntity<String?> {
        dao = mongoTemplate?.let { Dao(it) }
        var flag = true
        val jsonData = JSONObject(data)
        if (jsonData.has("partners")) {
            for (i in 0 until jsonData.getJSONArray("partners").length()) {
                var curPartner = jsonData.getJSONArray("partners").getJSONObject(i)
                curPartner.put("category", jsonData.getString("category"))
                curPartner.put("product", jsonData.getString("product"))
                service?.addPartner(curPartner.toString())
                //dao?.insert("partners", Document.parse(curPartner.toString()))
            }
            jsonData.remove("partners")
        }
        println(jsonData.toString())

        val configs = service?.findFormConfig(jsonData.getString("category"), jsonData.getString("product"))

        if (configs != null) {
            if (configs.isNotEmpty()) {
                flag = false
                var dat = configs[0]
                jsonData.put("_id", dat["_id"])
                configs?.get(0)?.let { dao?.delete("formConfig", it) }
            }

        }
        if (flag) {
            kafkaTemplate?.send("pipe", "insurance,$jsonData")
        }


        val doc = Document.parse(jsonData.toString())
        dao?.insert("formConfig", doc)
        val headers = HttpHeaders()
        headers.add("Response-from", "ToDoController")
        return ResponseEntity<String?>(jsonData.toString(), headers, HttpStatus.OK)
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