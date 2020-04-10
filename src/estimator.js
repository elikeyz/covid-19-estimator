const covid19ImpactEstimator = (data) => {
  const {
    periodType, timeToElapse, reportedCases, totalHospitalBeds, region
  } = data;
  const { avgDailyIncomeInUSD: avgIncome, avgDailyIncomePopulation: avgPop } = region;

  const currentlyInfected = reportedCases * 10;
  const severeCurrentlyInfected = reportedCases * 50;

  let numOfDays = timeToElapse;
  if (periodType === 'months') {
    numOfDays *= 30;
  } else if (periodType === 'years') {
    numOfDays *= 365;
  }
  const projectionFactor = 2 ** Math.floor(numOfDays / 3);

  const infectionsByRequestedTime = currentlyInfected * projectionFactor;
  const severeInfectionsByRequestedTime = severeCurrentlyInfected * projectionFactor;

  const severeCasesByRequestedTime = Math.floor(infectionsByRequestedTime * 0.15);
  const severeSevereCasesByRequestedTime = Math.floor(severeInfectionsByRequestedTime * 0.15);

  const availableHospitalBeds = Math.floor(totalHospitalBeds * 0.35);
  const hospitalBedsByRequestedTime = availableHospitalBeds - severeCasesByRequestedTime;
  const sHospitalBedsByRequestedTime = availableHospitalBeds - severeSevereCasesByRequestedTime;

  const casesForICUByRequestedTime = Math.floor(infectionsByRequestedTime * 0.05);
  const severeCasesForICUByRequestedTime = Math.floor(severeInfectionsByRequestedTime * 0.05);

  const casesForVentilatorsByRequestedTime = Math.floor(infectionsByRequestedTime * 0.02);
  const sCasesForVentilatorsByRequestedTime = Math.floor(severeInfectionsByRequestedTime * 0.02);

  const $sInFlight = Math.floor((infectionsByRequestedTime * avgIncome * avgPop) / 30);
  const s$sInFlight = Math.floor((severeInfectionsByRequestedTime * avgIncome * avgPop) / 30);

  const result = {
    data,
    impact: {
      currentlyInfected,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime,
      casesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime,
      dollarsInFlight: $sInFlight
    },
    severeImpact: {
      currentlyInfected: severeCurrentlyInfected,
      infectionsByRequestedTime: severeInfectionsByRequestedTime,
      severeCasesByRequestedTime: severeSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: sHospitalBedsByRequestedTime,
      casesForICUByRequestedTime: severeCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: sCasesForVentilatorsByRequestedTime,
      dollarsInFlight: s$sInFlight
    }
  };

  return result;
};

export default covid19ImpactEstimator;
