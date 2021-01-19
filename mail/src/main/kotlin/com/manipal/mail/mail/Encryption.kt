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
        //val charArray = messageString.toCharArray()
        var charArray=messageString.toMutableList()
        for (i in messageString.indices) {
            //System.out.println("before="+charArray[i]);

            charArray[i] = charArray[i] + key
            //System.out.println("after="+charArray[i]);
            val temp = codedString
            //System.out.println(temp);
            codedString = temp + charArray[i]
        }
        //codedString=charArray.toString();
        return codedString
    }

    @Throws(IOException::class)
    fun decrypt(codedString: String): String {
        var messageString = ""
        val file = File("src/main/kotlin/com/manipal/mail/mail/key.txt")
        val fileInputStream = FileInputStream(file)
        keys = String(fileInputStream.readAllBytes())
        //System.out.println(keys);
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
        //println(messageString)
        return messageString
    }

    companion object {
        private var keys = ""
    }
}