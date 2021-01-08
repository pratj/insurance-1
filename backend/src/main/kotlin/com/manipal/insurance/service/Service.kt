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
import org.springframework.data.mongodb.core.query.Query
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
    fun getHandling():String{
        return ""
    }
    fun findUniqueCategory(): List<Document>? {
        dao= mongoTemplate?.let { Dao(it) }
        var fields:Document= Document()
        fields["category"] = 1
        fields["product"]=1
        fields["info"] = 1
        fields["image"]=1
        return dao?.findFields("formConfig",fields)

    }
    fun findFormConfig(category:String,product:String): List<Document>? {
        dao= mongoTemplate?.let { Dao(it) }
        var query:Document= Document()
        query.put("category",category)
        query.put("product",product)
        return dao?.find("formConfig",query)

    }
    @Throws(UnsupportedEncodingException::class)
    private fun encodeValue(value: String?): String {
        return URLEncoder.encode(value, StandardCharsets.UTF_8.toString())
    }
    fun apiRequests(data:String){
        dao= mongoTemplate?.let { Dao(it) }
        val jsonData = JSONObject(data)
        val query:Document= Document()
        query.put("category",jsonData.getString("category"))
        val partners= dao?.find("partners",query)
        if (partners != null) {
            for(partner in partners){
                val curPartner=JSONObject(partner.toJson())
                var request:Request.Builder?
                var inputData=mapFields(jsonData.getJSONObject("formData"),curPartner.getJSONArray("inputField"))
                if(curPartner.getJSONObject("api").getString("method").equals("GET")){

                  request = getOkHttp(inputData,curPartner)

                }else{

                   request= postOkHttp(inputData,curPartner)
                }
                val client = OkHttpClient()
                val call = request?.let { client.newCall(it.build()) }

                val response = call?.execute()

                var resData = response?.body()!!.string()


            }

        }
    }
    fun mapOFields(data: JSONObject,map: JSONArray):JSONObject{

    }
    fun mapFields(data: JSONObject,map:JSONArray):JSONObject{
        var output =JSONObject()
        for(i in 0 until map.length()){
            if(data.has(map.getJSONObject(i).getString("from"))){
                output.put(map.getJSONObject(i).getString("to"),data.getString(map.getJSONObject(i).getString("from")))
            }
            else{
                output.put(map.getJSONObject(i).getString("to"),"")
            }
        }
        return output
    }
    fun getOkHttp(data:JSONObject,partner:JSONObject): Request.Builder? {
        var request = Request.Builder().url(partner.getJSONObject("api").getString("path"))
        val map: HashMap<String, String>
        val mapper = ObjectMapper()
        map = mapper.readValue<Map<String, String>>(data.toString(), object : TypeReference<Map<String, String>>() {}) as HashMap<String, String>
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
    fun postOkHttp(data:JSONObject,partner:JSONObject):Request.Builder{
        var request = Request.Builder().url(partner.getJSONObject("api").getString("path"))
        val body = okhttp3.RequestBody.create(MediaType.get("application/json; charset=utf-8"), data.toString())
        request = request.post(body)
        return request;
    }
}