FROM python:3.7.5-slim
COPY requirements.txt .
COPY suggest.py .
COPY KafkaClient.py .
RUN pip install -r requirements.txt
CMD ["python", "KafkaClient.py"]
