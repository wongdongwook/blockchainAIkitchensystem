import artikcloud
from artikcloud.rest import ApiException
import sys, getopt
import time, json
from pprint import pprint
from sklearn.linear_model import LinearRegression
import numpy as np

temparray=np.array([[32],[35],[31],[34],[32]])
tempindex=np.array([[1],[2],[3],[4],[5]])
model=LinearRegression()
dla=[1,32,34,31,32]


def main(argv):
    
  
	DEFAULT_CONFIG_PATH = 'config.json'
	
	with open(DEFAULT_CONFIG_PATH, 'r') as config_file:
			config = json.load(config_file)
	print(config)

	# Configure Oauth2 access token for the client application
	artikcloud.configuration = artikcloud.Configuration();
	artikcloud.configuration.access_token = config['device_token']

	# Read ADC Pin (Temperature sensor)
	adcPATH = "/sys/devices/platform/c0000000.soc/c0053000.adc/iio:device0/in_voltage0_raw"
	target = open(adcPATH, 'r')
	adcVal = float(target.read(8))
	voltage = 0.439453125 * adcVal * 2
	temper = -36.875 + 217.75 * voltage/5000
	del dla[0]
	dla.append(temper)
	k=np.array(dla).reshape(-1,1)
	model.fit(tempindex,k)
	y=model.predict(7)
    
	target.close();
	print('  ')
	print ("Temper is", str(temper))
	print('  ')

	print('  ')
	print ("Predict Temper is", str(y))
	print('  ')

	# Create an instance of the API Class
	api_instance = artikcloud.MessagesApi()
	device_message = {}
	device_message['currentTemp'] = temper
	device_message['targetTemp'] = y[0][0]
	device_sdid = config['device_id']
	ts = None                         

	# Construct a Message Object for request
	data = artikcloud.Message(device_message, device_sdid, ts)

	try:
		pprint(artikcloud.configuration.auth_settings()) # Debug Print
		api_response = api_instance.send_message(data) # Send Message
		pprint(api_response)
	except ApiException as e:
		pprint("Exception when calling MessagesApi->send_message: %s\n" % e)

if __name__ == "__main__":
	while True:
		main(sys.argv[1:])
		time.sleep(5)