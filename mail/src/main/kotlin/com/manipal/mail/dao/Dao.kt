package com.manipal.mail.dao
import org.bson.Document
import org.bson.conversions.Bson
import org.springframework.data.mongodb.core.MongoTemplate

class Dao(mongoTemplate: MongoTemplate) {
    private var mongoTemplate: MongoTemplate = mongoTemplate
    fun insert(dbName: String, doc: Document) {
        println(doc.toString())
        println(dbName)
        //mongoTemplate.save(doc, dbName)
        mongoTemplate.execute(dbName) { mongoCollection ->
            var list: MutableList<Document> = ArrayList<Document>()

            mongoCollection.insertOne(doc)

            list
        }

    }


    fun findAll(dbName: String): List<Document> {
        return mongoTemplate.execute(dbName) { mongoCollection ->
            var list: MutableList<Document> = ArrayList<Document>()
            list = mongoCollection.find().into(ArrayList<Document>())
            list
        }
    }
    fun findFields(dbName: String, query: Document,fields:Document): List<Document> {
        //System.out.println(mongoTemplate);

        return mongoTemplate.execute(dbName) { mongoCollection ->
            var list: MutableList<Document> = ArrayList<Document>()
            list= mongoCollection.find(query).projection(fields).into(ArrayList<Document>())
            list
        }
    }
    fun findFields(dbName: String,fields:Document): List<Document> {
        //System.out.println(mongoTemplate);

        return mongoTemplate.execute(dbName) { mongoCollection ->
            var list: MutableList<Document> = ArrayList<Document>()
            list= mongoCollection.find().projection(fields).into(ArrayList<Document>())
            list
        }
    }
    fun find(dbName: String, query: Document): List<Document> {
        //System.out.println(mongoTemplate);

        return mongoTemplate.execute(dbName) { mongoCollection ->
            var list: MutableList<Document> = ArrayList<Document>()
            list = mongoCollection.find(query).into(ArrayList<Document>())
            list
        }
    }
    fun delete(dbName: String, query: Document){
        //System.out.println(mongoTemplate);

        mongoTemplate.execute(dbName) { mongoCollection ->
            var list: MutableList<Document> = ArrayList<Document>()
            mongoCollection.findOneAndDelete(query)

        }
    }
    fun aggregate(dbName: String,query:MutableList<Bson>): List<Document> {
        print("no")

        return mongoTemplate.execute(dbName) { mongoCollection ->


            //print(list.toString())
            var list1=mongoCollection.aggregate(query)
            //print("yes")
            //print(list1.toString())
            return@execute list1.toMutableList()
        }
    }

}