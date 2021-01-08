package com.manipal.insurance.controller


import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.manipal.insurance.dao.Dao
import com.manipal.insurance.service.Service
import okhttp3.MediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import org.bson.Document
import org.json.JSONException
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.io.UnsupportedEncodingException
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.util.stream.Collectors

@RestController
@RequestMapping("/api")
class Controller {
    @Autowired
    var mongoTemplate: MongoTemplate? = null
    @Autowired
    var service: Service?=null
    var dao: Dao? = null
    @PostMapping("/config")
    @Throws(JSONException::class)
    fun addConfig(@RequestBody data: String?): ResponseEntity<String?> {
        dao = mongoTemplate?.let { Dao(it) }
        val jsonData = JSONObject(data)
        println(jsonData.toString())
        val doc = Document.parse(data)
        dao?.find("requests", doc)
        val headers = HttpHeaders()
        headers.add("Response-from", "ToDoController")
        return ResponseEntity<String?>(jsonData.toString(), headers, HttpStatus.OK)
    }
    @GetMapping("/categories")
    fun retrieveCategory():List<Document>?{
        return service?.findUniqueCategory()
    }
    @GetMapping("/config/category/{category}/product/{product}")
    fun retrieveConfig(@PathVariable category: String,@PathVariable product:String): List<Document>? {

        return service?.findFormConfig(category,product)
    }

    @Throws(UnsupportedEncodingException::class)
    private fun encodeValue(value: String?): String {
        return URLEncoder.encode(value, StandardCharsets.UTF_8.toString())
    }

    @PostMapping("/response")
    @Throws(Exception::class)
    fun getData(@RequestBody data: String): String {
        dao = mongoTemplate?.let { Dao(it) }
        val jsonData = JSONObject(data)
        val map: HashMap<String, String>
        val client = OkHttpClient()
        val apiData = jsonData.getJSONObject("apiData")
        var request = Request.Builder().url(apiData.getString("path"))
        if (apiData["method"] == "GET") {
            val mapper = ObjectMapper()
            map = mapper.readValue<Map<String, String>>(jsonData["formData"].toString(), object : TypeReference<Map<String, String>>() {}) as HashMap<String, String>
            var combine = "="
            var combine1 = "&"
            var combine2 = "?"
            if (apiData.getString("uriType") == "/") {
                combine = "/"
                combine1 = "/"
                combine2 = ""
            }
            val finalCombine = combine
            val encodedURL = map.keys.stream()
                    .map { key: String ->
                        try {
                            return@map key + finalCombine + encodeValue(map[key])
                        } catch (e: UnsupportedEncodingException) {
                            e.printStackTrace()
                        }
                        ""
                    }
                    .collect(Collectors.joining(combine1, apiData["path"].toString() + combine2, ""))
            println(encodedURL)
            request = Request.Builder().url(encodedURL)
            request = request.get()
        }
        if (apiData["method"] == "POST") {
            val body = okhttp3.RequestBody.create(MediaType.get("application/json; charset=utf-8"), jsonData["formData"].toString())
            request = request.post(body)
        }
        val headers = apiData.getJSONArray("headers")
        for (i in 0 until headers.length()) {
            val header = headers.getJSONObject(i)
            if (header.getString("header") != "" && header.getString("value") != "") {
                request = request.addHeader(header.getString("header"), header.getString("value"))
            }
        }
        val call = client.newCall(request.build())
        val response = call.execute()
        var resData = response.body()!!.string()
        if (resData == "") {
            resData = "{message:\"no quotes\"}"
        }
        println("response:$resData")
        val dbData = JSONObject()
        dbData.put("userData", jsonData.getJSONObject("formData"))
        dbData.put("category", jsonData.getString("category"))
        dbData.put("partner", jsonData.getString("partner"))
        dbData.put("product", jsonData.getString("partner"))
        dbData.put("result", JSONObject(resData))
        val doc = Document.parse(dbData.toString())
        println(doc.toString())
       dao?.find("requests", doc)
        return resData
    }
}