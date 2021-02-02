package com.manipal.insurance

import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import springfox.documentation.swagger2.annotations.EnableSwagger2

@SpringBootApplication
@EnableSwagger2
class InsuranceApplication

fun main(args: Array<String>) {
    runApplication<InsuranceApplication>(*args)
}
