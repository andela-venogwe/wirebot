const isSubjectAdequate = entered_subject => {
  return entered_subject.split(' ').length > 10;
};

module.exports = {
  isSubjectAdequate
};
