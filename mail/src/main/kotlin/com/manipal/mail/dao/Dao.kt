package com.manipal.mail.dao
import org.bson.Document
import org.bson.conversions.Bson
import org.springframework.data.mongodb.core.MongoTemplate

class Dao(private var mongoTemplate: MongoTemplate) {
    fun insert(dbName: String, doc: Document) {
        println(doc.toString())
        println(dbName)

        mongoTemplate.execute(dbName) { mongoCollection ->
            val list= ArrayList<Document>()

            mongoCollection.insertOne(doc)

            list
        }

    }


    fun findAll(dbName: String): List<Document> {
        return mongoTemplate.execute(dbName) { mongoCollection ->
            var list= ArrayList<Document>()
            list = mongoCollection.find().into(ArrayList())
            list
        }
    }
    fun findFields(dbName: String, query: Document,fields:Document): List<Document> {


        return mongoTemplate.execute(dbName) { mongoCollection ->
            var list= ArrayList<Document>()
            list= mongoCollection.find(query).projection(fields).into(ArrayList())
            list
        }
    }
    fun findFields(dbName: String,fields:Document): List<Document> {


        return mongoTemplate.execute(dbName) { mongoCollection ->
            var list= ArrayList<Document>()
            list= mongoCollection.find().projection(fields).into(ArrayList())
            list
        }
    }
    fun find(dbName: String, query: Document): List<Document> {


        return mongoTemplate.execute(dbName) { mongoCollection ->
            var list = ArrayList<Document>()
            list = mongoCollection.find(query).into(ArrayList())
            list
        }
    }
    fun delete(dbName: String, query: Document){


        mongoTemplate.execute(dbName) { mongoCollection ->
            ArrayList<Document>()
            mongoCollection.findOneAndDelete(query)

        }
    }
    fun aggregate(dbName: String,query:MutableList<Bson>): List<Document> {
        print("no")

        return mongoTemplate.execute(dbName) { mongoCollection ->



            val list1=mongoCollection.aggregate(query)

            return@execute list1.toMutableList()
        }
    }

}