FROM postgres:alpine

WORKDIR assets
COPY assets/computer_security_principles_and_practice.jpg computer_security_principles_and_practice.jpg
COPY assets/python_data_analysis.jpeg python_data_analysis.jpeg

WORKDIR /
COPY dummy_data.sql /docker-entrypoint-initdb.d/



