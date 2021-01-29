package com.manipal.mail.mail

import java.io.File
import java.io.FileInputStream
import java.io.IOException

class Encryption {
    constructor() {}
    constructor(key: String) {
        keys = key
    }

    fun encrypt(messageString: String, key: Int): String {
        var codedString = ""

        val charArray=messageString.toMutableList()
        for (i in messageString.indices) {

            charArray[i] = charArray[i] + key

            val temp = codedString

            codedString = temp + charArray[i]
        }

        return codedString
    }

    @Throws(IOException::class)
    fun decrypt(codedString: String): String {
        var messageString = ""
        val file = File("src/main/kotlin/com/manipal/mail/mail/key.txt")
        val fileInputStream = FileInputStream(file)
        keys = String(fileInputStream.readAllBytes())

        val keyArray = keys.toCharArray()
        var key = 0
        for (temp in keyArray) {
            key += temp.toInt()

        }

        key %= 100
        val charArray = codedString.toCharArray()
        for (i in codedString.indices) {
            charArray[i] =charArray[i]- key
            val temp = messageString
            messageString = temp + charArray[i]
        }

        return messageString
    }

    companion object {
        private var keys = ""
    }
}