package com.manipal.insurance.model
import lombok.Data;

@Data
class ChargeRequest {
    var address=""
    var category:String= ""
    var partner:String= ""
    var product:String= ""

     var description: String = ""
     val amount = 0
     var currency: String = ""
     val stripeEmail: String = ""
     val token: String = ""

    constructor(address: String, category: String, partner: String, product: String, description: String, currency: String) {
        this.address = address
        this.category = category
        this.partner = partner
        this.product = product
        this.description = description
        this.currency = currency
    }

    override fun toString(): String {
        return "ChargeRequest(address='$address', category='$category', partner='$partner', product='$product', description='$description', amount=$amount, currency='$currency', stripeEmail='$stripeEmail', token='$token')"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ChargeRequest) return false

        if (address != other.address) return false
        if (category != other.category) return false
        if (partner != other.partner) return false
        if (product != other.product) return false
        if (description != other.description) return false
        if (amount != other.amount) return false
        if (currency != other.currency) return false
        if (stripeEmail != other.stripeEmail) return false
        if (token != other.token) return false

        return true
    }

    override fun hashCode(): Int {
        var result = address.hashCode()
        result = 31 * result + category.hashCode()
        result = 31 * result + partner.hashCode()
        result = 31 * result + product.hashCode()
        result = 31 * result + description.hashCode()
        result = 31 * result + amount
        result = 31 * result + currency.hashCode()
        result = 31 * result + stripeEmail.hashCode()
        result = 31 * result + token.hashCode()
        return result
    }
}