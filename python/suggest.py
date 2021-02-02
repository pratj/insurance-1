#!/usr/bin/env python
# coding: utf-8
from pymongo import MongoClient
from pprint import pprint
import pandas as pd


def suggest(category, product):
    client = MongoClient(
        "mongodb+srv://pynondarashwin:MeYbvUAaJWtF3fqa@cluster0.led5h.mongodb.net/insurance?retryWrites=true&w=majority")
    db = client.insurance
    print("Connected to MongoDB Server")
    cursor = db.quotes.aggregate(
        [{"$group": {"_id": {"email": "$formData.email", "category": "$category", "product": "$product"}}},
         {"$project": {"email": "$_id.email", "category": "$_id.category", "product": "$_id.product", "_id": 0}}])

    data = pd.DataFrame(cursor)
    if len(data):
        print(data)
        data["categoryproduct"] = data["category"] + "," + data["product"]
        categoryproduct = set(data["categoryproduct"])
        outputdata = list()
        for i in categoryproduct:
            iusers = set(data.email[data["categoryproduct"] == i])
            for j in categoryproduct:
                curoutput = list()
                curoutput.append(i)
                curoutput.append(j)
                jusers = set(data.email[data["categoryproduct"] == j])
                curoutput.append(len(iusers & jusers))
                outputdata.append(curoutput)
        outputdata = pd.DataFrame(outputdata, columns=["i", "j", "count"])
        categoryproduct = category + "," + product
        processdata = outputdata[outputdata["i"] == categoryproduct]

        print("length")
        print(len(set(data.email[data["categoryproduct"] == categoryproduct])))
        total = len(set(data.email[data["categoryproduct"] == categoryproduct]))
        if total > 0:
            processdata["count"] = (processdata["count"] * 100) / total
            print(processdata)
            categories = set(processdata.j[processdata["count"] > 60])
            categorylist = list()
            productlist = list()
            for cat in categories:
                split = cat.split(",")
                if category != split[0] and product != split[1]:
                    categorylist.append(split[0])
                    productlist.append(split[1])
            return list(db.formConfig.find({"category": {"$in": categorylist}, "product": {"$in": productlist}},
                                           {"category": 1, "product": 1, "image": 1, "info": 1, "_id": 0}))
    return list()
