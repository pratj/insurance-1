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

    @KafkaListener(topics = ["pipe"], groupId = "mailer")
    fun consumer(messages: String) {
        dao = mongoTemplate?.let { Dao(it) }

        val service = Route()
        val message = messages.split(",".toRegex(), 2).toTypedArray()
        println("TYPE" + message[0])
        if (message[0] == "insurance") {
            val mails = getAllEmails()



                        service.newInsuranceMailer(mails, message[1])




        }
        if (message[0] == "partner") {
            val mails = getAllEmails()

            if (mails != null) {


                        service.newPartnerMailer(mails, message[1])




            }
        }
        if (message[0] == "quote") {
            dao?.insert("quotes", Document.parse(message[1]))
            service.quoteMailer(message[1])
        }
        if ("suggest" in message[0]) {

            service.suggestionMailer(message[1].replace("\\\"", "\""))
        }
    }

    fun getAllEmails(): ArrayList<String> {
        val list = ArrayList<Bson>()
        list.add(Aggregates.group("\$formData.email"))
        val project = Document()
        project["_id"] = 0
        project["email"] = "\$_id"
        list.add(Aggregates.project(project))
        val mails = dao?.aggregate("quotes", list)
        print(mails)
        val mailList= ArrayList<String>()
        if (mails != null) {
            for(mail in mails){
                if (mail != null && emailPattern.matches(JSONObject(mail.toJson()).getString("email"))) {
                    mailList.add(JSONObject(mail.toJson()).getString("email"))
                }
            }
        }
        return mailList
    }
}