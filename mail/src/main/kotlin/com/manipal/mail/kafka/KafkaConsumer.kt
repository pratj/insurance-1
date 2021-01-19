package com.manipal.mail.kafka

import com.manipal.mail.dao.Dao
import com.manipal.mail.route.Route
import com.mongodb.client.model.Aggregates
import org.bson.Document
import org.bson.conversions.Bson
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Service

@Service
class KafkaConsumer {
    @Autowired
    var mongoTemplate: MongoTemplate? = null
    var dao: Dao? = null
    var emailPattern = Regex("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")

    @KafkaListener(topics = ["pipe"], groupId = "anything")
    fun consumer(messages: String) {
        dao = mongoTemplate?.let { Dao(it) }
        //println("Info Received$messages")
        var service = Route()
        val message = messages.split(",".toRegex(), 2).toTypedArray()
        println("TYPE" + message[0])
        if (message[0] == "insurance") {
            var mails = getAllEmails()
            if (mails != null) {
                for (mail in mails) {
                    if (mail != null && emailPattern.matches(JSONObject(mail.toJson()).getString("email"))) {
                        service.newInsuranceMailer(JSONObject(mail.toJson()).getString("email"), message[1])
                    }

                }
            }
        }
        if (message[0] == "partner") {
            var mails = getAllEmails()
            if (mails != null) {
                for (mail in mails) {
                    if (mail != null && emailPattern.matches(JSONObject(mail.toJson()).getString("email"))) {
                        service.newPartnerMailer(JSONObject(mail.toJson()).getString("email"), message[1])
                    }

                }

            }
        }
        if (message[0] == "quote") {

           service?.quoteMailer(message[1])
        }
        if ("suggest" in message[0]) {

            service?.suggestionMailer(message[1].replace("\\\"","\""))
        }
    }

    fun getAllEmails(): List<Document>? {
        var list: MutableList<Bson> = ArrayList<Bson>()
        list.add(Aggregates.group("\$formData.email"))
        var project = Document()
        project["_id"] = 0
        project["email"] = "\$_id"
        list.add(Aggregates.project(project))
        var mails = dao?.aggregate("quotes", list)
        print(mails)
        return mails
    }
}