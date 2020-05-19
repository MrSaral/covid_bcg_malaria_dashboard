from flask import Flask, render_template, url_for
import pandas as pd
import json



read_covid_death_timeline = pd.read_csv('static/data/time_series_covid_19_deaths.csv')
covid_death_df = read_covid_death_timeline.copy()

covid_json = json.loads(covid_death_df.groupby(['Country/Region']).sum().iloc[:,[-1]].to_json())['5/18/20']

# print (covid_json)



app = Flask(__name__)

@app.route("/")

def home():
    return render_template("index.html",covid_json = covid_json)


if __name__ == "__main__":
    app.run(debug=True)