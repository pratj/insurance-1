package com.manipal.insurance.model
import lombok.Data

@Data
class ChargeRequest {

    private var description: String = ""
    private var amount= 0
    private var currency:String = ""
    private var stripeEmail: String = ""
    private var stripeToken: String = ""
    fun getDescription(): String {
        return description
    }

    fun getAmount(): Int {
        return amount
    }

    fun getCurrency(): String {
        return currency
    }

    fun getStripeEmail(): String {
        return stripeEmail
    }

    fun getStripeToken(): String {
        return stripeToken
    }

    fun setDescription(description: String) {
        this.description = description
    }
    fun setStripeToken(stripeToken:String){
        this.stripeToken=stripeToken
    }
    fun setAmount(amount:Int){
        this.amount=amount*100
    }
    fun setStripeEmail(stripeEmail:String){
        this.stripeEmail=stripeEmail
    }
    fun setCurrency(currency: String) {
        this.currency = currency
    }
}