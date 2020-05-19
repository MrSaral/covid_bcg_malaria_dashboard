from flask import Flask, render_template, url_for
import pandas as pd
import json



read_malaria_df=pd.read_csv('static/data/death-rates-malaria.csv')

malaria_df=read_malaria_df.copy()
# print (malaria_df)

malaria_df = (malaria_df.groupby(['Entity']).mean())

malaria_df.drop(columns=['Year'],inplace=True)



malaria_json=json.loads(malaria_df.to_json())['Deaths - Malaria - Sex: Both - Age: Age-standardized (Rate) (deaths per 100,000 individuals)']



app = Flask(__name__)

@app.route("/")

def home():
    return render_template("index.html",malaria_json=malaria_json)


if __name__ == "__main__":
    app.run(debug=True)