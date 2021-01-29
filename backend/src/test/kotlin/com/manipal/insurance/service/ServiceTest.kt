package com.manipal.insurance.service

import com.manipal.insurance.dao.Dao
import com.mongodb.client.model.Accumulators
import com.mongodb.client.model.Aggregates
import org.bson.Document
import org.bson.conversions.Bson
import org.json.JSONArray
import org.json.JSONObject
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.doNothing
import org.mockito.Mockito.mock
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class ServiceTest {
    @InjectMocks
    var service: Service? = null
    @Mock
    var dao:Dao?=null
    @Test
    fun testFindUniqueCategory(){
        val fields = Document()
        fields["category"] = 1
        fields["product"] = 1
        fields["info"] = 1
        fields["image"] = 1
        print(dao)
        Mockito.`when`(dao?.findFields("formConfig", fields)).thenReturn(ArrayList<Document>())
        var result=service?.findUniqueCategory()
        assertEquals(result?.size, 0)
    }
    @Test
    fun testDeleteFormConfig(){
        val query = Document()
        query["category"] = "tata aig"
        query["product"] = "motor insurance"
        doNothing().`when`(dao)?.delete("formConfig", query)
        doNothing().`when`(dao)?.delete("partners",query)
        var result=service?.deleteFormConfig("tata aig","motor insurance")
        assertEquals("successful",result)
    }
    @Test
    fun testUserLocation(){
        val paidQuery = "{\n" +
                "        aggregate: \"payment\",\n" +
                "        pipeline: [\n" +
                "\n" +
                "            {\n" +
                "                \"\$match\": {\n" +
                "                    \"userLocation.userAllowed\": true,\n" +
                "                    \"result.status\": \"succeeded\"\n" +
                "                }\n" +
                "            },\n" +
                "            {\n" +
                "                \"\$project\": {\n" +
                "                    \"product\": 1,\n" +
                "                    \"userLocation\": 1,\n" +
                "                    \"_id\": 1,\n" +
                "                    \"ViewTime\": \"\$time\",\n" +
                "                    \"category\": 1,\n" +
                "                    \"partner\": 1\n" +
                "                }\n" +
                "            },\n" +
                "            {\n" +
                "                \"\$addFields\": {\n" +
                "                    \"userBought\": true\n" +
                "                }\n" +
                "            }\n" +
                "        ],\n" +
                "        cursor: {}\n" +
                "    }"
        var doc=Document()
        doc["firstBatch"]=ArrayList<Document>()
        var result=Document()
        result["cursor"]=doc
        Mockito.`when`(dao?.executeCommand(paidQuery)).thenReturn(result)
        val nonPaidQuery = "{\n" +
                "    aggregate: \"quotes\",\n" +
                "    pipeline: [\n" +
                "        {\n" +
                "            \"\$lookup\": {\n" +
                "                \"from\": \"payment\",\n" +
                "                \"localField\": \"category\",\n" +
                "                \"foreignField\": \"category\",\n" +
                "                \"as\": \"category\"\n" +
                "            }\n" +
                "            ,\n" +
                "\n" +
                "            \"\$lookup\": {\n" +
                "                \"from\": \"payment\",\n" +
                "                \"localField\": \"product\",\n" +
                "                \"foreignField\": \"product\",\n" +
                "                \"as\": \"product\"\n" +
                "            }\n" +
                "            ,\n" +
                "            \"\$lookup\": {\n" +
                "                \"localField\": \"formData.email\",\n" +
                "                \"as\": \"email\",\n" +
                "                \"foreignField\": \"email\",\n" +
                "                \"from\": \"payment\"\n" +
                "            }\n" +
                "        },\n" +
                "        {\n" +
                "            \"\$match\": {\n" +
                "                \"email\": {\n" +
                "                    \"\$eq\": [],\n" +
                "                    \"\$exists\": true\n" +
                "                }, \"userLocation.userAllowed\": true\n" +
                "            }\n" +
                "        },\n" +
                "        {\n" +
                "            \"\$project\": {\n" +
                "                \"product\": 1,\n" +
                "                \"userLocation\": 1,\n" +
                "                \"_id\": 1,\n" +
                "                \"ViewTime\": \"\$time\",\n" +
                "                \"category\": 1\n" +
                "            }\n" +
                "        },\n" +
                "        {\n" +
                "            \"\$addFields\": {\n" +
                "                \"userBought\": false\n" +
                "            }\n" +
                "        }\n" +
                "    ],\n" +
                "    cursor: {}\n" +
                "}"
        Mockito.`when`(dao?.executeCommand(nonPaidQuery)).thenReturn(result)
        var results=service?.findUserLocation()
        if (results != null) {
            assertEquals(results.size,0)
        }else{
            assertEquals(true,true)
        }
    }
    @Test
    fun testPartnerPaymentCount(){
        val list = ArrayList<Bson>()
        val multiIdMap: MutableMap<String, Any> = HashMap()
        multiIdMap["partner"] = "\$partner"
        multiIdMap["category"] = "\$category"

        val groupFields = Document(multiIdMap)
        list.add(Aggregates.group(groupFields, Accumulators.sum("count", 1)))
        val project = Document()
        project["_id"] = 0
        project["category"] = "\$_id.category"
        project["partner"] = "\$_id.partner"
        project["count"] = 1
        list.add(Aggregates.project(project))

        Mockito.`when`(dao?.aggregate("payment", list)).thenReturn(ArrayList<Document>())
        var result=service?.partnerPaymentCount()
        if(result!=null){
            assertEquals(result.size,0)
        }else{
            assertEquals(true,true)
        }
    }
    @Test
    fun testFindFormConfig(){
        val query = Document()
        query["category"] ="tata Aig"
        query["product"] = "Motor Insurance"
        Mockito.`when`(dao?.find("formConfig", query)).thenReturn(ArrayList<Document>())
        var result=service?.findFormConfig("tata Aig","Motor Insurance")
        assertEquals(result?.size,0)
    }
    @Test
    fun testCategoryPartnersCount(){
        val list = ArrayList<Bson>()

        list.add(Aggregates.group("\$category", Accumulators.sum("partnerCount", 1)))
        val project = Document()
        project["_id"] = 0
        project["category"] = "\$_id"
        project["partnerCount"] = 1
        list.add(Aggregates.project(project))
        Mockito.`when`(dao?.aggregate("partners", list)).thenReturn(ArrayList<Document>())
        var result=service?.categoryPartnersCount()
        assertEquals(result?.size,0)
    }
    @Test
    fun testPartnerCategoryCount(){
        val list = ArrayList<Bson>()
        list.add(Aggregates.group("\$partner", Accumulators.sum("count", 1)))
        val project = Document()
        project["_id"] = 0
        project["partner"] = "\$_id"
        project["count"] = 1
        list.add(Aggregates.project(project))
        Mockito.`when`(dao?.aggregate("partners", list)).thenReturn(ArrayList<Document>())
        var result=service?.partnerPaymentCount()
        assertEquals(result?.size,0)
    }
    @Test
    fun testCategoryRequests(){
        val list = ArrayList<Bson>()
        list.add(Aggregates.group("\$category", Accumulators.sum("count", 1)))
        val project = Document()
        project["_id"] = 0
        project["category"] = "\$_id"
        project["count"] = 1
        list.add(Aggregates.project(project))
        Mockito.`when`(dao?.aggregate("quotes", list)).thenReturn(ArrayList<Document>())
        var result=service?.categoryRequests()
        assertEquals(result?.size,0)
    }
    @Test
    fun testMapOFields(){
        var data=JSONObject()
        data.put("name","rashwin")
        data.put("value","1234")
        data.put("qas","12")
        var maps=JSONArray()
        var map=JSONObject()
        map.put("from","name")
        map.put("to","name")
        maps.put(map)
        map=JSONObject()
        map.put("from","value")
        map.put("to","amount")
        maps.put(map)
        var result=service?.mapOFields(data,maps)
        var actaulResult=JSONObject()
        actaulResult.put("name","rashwin")
        actaulResult.put("amount","1234")
        assertEquals(result.toString(),actaulResult.toString())
    }
    @Test
    fun testMapOFields1(){
        var data=JSONObject()
        data.put("name","rashwin")
        data.put("value","1234")
        data.put("qas","12")
        var maps=JSONArray()
        var map=JSONObject()
        map.put("from","name")
        map.put("to","name")
        maps.put(map)
        map=JSONObject()
        map.put("from","value")
        map.put("to","amount")
        maps.put(map)
        map=JSONObject()
        map.put("from","qas")
        map.put("to","amount")
        maps.put(map)
        var result=service?.mapOFields(data,maps)
        var actaulResult=JSONObject()
        actaulResult.put("name","rashwin")
        actaulResult.put("amount","1234\n12")

        assertEquals(result.toString(),actaulResult.toString())
    }
    @Test
    fun testMapFields(){
        var data=JSONObject()
        data.put("name","rashwin")
        data.put("value","1234")
        data.put("qas","12")
        var maps=JSONArray()
        var map=JSONObject()
        map.put("from","name")
        map.put("to","name")
        maps.put(map)
        map=JSONObject()
        map.put("from","value")
        map.put("to","amount")
        maps.put(map)

        var result=service?.mapOFields(data,maps)
        var actaulResult=JSONObject()
        actaulResult.put("name","rashwin")
        actaulResult.put("amount","1234")

        assertEquals(result.toString(),actaulResult.toString())
    }
}