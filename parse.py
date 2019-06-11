import json

d = {}
with open('itemdata') as json_file:
    data = json.load(json_file)
    for item in data:
        d[item["name"].lower()] = item["name"]

with open('formatted_itemdata', 'w') as outfile:
    json.dump(d, outfile)