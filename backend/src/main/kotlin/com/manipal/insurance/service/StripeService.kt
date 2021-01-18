package com.manipal.insurance.service

import com.manipal.insurance.model.ChargeRequest
import com.stripe.Stripe
import com.stripe.exception.*
import com.stripe.model.Charge
import org.springframework.stereotype.Service
import java.util.*
import javax.annotation.PostConstruct

@Service
class StripeService {

    private val secretKey: String ="sk_test_51I9lSYCARmi7rnrvTprfmhpt7Vc5uJYoe8cQrvGn61H3jveTb6gFLUPYWeljLB3F50TpFQNZksBjVTWsPO55Tq5L00U9v0aCBc"
    @PostConstruct
    fun init() {
        Stripe.apiKey = secretKey
    }

    @Throws(AuthenticationException::class, InvalidRequestException::class, APIConnectionException::class, CardException::class, APIException::class)
    fun charge(chargeRequest: ChargeRequest): Charge {
        val chargeParams: MutableMap<String, Any> = HashMap()
        chargeParams["amount"] = chargeRequest.amount
        chargeParams["currency"] = chargeRequest.currency
        chargeParams["description"] = chargeRequest.description
        chargeParams["source"] = chargeRequest.token
        return Charge.create(chargeParams)
    }
}