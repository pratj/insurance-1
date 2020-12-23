package com.manipal.insurance.model

class CarDetails {
    var model:String = ""
    var manufacturer:String=""
    var variant:String=""

    constructor(model: String, manufacturer: String, variant: String) {
        this.model = model
        this.manufacturer = manufacturer
        this.variant = variant
    }

    override fun toString(): String {
        return "carDetails(model='$model', manufacturer='$manufacturer', variant='$variant')"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is CarDetails) return false

        if (model != other.model) return false
        if (manufacturer != other.manufacturer) return false
        if (variant != other.variant) return false

        return true
    }

    override fun hashCode(): Int {
        var result = model.hashCode()
        result = 31 * result + manufacturer.hashCode()
        result = 31 * result + variant.hashCode()
        return result
    }
}