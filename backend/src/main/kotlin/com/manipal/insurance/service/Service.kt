package com.manipal.insurance.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.manipal.insurance.dao.Dao
import okhttp3.MediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import org.bson.Document
import org.json.JSONArray
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.stereotype.Service
import java.io.UnsupportedEncodingException
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.util.stream.Collectors

@Service
class Service {
    @Autowired
    var mongoTemplate: MongoTemplate? = null
    var dao: Dao? = null


    fun findUniqueCategory(): List<Document>? {
        dao = mongoTemplate?.let { Dao(it) }
        val fields = Document()
        fields["category"] = 1
        fields["product"] = 1
        fields["info"] = 1
        fields["image"] = 1
        return dao?.findFields("formConfig", fields)

    }
    fun addPartner(data:String){
        var jsonData=JSONObject(data)
        dao?.insert("partner",Document.parse(jsonData.toString()))
    }
    fun findFormConfig(category: String, product: String): List<Document>? {
        dao = mongoTemplate?.let { Dao(it) }
        val query = Document()
        query["category"] = category
        query["product"] = product
        return dao?.find("formConfig", query)

    }

    @Throws(UnsupportedEncodingException::class)
    private fun encodeValue(value: String?): String {
        return URLEncoder.encode(value, StandardCharsets.UTF_8.toString())
    }

    fun apiRequests(data: String):List<Document> {
        dao = mongoTemplate?.let { Dao(it) }
        val jsonData = JSONObject(data)
        val query = Document()
        query["category"] = jsonData.getString("category")
        var dbQuotes=JSONArray()
        //val quotes= JSONArray()
        var quotes: MutableList<Document> = ArrayList<Document>()

        val partners = dao?.find("partners", query)
        if (partners != null) {
            for (partner in partners) {
                val curPartner = JSONObject(partner.toJson())
                var request: Request.Builder?
                val inputData = mapFields(jsonData.getJSONObject("formData"), curPartner.getJSONArray("inputField"))
                request = if (curPartner.getJSONObject("api").getString("method").equals("GET")) {

                    getOkHttp(inputData, curPartner)

                } else {

                    postOkHttp(inputData, curPartner)
                }
                val headers = curPartner.getJSONObject("api").getJSONArray("headers")
                for (i in 0 until headers.length()) {
                    val header = headers.getJSONObject(i)
                    if (header.getString("header") != "" && header.getString("value") != "") {
                        if (request != null) {
                            request = request.addHeader(header.getString("header"), header.getString("value"))
                        }
                    }
                }
                val client = OkHttpClient()
                val call = request?.let { client.newCall(it.build()) }

                val response = call?.execute()

                val resData = response?.body()!!.string()
                //println(resData)
                var res=mapOFields(JSONObject(resData),curPartner.getJSONArray("outputField"))
                //println(quote1)
                //println("vvfvv")
                println(curPartner.getString("partner"))
                var quote=JSONObject()

                //quote.put("ww",123)
                //print(0)
                quote.put("partner",curPartner.getString("partner"))
                //print("1")
                quote.put("image",curPartner.getString("image"))
                //print(2)
                quote.put("quote",res)
                //print(3)
                println(quote.toString())
                dbQuotes.put(quote)
                quotes.add(Document.parse(quote.toString()))
            }

        }
        jsonData.put("quotes",dbQuotes)

        dao?.insert("quotes",Document.parse(jsonData.toString()))
        return quotes
    }

    fun mapOFields(data: JSONObject, map: JSONArray): JSONObject {
        val output = JSONObject()
        for (i in 0 until map.length()) {
            if (data.has(map.getJSONObject(i).getString("from"))) {
                if (!output.has(map.getJSONObject(i).getString("to"))) {
                    output.put(map.getJSONObject(i).getString("to"), data.getString(map.getJSONObject(i).getString("from")))
                } else {
                    output.put(map.getJSONObject(i).getString("to"), output.getString(map.getJSONObject(i).getString("to")) + "\n" + data.getString(map.getJSONObject(i).getString("from")))
                }
            } else {
                output.put(map.getJSONObject(i).getString("to"), "")
            }
        }
        return output
    }

    fun mapFields(data: JSONObject, map: JSONArray): JSONObject {
        val output = JSONObject()
        for (i in 0 until map.length()) {
            if (data.has(map.getJSONObject(i).getString("from"))) {
                output.put(map.getJSONObject(i).getString("to"), data.getString(map.getJSONObject(i).getString("from")))
            } else {
                output.put(map.getJSONObject(i).getString("to"), "")
            }
        }
        return output
    }

    fun getOkHttp(data: JSONObject, partner: JSONObject): Request.Builder? {
        var request = Request.Builder().url(partner.getJSONObject("api").getString("path"))
        val map: HashMap<String, String>
        val mapper = ObjectMapper()
        map = mapper.readValue(data.toString(), object : TypeReference<Map<String, String>>() {}) as HashMap<String, String>
        var combine = "="
        var combine1 = "&"
        var combine2 = "?"
        if (partner.getJSONObject("api").getString("uriType") == "/") {
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
                .collect(Collectors.joining(combine1, partner.getJSONObject("api")["path"].toString() + combine2, ""))
        println(encodedURL)
        request = Request.Builder().url(encodedURL)
        request = request.get()
        return request

    }

    fun postOkHttp(data: JSONObject, partner: JSONObject): Request.Builder {
        var request = Request.Builder().url(partner.getJSONObject("api").getString("path"))
        val body = okhttp3.RequestBody.create(MediaType.get("application/json; charset=utf-8"), data.toString())
        request = request.post(body)
        return request
    }
}