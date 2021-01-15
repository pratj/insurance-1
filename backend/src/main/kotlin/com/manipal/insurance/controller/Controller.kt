package com.manipal.insurance.controller


import com.manipal.insurance.dao.Dao
import com.manipal.insurance.service.Service
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
import org.springframework.web.bind.annotation.*

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