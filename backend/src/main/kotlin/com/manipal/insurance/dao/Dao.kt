package com.manipal.insurance.dao

import com.mongodb.client.FindIterable
import org.bson.Document
import org.springframework.data.mongodb.core.MongoTemplate
import java.util.*

class Dao(mongoTemplate: MongoTemplate) {
    private var mongoTemplate: MongoTemplate = mongoTemplate
    fun insert(dbName: String, doc: Document) {
        println(doc.toString())
        println(dbName)
        mongoTemplate.save(doc, dbName)
        mongoTemplate.execute(dbName) { mongoCollection ->
            val list: List<Document> = ArrayList<Document>()
            mongoCollection.insertOne(doc)
            list
        }
    }

    fun findAll(dbName: String): List<Document> {
        return mongoTemplate.execute(dbName) { mongoCollection ->
            val list: MutableList<Document> = ArrayList<Document>()
            val cursor: FindIterable<Document> = mongoCollection.find()
            val it: Iterator<*> = cursor.iterator()
            while (it.hasNext()) {
                list.add(it.next() as Document)
            }
            list
        }
    }

    fun find(dbName: String, doc: Document): List<Document> {
        //System.out.println(mongoTemplate);
        return mongoTemplate.execute(dbName) { mongoCollection ->
            val list: MutableList<Document> = ArrayList<Document>()
            //System.out.println("no");
            val cursor: FindIterable<Document> = mongoCollection.find(doc)
            val it: Iterator<*> = cursor.iterator()
            while (it.hasNext()) {
                //System.out.println("yes");
                list.add(it.next() as Document)
            }
            list
        }
    }

}