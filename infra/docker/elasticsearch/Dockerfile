FROM docker.elastic.co/elasticsearch/elasticsearch:7.14.0

# install Japanese (kuromoji) analysis plugin
# https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-kuromoji.html
RUN elasticsearch-plugin install analysis-kuromoji

# install icu analysis plugin
# https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-icu.html
RUN elasticsearch-plugin install analysis-icu