const incidentHandlerVerification = (incidentLocation) => {
  const incidentCountry = incidentLocation.split(',')[2].trim().toUpperCase();

  const countries = {
    newYork: ['US', 'USA', 'UNITED STATES OF AMERICA', 'THE US', 'THE USA', 'AMERICA'],
    kenya: ['KENYA', 'KE'],
    nigeria: ['NIGERIA'],
    uganda: ['UGANDA', 'UG']
  };

  if (countries.newYork.includes(incidentCountry)) {
    return 'New York';
  } else if (countries.kenya.includes(incidentCountry)) {
    return 'Nairobi';
  } else if (countries.nigeria.includes(incidentCountry)) {
    return 'Lagos';
  } else if (countries.uganda.includes(incidentCountry)) {
    return 'Kampala';
  } else {
    return 'Elsewhere';
  }
};

module.exports = {
  incidentHandlerVerification
};
