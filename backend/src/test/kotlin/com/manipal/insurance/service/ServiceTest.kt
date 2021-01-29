package com.manipal.insurance.service

import com.manipal.insurance.dao.Dao
import org.bson.Document
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
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
}