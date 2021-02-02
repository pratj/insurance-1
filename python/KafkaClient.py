#!/usr/bin/env python
# coding: utf-8
import suggest as suggest
import json
from json import dumps
from kafka import KafkaConsumer
from kafka import KafkaProducer

bootstrap_servers = 'pkc-419q3.us-east4.gcp.confluent.cloud:9092'
security_protocol = "SASL_SSL"
sasl_mechanism = "PLAIN"
sasl_plain_username = "X2NQSG5C5IIK77KO"
sasl_plain_password = "UvAQt5puenQeVd7t4EPloA22JALOeAfSHPEQPp/2pNUOeCc7RO6KLuThrksFy3GC"
print("client opened")
consumer = KafkaConsumer('pipe', group_id='suggester_group',
                         auto_offset_reset='earliest',
                         enable_auto_commit=True,
                         bootstrap_servers=bootstrap_servers,
                         security_protocol=security_protocol,
                         sasl_mechanism=sasl_mechanism,
                         sasl_plain_username=sasl_plain_username,
                         sasl_plain_password=sasl_plain_password
                         )
producer = KafkaProducer(
    value_serializer=lambda x: dumps(x).encode('utf-8'),
    bootstrap_servers=bootstrap_servers,
    security_protocol=security_protocol,
    sasl_mechanism=sasl_mechanism,
    sasl_plain_username=sasl_plain_username,
    sasl_plain_password=sasl_plain_password
)
print("Connected to Kafka Server")
for msg in consumer:
    text = str(msg.value)
    text = text[:-1]
    texts = text.split(",", 1)
    print("New Message Received")
    if "quote" in texts[0]:
        print("processing")
        data = json.loads(texts[1])
        output = suggest.suggest(data["category"], data["product"])
        if len(output) != 0:
            message = {"email": data.get("formData").get("email"),
                       "userName": data.get("formData").get("fullName"),
                       "category": output
                       }
            producer.send('pipe', "suggest," + json.dumps(message))
            print("got the suggestion")
    else:
        print("message rejected")
