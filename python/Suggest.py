#!/usr/bin/env python
# coding: utf-8

# In[1]:


from pymongo import MongoClient
from pprint import pprint
import pandas as pd
client = MongoClient(port=27017)
db=client.insurance
cursor=db.quotes.aggregate([{"$group":{"_id":{"email":"$formData.email","category":"$category","product":"$product"}}},{"$project":{"email":"$_id.email","category":"$_id.category","product":"$_id.product","_id":0}}])


# In[19]:


def suggest(category,product):
    client = MongoClient(port=27017)
    db=client.insurance
    cursor=db.quotes.aggregate([{"$group":{"_id":{"email":"$formData.email","category":"$category","product":"$product"}}},{"$project":{"email":"$_id.email","category":"$_id.category","product":"$_id.product","_id":0}}])
    data=pd.DataFrame(cursor)
    data["categoryProduct"]=data["category"]+","+data["product"]
    categoryProduct=set(data["categoryProduct"])
    outputData=list()
    for i in categoryProduct:
        iUsers=set(data.email[data["categoryProduct"]==i])    
        for j in categoryProduct:
            curOutput=list()
            curOutput.append(i)
            curOutput.append(j)
            jUsers=set(data.email[data["categoryProduct"]==j])
            curOutput.append(len(iUsers&jUsers))
            outputData.append(curOutput)
    outputData=pd.DataFrame(outputData,columns=["i","j","count"])
    categoryProduct=category+","+product
    processData=outputData[outputData["i"]==categoryProduct]
    #print(processData)
    #print("length")
    #print(len(set(data.email[data["categoryProduct"]==categoryProduct])))
    total=len(set(data.email[data["categoryProduct"]==categoryProduct]))
    if(total>0):
        processData["count"]=(processData["count"]*100)/total
        #print(processData)
        categories=set(processData.j[processData["count"]>60])
        categoryList=list()
        productList=list()
        for cat in categories:
            split=cat.split(",")
            if(category!=split[0] and product!=split[1]):
                categoryList.append(split[0])
                productList.append(split[1])
        return list(db.formConfig.find({"category":{"$in":categoryList},"product":{"$in":productList}},{"category":1,"product":1,"image":1,"info":1,"_id":0}))
    return list()


# In[20]:


suggest("Travel Insurance","Overseas Travel Insurance")


# In[ ]:





# In[ ]:




