
# import module
import csv
from geopy.geocoders import Nominatim
from csv import writer
# initialize Nominatim API
geolocator = Nominatim(user_agent="geoapiExercises")




with open("./Positions.csv", 'r') as file:
  csvreader = csv.reader(file)
  for row in csvreader:

    if row[1] != "latitude" and row[3]!='Fenix':
        location = geolocator.reverse(row[1]+","+row[2])
        address = location.raw['address']
        city = address.get('city', '')
        country = address.get('country', '')
        code = address.get('country_code').upper()
        List = [row[0], code, city, row[3]]
        with open('Co.csv', 'a') as f_object:

            # Pass this file object to csv.writer()
            # and get a writer object
            writer_object = writer(f_object)
            # Pass the list as an argument into
            # the writerow()
            writer_object.writerow(List)
            # Close the file object
            f_object.close()


