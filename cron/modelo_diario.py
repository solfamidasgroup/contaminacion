from influxdb import DataFrameClient
from prophet import Prophet
import pandas as pd
from datetime import timedelta

client = DataFrameClient('a3561eeddaf3a42d0a9aa071c8ef8f56-429670661.eu-central-1.elb.amazonaws.com', 61666, 'admin', 'password', 'tfg')

df_cont1 = client.query("select * from datos_contaminacion_moratalaz")

df_cont = df_cont1['datos_contaminacion_moratalaz']
df_cont = df_cont.reset_index()
df_cont = df_cont.rename(columns={'dioxido_nitrogeno': 'y'})
df_cont = df_cont.rename(columns={'index': 'ds'})
df_cont = df_cont.drop(['tag'], axis=1)
df_cont['ds'] = df_cont['ds'].dt.tz_localize(None)

print("modelo dioxido_nitrogeno correcto")

df8 = df_cont[['ds','dioxido_azufre']]
df8 = df8.rename(columns={'dioxido_azufre': 'y'})
m8 = Prophet(yearly_seasonality=True, weekly_seasonality=False, daily_seasonality=True)
m8.fit(df8)
future = m8.make_future_dataframe(periods=3, freq='H')
forecast8 = m8.predict(future)
predict_df = forecast8[['ds', 'yhat']]
predict_df = predict_df.rename(columns={'yhat': 'dioxido_azufre'})

print("modelo dioxido_azufre correcto")

df9 = df_cont[['ds','monoxido_nitrogeno']]
df9 = df9.rename(columns={'monoxido_nitrogeno': 'y'})
m9 = Prophet(yearly_seasonality=True, weekly_seasonality=False, daily_seasonality=True)
m9.fit(df9)
forecast9 = m9.predict(future)
predict_df = predict_df.assign(monoxido_nitrogeno = forecast9['yhat'])

print("modelo monoxido_nitrogeno correcto")

df10 = df_cont[['ds','oxidos_nitrogeno']]
df10 = df10.rename(columns={'oxidos_nitrogeno': 'y'})
m10 = Prophet(yearly_seasonality=True, weekly_seasonality=False, daily_seasonality=True)
m10.fit(df10)
forecast10 = m10.predict(future)
predict_df = predict_df.assign(oxidos_nitrogeno = forecast10['yhat'])

print("modelo oxidos_nitrogeno correcto")

df11 = df_cont[['ds','particulas_10']]
df11 = df11.rename(columns={'particulas_10': 'y'})
m11 = Prophet(yearly_seasonality=True, weekly_seasonality=False, daily_seasonality=True)
m11.fit(df11)
forecast11 = m11.predict(future)
predict_df = predict_df.assign(particulas_10 = forecast11['yhat'])

print("modelo particulas_10 correcto")


df12 = df_cont[['ds','y']]
m12 = Prophet(yearly_seasonality=True, weekly_seasonality=False, daily_seasonality=True)
m12.fit(df12)
forecast12 = m12.predict(future)
predict_df = predict_df.assign(y = forecast12['yhat'])
predict_df = predict_df.rename(columns={'y': 'dioxido_nitrogeno'})

df_guardar = predict_df.tail(3)

tag = ['model1', 'model2', 'model3']

df_guardar["tag"] = tag

df_guardar = df_guardar.rename(columns={"ds":"time"})

df_guardar["time"] = pd.to_datetime(df_guardar['time'])

df_guardar.set_index('time', inplace=True)

print(df_guardar)

db = "modelo"

client.query("DROP MEASUREMENT modelo")

client.write_points(df_guardar, db, tag_columns=['tag'], protocol='line')