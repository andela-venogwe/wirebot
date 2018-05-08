const populateHours = () => {
  const hours = [];
  
  for (let i = 1; i < 13; i++) {
    if (String(i).length < 2) {
      hours.push({
        text: '0' + String(i),
        value: '0' + String(i)
      });
    } else {
      hours.push({
        text: String(i),
        value: String(i)
      });
    }
  }
  
  return hours;
};
  
const populateMinutes = () => {
  const minutes = [];
  
  for (let i = 0; i < 60; i++) {
    if (String(i).length < 2) {
      minutes.push({
        text: '0' + String(i),
        value: '0' + String(i)
      });
    } else {
      minutes.push({
        text: String(i),
        value: String(i)
      });
    }
  }
  
  return minutes;
};

module.exports = {
  populateHours,
  populateMinutes
};
