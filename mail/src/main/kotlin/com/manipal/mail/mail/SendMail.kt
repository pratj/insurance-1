package com.manipal.mail.mail


import es.atrujillo.mjml.service.auth.MjmlAuth
import es.atrujillo.mjml.service.auth.MjmlAuthFactory
import es.atrujillo.mjml.service.definition.MjmlService
import es.atrujillo.mjml.service.impl.MjmlRestService
import javax.mail.*
import javax.mail.internet.InternetAddress
import javax.mail.internet.MimeMessage


class SendMail {

    fun sendMail(to: List<String>, subjects: String, messages: String) {
        if (to.isNotEmpty()) {
            Transport.send(plainMail(to, subjects, mjml(messages)))
        }

    }

    private fun mjml(mjmlTemplate: String): String {

        val memoryAuthConf: MjmlAuth = MjmlAuthFactory.builder()
                .withMemoryCredentials()
                .mjmlCredentials("c49481d5-fe08-4819-bab8-26db50b9d01a", "dc2f0033-679d-4fb6-9dc6-5784bd5d6f2c")
                .build()

        val mjmlService: MjmlService = MjmlRestService(memoryAuthConf)


        return mjmlService.transpileMjmlToHtml(mjmlTemplate)
    }

    private fun plainMail(tos: List<String>, subjects: String, messages: String): MimeMessage {


        val from = "ibazaar40@gmail.com"
        val pass = "ngywfns67"
        val encryption = Encryption()
        val properties = System.getProperties()

        with(properties) {
            put("mail.smtp.host", "smtp.gmail.com")
            put("mail.smtp.port", "465")
            put("mail.smtp.auth", "true")
            put("mail.smtp.socketFactory.port", "465")
            put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory")
        }

        val auth = object : Authenticator() {
            override fun getPasswordAuthentication() =
                    PasswordAuthentication(from, encryption.decrypt(pass))
        }

        val session = Session.getDefaultInstance(properties, auth)

        val message = MimeMessage(session)

        with(message) {
            setFrom(InternetAddress(from))
            for (to in tos) {
                addRecipient(Message.RecipientType.TO, InternetAddress(to))
                subject = subjects
                setContent(messages, "text/html; charset=utf-8")
            }
        }

        return message
    }
}